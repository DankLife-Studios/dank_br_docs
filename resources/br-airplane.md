# br-airplane

Match drop: one shared networked cargoplane (~5 min path), far orbit cam on the plane, hidden peds, branded jump NUI; force-eject at route end.

← [Docs index](../README.md)

## Dependencies

`br-lib`, `br-core` (orchestrated by [br-match](br-match.md))

## Config

| Key | Default |
|-----|---------|
| `PlaneModel` | `cargoplane` |
| `Altitude` | `450.0` |
| `FlightSeconds` | `300` |
| `ServerTickMs` | `50` |
| `JumpKey` | `F` |
| `ParachuteWeapon` | `GADGET_PARACHUTE` |
| Map AABB | `MapMin` / `MapMax` |

## Commands

None.

## Events

| Event | Side | Notes |
|-------|------|-------|
| `br-airplane:client:start` | client | flight path / netId |
| `br-airplane:client:forceJump` | client | |
| `br-airplane:client:stop` | client | |
| `br-airplane:server:jumped` | server | `(matchId)` |
| `br-airplane:server:landed` | server | `(matchId)` |
| `br-airplane:server:dropComplete` | server TriggerEvent | consumed by br-match |
| `br-match:server:setDropStage` | server TriggerEvent | `'plane'`\|`'falling'`\|`'none'` |

## Server exports

```lua
exports['br-airplane']:StartDrop(matchId, sources) -> boolean
exports['br-airplane']:StopDrop()
exports['br-airplane']:IsDropActive() -> boolean
exports['br-airplane']:ForceCompleteDrop() -> boolean  -- force-jump remaining + complete
```

## Usage

```lua
exports['br-airplane']:StartDrop(matchId, rosterSources)
-- later / admin
exports['br-airplane']:ForceCompleteDrop()
exports['br-airplane']:StopDrop()
```
