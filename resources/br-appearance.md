# br-appearance

Clothing/face/tattoo editor (illenium fork). Char create + personal outfits only — world shops/zones/clothing rooms/management removed. First-time create → lobby.

← [Docs index](../README.md)

## Dependencies

`br-lib`, `br-core` (+ oxmysql via server scripts)

## Config

| Key | Default |
|-----|---------|
| `EnablePedMenu` | `true` |
| `PedMenuGroup` | `group.admin` |
| `ReloadSkinCooldown` | `5000` |
| `InvincibleDuringCustomization` | `true` |
| `NewCharacterSections` | Ped/HeadBlend/Face/Components/Props/Tattoos |

## Commands

| Command | Access | Description |
|---------|--------|-------------|
| `/pedmenu` | `group.admin` | Open clothing shop as ped menu (`playerID?`) |
| `/reloadskin` | all | Reload saved skin |
| `/clearstuckprops` | all | Clear stuck props |

## Events

**Client:** `br-appearance:client:openClothingShop`, `openClothingShopMenu`, `openOutfitMenu`, `reloadSkin`, `ClearStuckProps`, outfit save/update/delete/change/import/generate.

**Server:** `br-appearance:server:saveOutfit`, `updateOutfit`, `deleteOutfit`, `resetOutfitCache`, `ChangeRoutingBucket`, `ResetRoutingBucket`.

**Compat:** `qb-clothes:client:CreateFirstCharacter` (first-char create).

## Client exports

### Getters

```lua
exports['br-appearance']:getPedModel(ped) -> string
exports['br-appearance']:getPedComponents(ped) -> table
exports['br-appearance']:getPedProps(ped) -> table
exports['br-appearance']:getPedHeadBlend(ped) -> table
exports['br-appearance']:getPedFaceFeatures(ped) -> table
exports['br-appearance']:getPedHeadOverlays(ped) -> table
exports['br-appearance']:getPedHair(ped) -> table
exports['br-appearance']:getPedAppearance(ped) -> appearance table
```

### Setters

```lua
exports['br-appearance']:setPlayerModel(model)
exports['br-appearance']:setPedHeadBlend(ped, headBlend)
exports['br-appearance']:setPedFaceFeatures(ped, faceFeatures)
exports['br-appearance']:setPedHeadOverlays(ped, headOverlays)
exports['br-appearance']:setPedHair(ped, hair)
exports['br-appearance']:setPedEyeColor(ped, eyeColor)
exports['br-appearance']:setPedComponent(ped, component)
exports['br-appearance']:setPedComponents(ped, components)
exports['br-appearance']:setPedProp(ped, prop)
exports['br-appearance']:setPedProps(ped, props)
exports['br-appearance']:setPlayerAppearance(appearance)
exports['br-appearance']:setPedAppearance(ped, appearance)
exports['br-appearance']:setPedTattoos(ped, tattoos)
```

### Customization UI

```lua
exports['br-appearance']:startPlayerCustomization(cb, config)
-- cb(appearance|nil) when finished
```

## Usage

```lua
exports['br-appearance']:startPlayerCustomization(function(appearance)
  if appearance then
    -- saved / applied
  end
end, Config.NewCharacterSections)
```
