# br-lobby

Wait room between matches. Routing bucket `1`, spawn at Bolingbroke prison, invincible. Auto matchmaking countdown when eligible lobby ≥ `MinPlayersToStart` from [br-match](br-match.md).

← [Docs index](../README.md)

## Dependencies

`br-lib`, `br-core` (soft: `br-admin`, `br-match`, `br-teams`, `br-multicharacter`)

## Config (`shared/config.lua`)

```lua
Config.Buckets = { Lobby = 1, Match = 2 }
Config.LobbySpawn = vec4(1729.14, 2534.71, 45.56, 180.0)
Config.FreezeInLobby = false
Config.InvincibleInLobby = true
Config.MatchCountdownSeconds = 300
Config.CountdownNotifyInterval = 30
```

## Commands

None (entry via events / exports).

## Events

| Event | Side | Payload |
|-------|------|---------|
| `br-lobby:server:enter` | server | Enter lobby |
| `br-lobby:client:enter` | client | Spawn/setup lobby |
| `br-lobby:client:countdown` | client | `{ active, remaining? }` |

## State

| Key | Notes |
|-----|-------|
| `GlobalState.brLobbyCountdown` | seconds or `nil` |
| `Player.state.brPhase` | `'lobby'` or `'admin'` if on duty |
| `brMatchId` / `brAlive` | cleared on enter |

## Server exports

```lua
exports['br-lobby']:GetLobbyPlayers() -> table<number, boolean>  -- raw set incl. admins
exports['br-lobby']:IsInLobby(src) -> boolean
exports['br-lobby']:EnterLobby(src)                               -- bucket 1, phase, notify
exports['br-lobby']:LeaveLobby(src)                               -- notifies br-teams
exports['br-lobby']:GetLobbyPlayerList() -> number[]              -- excludes admin-duty
exports['br-lobby']:EvaluateMatchmaking()                         -- start/cancel countdown
exports['br-lobby']:PauseCountdown() -> boolean
exports['br-lobby']:ResumeCountdown() -> boolean
exports['br-lobby']:CancelCountdown(reason?) -> boolean
```

## Usage

```lua
exports['br-lobby']:EnterLobby(source)
local list = exports['br-lobby']:GetLobbyPlayerList()
exports['br-lobby']:EvaluateMatchmaking()
```
