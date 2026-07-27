# Overview

Dank’s BR is a FiveM Battle Royale stack. Players connect through a queue, pick a single character, wait in a lobby (bucket `1`), then enter matches (bucket `2`) for airplane drop, fight, storm, loot, and airdrops. Career stats, weapon tints, and win crates persist between matches.

← [Docs index](README.md) · [Commands](commands.md) · [Root README](../resources/README.md)

## Architecture

| Layer | Resources |
|-------|-----------|
| Connect | [br-queue](resources/br-queue.md), [br-loadscreen](resources/br-loadscreen.md) |
| Foundation | [br-lib](resources/br-lib.md), [br-core](resources/br-core.md), [br-chat](resources/br-chat.md), [oxmysql](dependencies.md), [pma-voice](dependencies.md) |
| Items / interact | [br-inventory](resources/br-inventory.md), [br-target](resources/br-target.md) |
| Identity | [br-multicharacter](resources/br-multicharacter.md), [br-appearance](resources/br-appearance.md) |
| Lobby meta | [br-lobby](resources/br-lobby.md), [br-teams](resources/br-teams.md), [br-tints](resources/br-tints.md), [br-crates](resources/br-crates.md), [br-leaderboard](resources/br-leaderboard.md) |
| Match systems | [br-airplane](resources/br-airplane.md), [br-loot](resources/br-loot.md), [br-airdrops](resources/br-airdrops.md), [br-zone](resources/br-zone.md), [br-hud](resources/br-hud.md), [br-lifeline](resources/br-lifeline.md), [br-weather](resources/br-weather.md) |
| Orchestration | [br-match](resources/br-match.md), [br-admin](resources/br-admin.md) |

API naming: `br-*` resources, `br:*` convars, events under `br-lib:*` / `br-core:*` / `br-inventory:*` / `BRCore:*`. No `ox_lib` / `qbx_core` / `ox_inventory` provides.

## Game loop

{{game-loop-flow}}

### Concrete flow

1. **Connect** → `br-queue` (if enabled / full) → loadscreen → session.
2. **Character select** (`br-multicharacter`) — 1 slot.
3. **New player**: `br-core` Login → default spawn → `qb-clothes:client:CreateFirstCharacter` → appearance save → **lobby**.
4. **Returning player**: Login → skip last-coords RP spawn → **lobby**.
5. **Lobby**: prison yard, invincible, `brPhase = 'lobby'`. `/teams` (when mode ≠ solo), `/tints`, `/crates`, `/leaderboard` (or F7). When eligible lobby count ≥ `MinPlayersToStart`, a **300s** countdown starts; if count drops below min, countdown cancels. On zero → `exports['br-match']:StartMatch()`. Admin `/startmatch` overrides.
6. **Gamemode** (admin Match tab): Solo / Duo / Triple / Quad + friendly fire. Editable only while match is `Waiting`. Mirrored in `GlobalState.brGamemode` / `brFriendlyFire` / `brTeamSize`.
7. **Match**: leave lobby → assign `teamId` from parties (unteamed = solo teams) → match bucket → airplane → jump or force-eject → 10s warmup → fight → zone + loot + airdrops. HUD **Alive** = players (solo) or teams. Win = last player/team; **every** winning team member (including dead spectators) gets win + crate.
8. **Death** (Fight only): in non-solo with an alive teammate → [br-lifeline](resources/br-lifeline.md) last stand (15s); teammates can revive via br-target. Bleedout / solo / no mates → eliminate. Alive teammates remain → spectate (← →); team wiped → placement banner → lobby after ~5s.
9. **Late join** during an active match: stay in lobby for the next match.

## Routing buckets

| Bucket | Use |
|--------|-----|
| `1` | Lobby (`Config.Buckets.Lobby`) |
| `2` | Match (`Config.Buckets.Match`) |

Selection buckets used briefly by multicharacter are cleared via `ClearSelectionBucket`.

## Match states

`Waiting` → `Loading` → `Warmup` → `Starting` → `InProgress` → `Finished` → `Cleanup`

## State bags & GlobalState

### Player state

