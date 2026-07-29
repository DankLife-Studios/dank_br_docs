# br-hud

Full match NUI: alive/kills/match clock, zone timer, storm strip, health/armor, kill feed, elim placement + victory banners (delayed lobby return). Always-on voice mic (Whisper/Normal/Yell + talking). **Admin duty / observe strip** while on duty.

← [Docs index](../README.md)

## Dependencies

`br-lib`, `br-core`, `pma-voice`

Soft: `br-match`, `br-bots`, `br-zone`, `br-admin` (duty overlay sync)

## Config

| Key | Default |
|-----|---------|
| `ElimBannerMs` | `5000` |
| `KillFeedMax` | `5` |
| `VitalsIntervalMs` | `100` |
| `DutyHud.enabled` | `true` | Always-on admin strip |
| `DutyHud.refreshMs` | `1000` | Server push interval |
| `Minimap.shape` | `square` | Runtime override: `/minimapshape` |

## Commands

| Command | Access | Description |
|---------|--------|-------------|
| `/minimapshape` | All | Set or toggle minimap shape (`circle` \| `square`; omit arg to toggle) |

## Server exports

```lua
exports['br-hud']:SyncDutyHud(src) -- push duty overlay payload (or hide if not on duty)
```

## Events (client)

| Event | Source |
|-------|--------|
| `br-hud:client:sync` | match status payload |
| `br-hud:client:killfeed` | kill feed entry |
| `br-hud:client:eliminated` | placement banner |
| `br-hud:client:victory` | victory banner |
| `br-hud:client:hide` | hide HUD |
| `br-hud:client:zoneUpdate` | from br-zone (`match` or `admin` phase) |
| `br-hud:client:lastStand` | bleedout overlay |
| `br-hud:client:teammateDowned` | teammate down chips |
| `br-hud:client:reviveProgress` | revive progress bar |
| `br-hud:client:dutySync` | admin duty overlay payload |
| `br-hud:client:dutyHudVisible` | show/hide strip (F10 open/close) |
| Also listens | `br-match:client:enter` / `end`, `br-lobby:client:enter` |

## State

- Match HUD when `brPhase == 'match'`
- Status cluster (HP/armor/voice) for `lobby` / `match` / `admin`
- Duty strip when `brAdminDuty` / `brPhase == 'admin'` (payload from server)
- Observe badge uses `Player.state.brAdminObserve` (set by br-admin)

## Admin duty overlay

Top-left strip: `BR ADMIN` · DUTY · OBSERVE · match/bots/zone status · `F10` hint. Owned entirely by br-hud — br-admin only sets state bags and suppresses the strip while the F10 menu is open.

## Integration

```lua
TriggerClientEvent('br-hud:client:sync', src, payload)
exports['br-hud']:SyncDutyHud(src)
```
