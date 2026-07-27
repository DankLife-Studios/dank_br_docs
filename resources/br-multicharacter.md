# br-multicharacter

Single-slot character select UI. Create/load character, then hand off to appearance (new) or lobby (returning).

← [Docs index](../README.md)

## Dependencies

`/onesync`, `br-lib`, `oxmysql`, `br-core` (uses `spawnmanager`, [br-appearance](br-appearance.md))

## Config (`config.lua`)

| Key | Default |
|-----|---------|
| `DefaultSlots` | `1` |
| `DeleteButton` | `false` |
| `HideRadar` | `true` |
| `NewPlayerSpawnCoords` | prison yard vec4 |
| `FirstClothingEvent` | `qb-clothes:client:CreateFirstCharacter` |
| `Relog.Status` | `true` |
| `Relog.Command` | **`relog`** |

## Commands

| Command | Access | Description |
|---------|--------|-------------|
| `/relog` | all | Return to character select |

## Events

| Event | Side | Notes |
|-------|------|-------|
| `br-multicharacter:client:chooseChar` | client | alias `qb-multicharacter:client:chooseChar` |
| `br-multicharacter:client:GetCharacters` | client | |
| `br-multicharacter:client:defaultSpawn` | client | then `br-lobby:server:enter` |
| `br-multicharacter:client:spawnLastCoords` | client | |
| `br-multicharacter:client:logout` | client | |
| `br-multicharacter:client:clearSkinCache` | client | |
| `br-multicharacter:server:disconnect` | server | |

## Server exports

```lua
exports['br-multicharacter']:ClearSelectionBucket(src)
-- clear selection routing bucket tracking
```

## Usage

```lua
-- after selection UI cleanup
exports['br-multicharacter']:ClearSelectionBucket(src)
```
