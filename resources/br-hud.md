# br-hud

Full match NUI: alive/kills/match clock, zone timer, storm strip, health/armor, kill feed, elim placement + victory banners (delayed lobby return). Always-on voice mic (Whisper/Normal/Yell + talking). Client-only.

← [Docs index](../README.md)

## Dependencies

`br-lib`, `br-core`, `pma-voice`

## Config

| Key | Default |
|-----|---------|
| `ElimBannerMs` | `5000` |
| `KillFeedMax` | `5` |
| `VitalsIntervalMs` | `100` |
| `Minimap.shape` | `square` | Runtime override: `/minimapshape` |

## Commands

| Command | Access | Description |
|---------|--------|-------------|
| `/minimapshape` | All | Set or toggle minimap shape (`circle` \| `square`; omit arg to toggle) |

No exports. Driven by events from [br-match](br-match.md), [br-zone](br-zone.md), [br-lobby](br-lobby.md).

## Events (client)

| Event | Source |
|-------|--------|
| `br-hud:client:sync` | match status payload |
| `br-hud:client:killfeed` | kill feed entry |
| `br-hud:client:eliminated` | placement banner |
| `br-hud:client:victory` | victory banner |
| `br-hud:client:hide` | hide HUD |
| `br-hud:client:zoneUpdate` | from br-zone (AddEventHandler) |
| `br-hud:client:lastStand` | bleedout overlay (`{ active, endsAt, durationMs, downedHp?, downedMaxHp? }`) |
| `br-hud:client:teammateDowned` | `{ active, mates = [{ name, endsAt, durationMs }] }` (stacked chips) |
| `br-hud:client:reviveProgress` | revive progress bar |
| `br-hud:client:killfeed` | also supports `knocked = true` |
| Also listens | `br-match:client:enter` / `end`, `br-lobby:client:enter` |

## State

Shows HUD when `LocalPlayer.state.brPhase == 'match'`. Mic reads `LocalPlayer.state.proximity` and talking state from pma-voice.

## Integration

```lua
-- typically fired by br-match / br-zone — do not invent payloads
TriggerClientEvent('br-hud:client:sync', src, payload)
TriggerClientEvent('br-hud:client:killfeed', -1, { killer, victim, weapon })
TriggerEvent('br-hud:client:zoneUpdate', zonePayload)  -- local from zone client
```
