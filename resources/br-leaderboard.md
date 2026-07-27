# br-leaderboard

Career board (`/leaderboard` / F7). Top wins from `player_stats`; columns include wins, kills, knocks, revives, deaths, matches, WR%; rank badges + self row.

← [Docs index](../README.md)

## Dependencies

`br-lib`, `br-core`, `oxmysql` (shared ranks from `@br-core/shared/ranks.lua`)

## Config (`shared/config.lua`)

```lua
Config.TopLimit = 50
Config.OpenKey = 'F7'
Config.Command = 'leaderboard'
```

## Commands

| Command | Access | Description |
|---------|--------|-------------|
| `/leaderboard` | all | Open leaderboard (also F7) |

## Exports

None. Data loaded via internal MySQL callbacks from `player_stats`.

## Events

No public net API — NUI only.
