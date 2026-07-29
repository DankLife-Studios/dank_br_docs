# br-bots

NPC bot combatants for solo admin testing of the full BR loop (drop → zone walk → elim → last survivor wins). Bots are a parallel roster — they are not fake player sources.

← [Docs index](../README.md)

## Dependencies

**Hard:** `br-lib`

**Soft/runtime:** `br-match`, `br-airplane`, `br-zone`, `br-admin`

## Config (`shared/config.lua`)

| Key | Default | Notes |
|-----|---------|-------|
| `DefaultCount` | `8` | `/botmatch` / `/spawnbots` default |
| `MaxCount` | `24` | Cap |
| `MatchBucket` | `2` | Same as match |
| `JumpDelayMinMs` / `JumpDelayMaxMs` | `5000` / `90000` | Random jump after drop start |
| `RepathIntervalMs` | `4000` | Walk-to-zone repath |
| `FallbackCenter` | map midpoint | Used before zone starts |
| `PedModels` | ambient pool | Random appearance |

## Commands

| Command | Access | Description |
|---------|--------|-------------|
| `/botmatch [count]` | `group.admin` | Duty + observe match bucket, queue bots, start match (works with 0 lobby players; min 2 bots) |
| `/spawnbots [count]` | `group.admin` | Queue bots for the next `/startmatch` |
| `/clearbots` | `group.admin` | Clear queue and despawn active bots |

F10 admin menu (Match tab): **Bot Match**, **Queue Bots**, **Clear Bots**.

## Flow

1. Admin runs `/botmatch 8` (or queues bots then `/startmatch`)
2. Match starts; bots spawn in the match bucket and ride the shared plane path
3. Each bot jumps at a random delay; parachute + land
4. After Fight!, bots path toward the live zone center
5. Admin (on duty / observe) kills bots to simulate combat
6. Last alive bot (or human) triggers win + `EndMatch`

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
exports['br-bots']:OnMatchStart(matchId, startTeamId) -> spawned, nextTeamId
exports['br-bots']:OnMatchEnd()
exports['br-bots']:ForceJumpAll()
```

## Out of scope

No looting, bot-vs-bot combat, lifeline, inventory, or stats persistence. Solo team-per-bot only.
