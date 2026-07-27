# br-queue

FiveM **connection** deferral queue (Join screen Adaptive Card). Admits players when slots free, then hands off to normal connect. Does **not** own lobby/match.

← [Docs index](../README.md)

## Dependencies

`br-lib`

## Config (`shared/config.lua`)

| Key | Default | Notes |
|-----|---------|-------|
| `Enabled` | `true` | Master toggle |
| `RefreshMs` | `2500` | Card refresh |
| `MaxSlots` | `sv_maxclients` | Cap |
| `EstimatedJoinSeconds` | `30` | ETA display |
| `ReservationTimeout` | `120` | Reserved slot TTL |
| Discord | convars | `br:discord_bot_token`, `br:discord_guild_id` |
| Whitelist / priority | off | FIFO by license when empty |

On start: `StopResource('hardcap')`. Live `server.cfg` may `ensure hardcap` before `br-queue`; queue stops it afterward. Do not rely on stock hardcap for join limiting.

## Commands

None.

## Events

| Event | Side | Notes |
|-------|------|-------|
| `br-queue:server:spawned` | server | Client reports spawn; clears reservation |

## Server exports

```lua
exports['br-queue']:GetQueueSize() -> number
exports['br-queue']:IsPlayerInQueue(src) -> boolean  -- waiting or reserved
```

## Usage

```lua
local n = exports['br-queue']:GetQueueSize()
if exports['br-queue']:IsPlayerInQueue(src) then
  -- still in deferral / reservation
end
```
