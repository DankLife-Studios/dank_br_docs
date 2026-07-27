# br-lifeline

Combat healing and team last stand / carry-revive (DBNO).

← [Docs index](../README.md)

## Dependencies

`br-lib`, `br-core`, `br-inventory`, `br-target`, `br-hud`, `br-match`

## Role

- Heal items: `bandage` (instant), `painkillers` (HoT), `medikit` (full) — amounts server-approved
- Team modes: fatal damage → last stand (mode-based bleedout) instead of immediate eliminate
- Crawl while downed; enemies finish via **downed HP**; storm cuts timer + damages downed HP
- Teammates **Carry** (br-target) then **Revive** (E / target); G drops carry
- Knock killfeed + career `knocks` / `revives` stats
- Bleedout / finish → death presentation → `br-match` `EliminatePlayer`

## Config highlights

| Key | Default |
|-----|---------|
| `BleedoutSecondsByMode` | duo 15 / triple 18 / quad 20 |
| `ReviveDurationMsByMode` | duo 4s / triple 4.5s / quad 5s |
| `DownedMaxHp` | `100` |
| `StormBleedoutCutMs` | `2500` |
| `StormDownedDamage` | `15` |
| `CrawlSpeed` | `0.35` |
| Bandage | `+25` instant |
| Painkillers | `+10` × 5 over 5s |
| Medical kit | full heal |

## Items

| Item | Export |
|------|--------|
| `bandage` | `br-lifeline.useBandage` |
| `painkillers` | `br-lifeline.usePainkillers` |
| `medikit` | `br-lifeline.useMedikit` |

## Server exports

```lua
exports['br-lifeline']:TryEnterLastStand(src, killer?) -> boolean
exports['br-lifeline']:IsDowned(src) -> boolean
exports['br-lifeline']:FinishLastStand(src, killer?)
```

## Client exports

```lua
exports['br-lifeline']:IsInLastStand() -> boolean
exports['br-lifeline']:useBandage(_, data)      -- item use handlers
exports['br-lifeline']:usePainkillers(_, data)
exports['br-lifeline']:useMedikit(_, data)
```

## Events

| Event | Role |
|-------|------|
| `br-lifeline:client:enterLastStand` | Crawl / last-stand controls |
| `br-lifeline:client:cleared` / `revived` / `bleedoutDeath` | Local state |
| `br-lifeline:client:startCarry` / `stopCarry` / `startCarried` / `stopCarried` | Carry attach |
| `br-lifeline:server:requestCarry` / `dropCarry` / `requestRevive` | Carry + revive |
| `br-lifeline:server:downedDamage` / `stormTick` | Finish / storm pressure |
| `br-lifeline:server:approveHeal` | Callback — authoritative heal |

HUD: `br-hud:client:lastStand` (includes `downedHp`), `teammateDowned` (`mates[]`), `reviveProgress`.

## Notes

- Solo / `brTeamSize <= 1`: no last stand
- Downed stay match-alive until finish/bleedout
- Revive requires carrying the teammate first
- Heals / revive progress cancel on damage
