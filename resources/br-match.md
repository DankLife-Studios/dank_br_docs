# br-match

Match lifecycle: pull lobby → bucket `2` → airplane drop → warmup → fight → last player/team wins → back to lobby. Late joiners wait in lobby. Gamemode + friendly fire settings. Central orchestrator for the fight loop.

← [Docs index](../README.md)

## Dependencies

**Hard:** `br-lib`, `br-core`, `br-lobby`, `br-airplane`, `br-zone`, `br-hud`

**Soft/runtime:** `br-teams`, `br-admin`, `br-inventory`, `br-loot`, `br-airdrops`, `br-weather`, `br-crates`

## Config (`shared/config.lua`)

```lua
Config.MinPlayersToStart = 1   -- testing; raise for production
Config.MaxPlayers = 64
Config.WarmupSeconds = 10
Config.ZoneStartDelaySeconds = 300
Config.ElimReturnDelayMs = 5000
Config.DefaultGamemode = 'solo'  -- solo|duo|triple|quad
Config.DefaultFriendlyFire = false
Config.TeamSizes = { solo = 1, duo = 2, triple = 3, quad = 4 }
Config.Buckets = { Lobby = 1, Match = 2 }
```

## Match states

`Waiting` → `Loading` → `Warmup` → `Starting` → `InProgress` → `Finished` → `Cleanup`

## Commands

| Command | Access | Description |
|---------|--------|-------------|
| `/startmatch` | `group.admin` | Start match from lobby |
| `/endmatch` | `group.admin` | Force-end match |
| `/quitmatch` | `group.admin` | Quit match for yourself |

## Events

| Event | Side |
|-------|------|
| `br-match:client:enter` | client — `(matchId, meta)` |
| `br-match:client:fight` | client |
| `br-match:client:end` | client |
| `br-match:client:spectate` | client — teammates |
| `br-match:client:stopSpectate` | client |
| `br-match:server:eliminated` | server |
| `br-match:server:playerDied` | server |
| Internal | `br-match:server:setDropStage`, `br-airplane:server:dropComplete` |

## State

Sets `GlobalState.brGamemode`, `brFriendlyFire`, `brTeamSize`.

Player: `brPhase`, `brMatchId`, `brAlive`, `brTeamId`, `brFriendlyFire`.

## Orchestration (what StartMatch drives)

1. Collect lobby players (exclude admin duty) via [br-lobby](br-lobby.md)
2. Build teams from [br-teams](br-teams.md) party map; clear parties
3. Move to match bucket; set state bags
4. [br-airplane](br-airplane.md) `StartDrop` → on complete → warmup → fight
5. Start [br-loot](br-loot.md), [br-airdrops](br-airdrops.md); delay then [br-zone](br-zone.md)
6. Sync [br-hud](br-hud.md); eliminate / spectate / win
7. Stats via [br-core](br-core.md) `ApplyMatchResult`; crates via [br-crates](br-crates.md)
8. Cleanup systems → [br-lobby](br-lobby.md) `EnterLobby`

## Server exports

```lua
exports['br-match']:GetMatchState() -> string
exports['br-match']:IsMatchActive() -> boolean      -- Loading|Warmup|Starting|InProgress
exports['br-match']:IsMatchInProgress() -> boolean  -- alias of IsMatchActive
exports['br-match']:ShouldJoinLobbyOnly() -> boolean
exports['br-match']:GetMinPlayersToStart() -> number
exports['br-match']:StartMatch() -> ok, reason?
exports['br-match']:EndMatch()
exports['br-match']:EliminatePlayer(src, killer?) -- optional killer server id for kill credit
exports['br-match']:IsCombatant(src) -> boolean
exports['br-match']:GetMatchStatus() -> { state, matchId, alive, total, mode, friendlyFire, teamSize, gamemode, ... }
exports['br-match']:GetMatchRoster() -> { matchId, sources }|nil
exports['br-match']:GetAliveTeammates(src) -> number[] -- includes downed; excludes self
exports['br-match']:GetTeamMembers(srcOrTeamId) -> number[]
exports['br-match']:BroadcastKillfeed(payload) -- { killer, victim, environmental?, knocked? }
exports['br-match']:AdminQuitPlayer(src) -> boolean
exports['br-match']:AdminEliminate(src) -> boolean
exports['br-match']:AdminSkipWarmup() -> boolean
exports['br-match']:GetGamemodeSettings() -> { mode, friendlyFire, teamSize }
exports['br-match']:SetGamemodeSettings(mode, friendlyFire?) -> ok, reason?
```

## Client exports

```lua
exports['br-match']:IsMatchSpectating() -> boolean
exports['br-match']:StopMatchSpectate()
```

## Usage

```lua
local ok, err = exports['br-match']:StartMatch()
if not ok then print(err) end

exports['br-match']:SetGamemodeSettings('duo', false)
local status = exports['br-match']:GetMatchStatus()
exports['br-match']:AdminSkipWarmup()
exports['br-match']:EndMatch()
```
