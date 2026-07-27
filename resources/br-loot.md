# br-loot

World loot from a city-wide POI dump (~370 LS points). Each fight samples a subset into `br-inventory` ground drops (match bucket only).

← [Docs index](../README.md)

## Dependencies

`br-lib`, `br-core`, `br-inventory`

## Config (`shared/config.lua`)

```lua
Config.MatchBucket = 2
Config.MatchSpawnCount = 120
Config.MinDistanceBetween = 35.0
Config.DropSlots = 8
Config.DropMaxWeight = 50000
Config.DropModel = joaat('prop_cs_cardbox_01')
Config.TierWeights = {
  { tier = 'common', weight = 60 },
  { tier = 'uncommon', weight = 30 },
  { tier = 'rare', weight = 10 },
}
```

## Commands

None.

## Events

None public (spawns via inventory drops).

## Server exports

```lua
exports['br-loot']:StartLoot(matchId) -> boolean
exports['br-loot']:StopLoot()
exports['br-loot']:IsLootActive() -> boolean
exports['br-loot']:RefreshLoot(matchId?) -> boolean  -- re-run StartLoot
```

## Usage

```lua
exports['br-loot']:StartLoot(matchId)
exports['br-loot']:RefreshLoot(matchId)  -- admin / dev
exports['br-loot']:StopLoot()
```
