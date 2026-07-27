# br-target

Interaction targeting (Left Alt). Client-only replacement for ox_target in this stack.

← [Docs index](../README.md)

## Dependencies

`br-lib`

## Config / convars

| Key | Default |
|-----|---------|
| Hotkey | `LMENU` (Left Alt) via `br_target:defaultHotkey` |
| `MaxDistance` | `7.0` |
| Convars | `br_target:toggleHotkey`, `drawSprite`, `defaults`, `debug`, `leftClick` |

## Commands

`+br_target` / `-br_target` (hold keymapping).

## Client exports

```lua
exports['br-target']:addBoxZone(data) -> id
exports['br-target']:addSphereZone(data) -> id
exports['br-target']:removeZone(id)
exports['br-target']:addModel(models, options)
exports['br-target']:removeModel(models, names)
exports['br-target']:addGlobalVehicle(options)
exports['br-target']:removeGlobalVehicle(names)
exports['br-target']:addGlobalPlayer(options)
exports['br-target']:removeGlobalPlayer(names)
exports['br-target']:addLocalEntity(entity, options)
exports['br-target']:removeLocalEntity(entity, names)
exports['br-target']:disableTargeting(state)
exports['br-target']:isActive() -> boolean
```

`addGlobalPlayer` options apply when the ray hits a player ped (`entityType == 1` and `IsPedAPlayer`). Same option shape as global vehicles (`label`, `name`, `distance`, `canInteract`, `onSelect`, …).

## Usage

```lua
exports['br-target']:addSphereZone({
  coords = vec3(0.0, 0.0, 72.0),
  radius = 2.0,
  options = {
    {
      name = 'example',
      label = 'Interact',
      onSelect = function()
        -- ...
      end,
    },
  },
})
```

Do not start `ox_target`.
