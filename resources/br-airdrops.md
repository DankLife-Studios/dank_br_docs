# br-airdrops

Timed contested supply drops during fight: falling crate, map blip, open with **E** for a rich temp stash. Biased toward the current safe zone when active.

← [Docs index](../README.md)

## Dependencies

`br-lib`, `br-core`, `br-inventory` (reads zone centers when available)

## Config (`shared/config.lua`)

```lua
Config.MatchBucket = 2
Config.FirstDropDelayMs = 90000
Config.IntervalMs = 120000
Config.MaxAirdropsPerMatch = 4
Config.FallHeight = 180.0
Config.FallDurationMs = 20000
Config.CrateModel = joaat('prop_box_wood02a_pu')
Config.StashSlots = 12
Config.StashMaxWeight = 100000
Config.InteractDistance = 2.0
Config.ZoneRadiusFraction = 0.65
```

## Commands

None.

## Events / callbacks

| Name | Side |
|------|------|
| `br-airdrops:client:start` | client |
| `br-airdrops:client:landed` | client |
| `br-airdrops:client:stop` | client |
| `br-airdrops:canOpen` | `lib.callback` → `(source, dropId) -> boolean` |
| `br-match:client:end` | client — cleanup |

## Server exports

```lua
exports['br-airdrops']:StartAirdrops(matchId, sources)
exports['br-airdrops']:StopAirdrops()
exports['br-airdrops']:IsAirdropsActive() -> boolean
exports['br-airdrops']:ForceSpawnAirdrop() -> boolean
```

## Usage

```lua
exports['br-airdrops']:StartAirdrops(matchId, rosterSources)
exports['br-airdrops']:ForceSpawnAirdrop()  -- admin / dev
exports['br-airdrops']:StopAirdrops()
```
