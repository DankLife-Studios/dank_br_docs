# br-weather

Weather + time sync (Renewed-style GlobalState queue). Provides `qb-weathersync` for compatibility. Match systems can freeze weather/time during fights via exports.

← [Docs index](../README.md)

## Dependencies

`br-lib`

## Provides

`qb-weathersync`

## Config

**`config/weather.lua`:** `weatherCycletimer = 30` min, `serverDuration = 14` h queue, rain spacing, sequences + weighted static weather.

**`config/time.lua`:** `timeScale = 4000` ms/game-min, night scale `8000` (22–06), start `12:00`.

**Shared:** `WeatherTypes`, `IsValidWeatherType`.

## Commands

All `restricted = 'group.admin'`. See [Commands — Weather](../commands.md#weather--time).

| Command | Args |
|---------|------|
| `/weather` | type |
| `/weathercycle` `/weatherseq` | — |
| `/freezeweather` | `0`\|`1` |
| `/blackout` | — |
| `/time` | hour, minute? |
| `/noon` `/morning` `/evening` `/night` | — |
| `/timescale` | scale (≥500) |
| `/freezetime` | `0`\|`1` |

## Events

| Event | Notes |
|-------|-------|
| `br-weather:client:EnableSync` / `DisableSync` | |
| `qb-weathersync:client:EnableSync` / `DisableSync` | aliases |

## GlobalState

`weather`, `weatherQueue`, `freezeWeather`, `blackOut`, `currentTime`, `timeScale`, `freezeTime`, `isNight`

## Server exports

```lua
exports['br-weather']:SetWeather(weatherName, holdMinutes?) -> ok
exports['br-weather']:FreezeWeather(enabled) -> boolean
exports['br-weather']:RebuildWeatherQueue()
exports['br-weather']:GetWeather() -> GlobalState.weather
exports['br-weather']:SetBlackout(enabled) -> boolean
exports['br-weather']:SetTime(hour, minute?)
exports['br-weather']:FreezeTime(enabled)
exports['br-weather']:GetTime() -> { hour, minute }
exports['br-weather']:SetTimeScale(ms)
```

## Usage

```lua
exports['br-weather']:SetWeather('CLEAR', 30)
exports['br-weather']:FreezeWeather(true)
exports['br-weather']:SetTime(12, 0)
exports['br-weather']:FreezeTime(true)
```
