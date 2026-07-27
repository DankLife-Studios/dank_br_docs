# br-tints

Lobby weapon cosmetics (`/tints` NUI). Per-weapon tint prefs by `citizenid`; progression unlocks from wins/kills + admin unlocks. Applied on weapon create/equip in match. Skin rewards currently disabled.

← [Docs index](../README.md)

## Dependencies

`br-lib`, `br-core`, `br-lobby`, `br-inventory`, `oxmysql`

## Config

- Categories: melee, handguns, smgs, shotguns, rifles, lmgs, snipers, heavy, throwables
- Large `Config.Weapons` list (client filters `GetWeaponTintCount > 1`)
- Progression: `shared/rewards.lua` (`TintRewards.List` wins/kills → tintIndex); `SkinRewards.List = {}`

## Commands

| Command | Access | Args | Description |
|---------|--------|------|-------------|
| `/tints` | lobby | — | Open tint UI |
| `/unlocktint` | `group.admin` | id, weapon (`*`\|`WEAPON_*`), tint | Unlock tint |
| `/listtints` | `group.admin` | — | List tint labels (F8) |
| `/unlockskin` | `group.admin` | — | Stub (skins disabled) |

## Events

| Event | Side |
|-------|------|
| `br-tints:server:requestOpen` | server |
| `br-tints:server:syncSelections` | server |
| `br-tints:client:open` | client |
| `br-tints:client:setSelections` | client |
| `br-tints:client:listTints` | client |
| `BRCore:Client:OnPlayerLoaded` | client — sync selections |

UI requires `LocalPlayer.state.brPhase == 'lobby'`.

## Server exports

```lua
exports['br-tints']:UnlockTint(sourceOrCitizenId, weaponName, tintIndex) -> boolean
exports['br-tints']:UnlockAllTints(sourceOrCitizenId) -> boolean   -- indices 1–32 on '*'
exports['br-tints']:IsTintUnlocked(sourceOrCitizenId, weaponName, tintIndex) -> boolean
exports['br-tints']:GetPlayerTints(sourceOrCitizenId) -> { selections, unlocked }|nil
exports['br-tints']:GetWeaponTint(sourceOrCitizenId, weaponName) -> tintIndex|nil
exports['br-tints']:EvaluateProgression(source, brStats?) -> number  -- granted count

-- Skin stubs
exports['br-tints']:UnlockSkin(...) -> false
exports['br-tints']:UnlockAllSkins(...) -> false
exports['br-tints']:IsSkinUnlocked(...) -> false
exports['br-tints']:GetWeaponSkin(...) -> nil
```

## Usage

```lua
local tint = exports['br-tints']:GetWeaponTint(source, 'WEAPON_PISTOL')
exports['br-tints']:UnlockTint(source, 'WEAPON_CARBINERIFLE', 7)
exports['br-tints']:EvaluateProgression(source, exports['br-core']:GetBrStats(source))
```
