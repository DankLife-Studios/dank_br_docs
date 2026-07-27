# br-teams

Lobby parties (`/teams` NUI). Create team, invite/accept, leave/kick. Max size follows admin gamemode (duo/triple/quad). Cleared when a match starts.

← [Docs index](../README.md)

## Dependencies

`br-lib`, `br-core`, `br-lobby` (uses `br-match` gamemode settings)

## Config

| Key | Default |
|-----|---------|
| `InviteTimeoutSeconds` | `60` |
| `TeammateBlip` | enabled, colour 3, scale 0.85 |
| Max size | `GlobalState.brTeamSize` / `br-match:GetGamemodeSettings()` |

## Commands

| Command | Access | Description |
|---------|--------|-------------|
| `/teams` | lobby only | Open team menu |

## Events

| Event | Side |
|-------|------|
| `br-teams:client:invitePending` | client — notify invitee |
| `br-match:client:enter` | client — closes teams UI |

## State

| Key | Notes |
|-----|-------|
| `GlobalState.brTeamSize` / `brGamemode` | read |
| `Player.state.brLobbyTeamId` | party id |
| `LocalPlayer.state.brPhase` | must be `'lobby'` to open UI |

## Server exports

```lua
exports['br-teams']:GetPartyMap()
-- -> table<source, { teamKey: number, members: number[] }>

exports['br-teams']:ClearAllParties()
exports['br-teams']:OnGamemodeChanged(maxSize)   -- trim/disband for new size
exports['br-teams']:OnPlayerLeftLobby(src)       -- leave team + clear invites
```

## Usage

```lua
local parties = exports['br-teams']:GetPartyMap()
exports['br-teams']:ClearAllParties()  -- called at match start
```
