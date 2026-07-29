# br-admin

Opt-in admin duty + NUI menu (`F10` / `/admin`). Duty admins are excluded from lobby count/match/zone; observe with noclip/invis/god. Match tab sets solo/duo/triple/quad + friendly fire.

**On-duty HUD** (match/bots/zone strip) lives in [br-hud](br-hud.md) — not this resource.

← [Docs index](../README.md)

## Dependencies

`br-lib`, `br-core` (NUI actions call nearly every match subsystem)

Soft: `br-hud` (duty overlay sync)

## Config (`shared/config.lua`)

| Key | Default |
|-----|---------|
| `OpenKey` | **`F10`** |
| `Ace` | `admin` |
| `ObserveDefaults` | invisible / godmode / noclip = true |
| `AdminIdentifiers` | allowlist (license / discord / fivem) |

## Commands

| Command | Access | Description |
|---------|--------|-------------|
| **`/admin`** | opens menu; actions need admin | Open BR Admin Menu (F10) |
| `/adminduty` | admin check | Toggle duty (excluded from matchmaking) |

> Use `/admin`, not `/bradmin`.

## Events (client)

`br-admin:client:setDuty`, `applyObserve`, `teleport`, `freeze`, `kill`, `revive`, `announce`, `setWeather`, `setTime`, `blackout`

## State

| Key | Notes |
|-----|-------|
| `Player.state.brAdminDuty` | on duty |
| `Player.state.brPhase` | `'admin'` while on duty |
| `Player.state.brAdminObserve` | true while in match-bucket observe |

## Server exports

```lua
exports['br-admin']:IsOnDuty(src) -> boolean
exports['br-admin']:IsAdmin(src) -> boolean
exports['br-admin']:HasNonDutyPlayers() -> boolean
exports['br-admin']:IsServerEmptyOfPlayers() -> boolean  -- no non-duty players
exports['br-admin']:EnterObserve(src) -> boolean
exports['br-admin']:SetOnDuty(src, on) -> boolean
```

## Menu capabilities (NUI)

- Toggle admin duty / enter observe (match bucket, noclip, invis, god)
- Moderation: teleport, freeze, kill, revive, announce
- Match: start/end, bot match / queue bots, skip warmup, eliminate/quit player, gamemode + friendly fire
- Dev tools: force zone phase, airdrop, loot refresh, weather/time/blackout (via other resources’ exports)

F10 open hides the br-hud duty strip; closing restores it if still on duty.

## Usage

```lua
if exports['br-admin']:IsOnDuty(src) then
  -- omit from lobby matchmaking / zone damage
end

if not exports['br-admin']:HasNonDutyPlayers() then
  -- only admins online
end
```