| Key | Meaning |
|-----|---------|
| `brPhase` | `'lobby'` \| `'match'` \| `'admin'` |
| `brMatchId` | Active match id or nil |
| `brAlive` | Combatant alive flag |
| `brDowned` | In last stand ([br-lifeline](resources/br-lifeline.md)) |
| `brTeamId` | Match team id |
| `brFriendlyFire` | Match FF mirror |
| `brLobbyTeamId` | Lobby party id ([br-teams](resources/br-teams.md)) |
| `brAdminDuty` | Admin on duty |
| `isLoggedIn` | Session logged in ([br-core](resources/br-core.md)) |
| `instance` | Routing bucket |
| `canUseWeapons` / `canSteal` / `invOpen` / `invBusy` | Inventory / combat gates |

### GlobalState

| Key | Owner | Meaning |
|-----|-------|---------|
| `brLobbyCountdown` | br-lobby | Seconds left or `nil` |
| `brGamemode` | br-match | `solo` \| `duo` \| `triple` \| `quad` |
| `brFriendlyFire` | br-match | boolean |
| `brTeamSize` | br-match | max party size |
| `PlayerCount` / `MaxPlayers` / `PVPEnabled` | br-core | server meta |
| `weather` / `weatherQueue` / `freezeWeather` / `blackOut` | br-weather | weather |
| `currentTime` / `timeScale` / `freezeTime` / `isNight` | br-weather | time |

Career stats live in `metadata.br` and MySQL `player_stats` (wins / kills / deaths / matches / rank).

## Admin duty

ACE `group.admin` (same as `/startmatch`). `/adminduty` or menu **Toggle Admin Duty** sets `brPhase = 'admin'`. On-duty admins are omitted from lobby matchmaking counts and never enter `Match.players` / plane / zone. **Enter Observe** moves them to match bucket `2` with noclip + invisible + godmode. Menu: **F10** or `/admin`.

## Voice & targeting

- **Voice:** Push-to-talk = game voice key. **F11** cycles Whisper → Normal → Yell. Mic indicator on [br-hud](resources/br-hud.md).
- **Targeting:** Hold **Left Alt** for [br-target](resources/br-target.md). Do not start `ox_target`.

## Progress

**In place**

- Core session/player DB, bans, ACE
- Single-character select + appearance
- Lobby ↔ match buckets and handoffs
- Inventory on br-core / br-lib
- Tints, crates, leaderboard
- Connection queue + lobby auto-matchmaking
- Match loop: plane, zone, loot, airdrops, HUD, teams, spectate
- Gamemode solo/duo/triple/quad + friendly fire
- Admin NUI (F10): moderation, observe, match controls, gamemode, tools
- Weather / time sync

**Not built yet**

- Multiple arenas / map rotation
- Teammate pings (lobby party blips exist; match pings do not)

**Also in place**

- Last stand / teammate revive (`br-lifeline`) in non-solo modes

## Start order

Matches live `server.cfg` (source of truth):

1. **CFX / early UI:** `br-loadscreen` → `mapmanager` → `br-chat` (`stop chat`) → `spawnmanager` → `sessionmanager` → `hardcap`
2. **Framework:** `oxmysql` → `br-lib` → `br-core` → `pma-voice` → `br-weather` → `br-target` → `br-queue` → `br-inventory` → `br-appearance` → `br-multicharacter` → `br-tints` → `br-crates` → `br-leaderboard`
3. **BR loop:** `br-lobby` → `br-teams` → `br-airplane` → `br-loot` → `br-airdrops` → `br-zone` → `br-hud` → `br-lifeline` → `br-match` → `br-admin`

`br-queue` stops `hardcap` on start (even if `server.cfg` ensured it earlier). Do not start `ox_target` or `basic-gamemode`. Stock CFX notes: [Dependencies](dependencies.md#stock-cfx-resources).

## Notable defaults

| Setting | Value | Location |
|---------|-------|----------|
| `MinPlayersToStart` | `1` (testing) | `br-match/shared/config.lua` |
| Lobby countdown | `300` s | `br-lobby/shared/config.lua` |
| Warmup | `10` s | `br-match/shared/config.lua` |
| Zone start delay after fight | `300` s | `br-match/shared/config.lua` |
| Admin open | `/admin` + F10 | `br-admin` |

## Related

- [Commands](commands.md)
- [Dependencies](dependencies.md)
- [Resource pages](README.md#resources)
- [Exports index](README.md#exports--public-apis-by-resource)
