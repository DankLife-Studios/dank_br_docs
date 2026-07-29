# br-bots

NPC bot combatants for solo admin testing of the full BR loop (drop → zone walk → elim → last survivor wins). Bots are a parallel roster — they are not fake player sources. A single **AI host** (prefer observing admin) drives ped AI.

← [Docs index](../README.md)

## Dependencies

**Hard:** `br-lib`

**Soft/runtime:** `br-match`, `br-airplane`, `br-zone`, `br-admin`

## Config (`shared/config.lua`)

| Key | Default | Notes |
|-----|---------|-------|
| `TestMode` | `true` | Shorter jumps, auto-skip warmup, early zone |
| `TestJumpDelayMinMs` / `Max` | `3000` / `15000` | Jump window in TestMode |
| `TestAutoSkipWarmup` | `true` | Skip warmup after drop |
| `TestZoneStartSeconds` | `15` | Early zone after Fight!; `0` = match default |
| `DefaultCount` / `MaxCount` | `8` / `24` | Queue sizes |
| `ShowBlips` / `ShowNames` | `true` | Observer overlays |
| `ScatterRadius` | `85` | Per-bot offset around zone center |
| `StuckTimeoutMs` | `8000` | Nudge if bot stops moving |
| `ZoneDamageEnabled` | `true` | Storm damages bot peds |
| `CombatEnabled` | `true` | Bots fight nearby players with a pistol |
| `CombatWeapon` / `CombatRange` | `WEAPON_PISTOL` / `55` | Combat-lite |
| `PedModels` | ambient pool | Random appearance |

## Commands

| Command | Access | Description |
|---------|--------|-------------|
| `/botmatch [count]` | `group.admin` | Duty + observe, queue bots, start match (min 2 bots) |
| `/spawnbots [count]` | `group.admin` | Queue bots for next `/startmatch` |
| `/clearbots` | `group.admin` | Clear queue / despawn |
| `/botstatus` | `group.admin` | Alive count, stages, AI host, match id |
| `/botkill [id\|all]` | `group.admin` | Force-eliminate bots |
| `/botgoto [id]` | `group.admin` | Teleport to a bot |

F10 Match tab: **Bot Match**, **Queue Bots**, **Clear Bots**.

## Flow

1. `/botmatch 8` → observe match bucket
2. Bots glue to plane path, jump on staggered timers (TestMode: 3–15s)
3. Warmup auto-skips in TestMode; zone starts after `TestZoneStartSeconds`
4. Bots path to zone center (scatter + sprint if far/outside); optional combat vs you
5. Kill bots (or storm / `/botkill`) → last survivor wins

## Server exports

```lua
exports['br-bots']:GetQueuedCount() -> number
exports['br-bots']:SetQueuedCount(count) -> number
exports['br-bots']:ClearQueue()
exports['br-bots']:QueueBots(count) -> ok, err?
exports['br-bots']:CountAlive() -> number
exports['br-bots']:GetAliveTeamIds() -> number[]
exports['br-bots']:GetLastAliveTeamId() -> number|nil
exports['br-bots']:AllBotsJumped() -> boolean
exports['br-bots']:HasActiveBots() -> boolean
exports['br-bots']:GetAiHost() -> number|nil
exports['br-bots']:OnMatchStart(matchId, startTeamId) -> spawned, nextTeamId
exports['br-bots']:OnMatchEnd()
exports['br-bots']:ForceJumpAll()
exports['br-bots']:EliminateBot(botId, killerSrc?)
exports['br-bots']:DamageBotsOutsideZone(cx, cy, radius, damage)
```

## Out of scope

No loot inventory, lifeline, bot-vs-bot teams, citizenids, or leaderboard rows.
