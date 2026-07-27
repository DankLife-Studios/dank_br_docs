# br-zone

Shrinking storm: phased moving safe circle, map blips + marker, server-authored outside damage. Zone timer/outside state fed to [br-hud](br-hud.md). Match roster only — never lobby.

← [Docs index](../README.md)

## Dependencies

`br-lib`, `br-core`

## Config

| Key | Default |
|-----|---------|
| `InitialRadius` | `2200` |
| `DamageIntervalMs` | `1000` |
| Phases | wait 540s + shrink 60s; radii 1400 → 800 → 400 → 180 → 40; damage 2/4/7/10/15 |

## Commands

None.

## Events

| Event | Side |
|-------|------|
| `br-zone:client:start` | client |
| `br-zone:client:sync` | client |
| `br-zone:client:stop` | client |
| `br-zone:client:applyDamage` | client |
| Local | `TriggerEvent('br-hud:client:zoneUpdate', payload)` |

## Server exports

```lua
exports['br-zone']:StartZone(matchId, sources) -> boolean
exports['br-zone']:StopZone()
exports['br-zone']:IsZoneActive() -> boolean
exports['br-zone']:RemovePlayer(src)
exports['br-zone']:GetZoneCenters() -> { from, to, current, ... }|nil
exports['br-zone']:ForceNextPhase() -> boolean
```

## Usage

```lua
exports['br-zone']:StartZone(matchId, rosterSources)
local centers = exports['br-zone']:GetZoneCenters()
exports['br-zone']:ForceNextPhase()  -- admin
exports['br-zone']:RemovePlayer(src) -- on eliminate
exports['br-zone']:StopZone()
```
