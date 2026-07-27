# br-inventory

Slot inventory (ox_inventory fork for BR). Wired to br-core (`inventory:framework "br"`) + br-lib. Player inventory + ground drops; shops/crafting/licenses/stashes emptied for BR. Cleared on eliminate. Stash table: `br_inventory`.

← [Docs index](../README.md)

## Dependencies

`oxmysql`, `br-lib`, `br-core`, `/onesync` (soft: `br-target`)

## Config (convars in `init.lua`)

| Convar | Default |
|--------|---------|
| `inventory:framework` | **`br`** |
| `inventory:slots` | `50` |
| `inventory:weight` | `30000` |
| `inventory:keys` | `F2`, `K`, `TAB` |
| `inventory:enablestealcommand` | `true` |
| `inventory:target` | `false` |

## Commands

See [Commands — Inventory](../commands.md#inventory-admin). Player: `/steal` (if enabled).

## BR notes

- Inventory cleared when a player is eliminated from a match.
- World loot / airdrops use drops and temporary stashes.
- Prefer server exports from match systems rather than opening shops/crafting (trimmed).

## Events (selected)

`br-inventory:openInventory`, `forceOpenInventory`, `closeInventory`, `setPlayerInventory`, `createDrop`, `removeDrop`, `updateSlots`, `viewInventory`, `inventoryConfiscated`, `inventoryReturned`, `itemNotify`, `disarm`, `clearWeapons`, `refreshMaxWeight`, `refreshSlotCount`, `updateWeapon`, `openedInventory`, `closedInventory`, `loadInventory`.

## State (client via `lib.player`)

`invBusy`, `invOpen`, `invHotkeys`, `canUseWeapons`, `canSteal`.

## Server exports

### Inventory access

```lua
exports['br-inventory']:Inventory(inv, owner?)           -- alias GetInventory
exports['br-inventory']:GetInventory(inv, owner?) -> OxInventory?
exports['br-inventory']:GetInventoryItems(inv, owner) -> items|nil
exports['br-inventory']:GetContainerFromSlot(...)
exports['br-inventory']:RemoveInventory(inv)
exports['br-inventory']:UpdateVehicle(...)
exports['br-inventory']:setPlayerInventory(player, data?)
exports['br-inventory']:forceOpenInventory(playerId, invType, data)
```

### Items / slots

```lua
exports['br-inventory']:GetItem(inv, item, metadata?, strict?)
exports['br-inventory']:SetItem(inv, item, count, metadata?)
exports['br-inventory']:SwapSlots(fromInventory, toInventory, slot1, slot2)
exports['br-inventory']:GetCurrentWeapon(inv) -> weaponSlot|nil
exports['br-inventory']:GetSlot(inv, slot) -> slotData|nil
exports['br-inventory']:SetDurability(inv, slot, durability)
exports['br-inventory']:SetMetadata(inv, slot, metadata)
exports['br-inventory']:SetSlotCount(inv, slots)
exports['br-inventory']:SetMaxWeight(inv, maxWeight)

exports['br-inventory']:AddItem(inv, item, count, metadata?, slot?, cb?)
-- -> success, response|error
exports['br-inventory']:RemoveItem(inv, item, count, metadata?, slot?, ignoreTotal?, strict?)
exports['br-inventory']:Search(inv, search, items, metadata?)
exports['br-inventory']:GetItemSlots(inv, item, metadata?, strict?)
exports['br-inventory']:GetItemCount(inv, itemName, metadata?, strict?) -> number

exports['br-inventory']:CanCarryItem(inv, item, count, metadata?) -> boolean
exports['br-inventory']:CanCarryAmount(inv, item) -> number
exports['br-inventory']:CanCarryWeight(inv, weight) -> boolean, available?
exports['br-inventory']:CanSwapItem(...) -> boolean

exports['br-inventory']:GetEmptySlot(inv) -> slot|nil
exports['br-inventory']:GetSlotForItem(inv, itemName, metadata?)
exports['br-inventory']:GetSlotWithItem(inv, itemName, metadata?, strict?)
exports['br-inventory']:GetSlotIdWithItem(inv, itemName, metadata?, strict?)
exports['br-inventory']:GetSlotsWithItem(inv, itemName, metadata?, strict?)
exports['br-inventory']:GetSlotIdsWithItem(inv, itemName, metadata?, strict?)
```

### Drops / confiscate / clear

```lua
exports['br-inventory']:CustomDrop(prefix, items, coords, slots?, maxWeight?, instance?, model?)
exports['br-inventory']:CreateDropFromPlayer(playerId) -> dropId?
exports['br-inventory']:ConfiscateInventory(source)
exports['br-inventory']:ReturnInventory(source)
exports['br-inventory']:ClearInventory(inv, keep?)
```

### Stashes / shops / items / hooks

```lua
exports['br-inventory']:RegisterStash(name, label, slots, maxWeight, owner?, groups?, coords?, instance?)
exports['br-inventory']:CreateTemporaryStash(properties) -> stashId|nil
exports['br-inventory']:InspectInventory(playerId, invId)
exports['br-inventory']:Items(item?) / ItemList(item?) -> itemDef|all
exports['br-inventory']:RegisterShop(shopType, shopDetails)
exports['br-inventory']:ConvertItems(...)  -- if bridge provides convertInventory
exports['br-inventory']:registerHook(event, ref, options?) -> id
exports['br-inventory']:removeHooks(id)
exports['br-inventory']:setContainerProperties(name, properties)
```

### Armor (vest + plates)

Custom armor pool (native ped armour forced to 0). State bags: `brArmor`, `brArmorMax`.

```lua
exports['br-inventory']:SyncArmor(source|inv) -> current, max   -- recompute + sync state
exports['br-inventory']:GetArmor(source) -> current, max
exports['br-inventory']:ClearArmorState(source)                 -- zero state + native armour
exports['br-inventory']:BuildArmorInventory(playerInv) -> payload|nil  -- plate slots for NUI
```

### Optional PEFCL bridge

```lua
exports['br-inventory']:addCash(source, amount)
exports['br-inventory']:removeCash(source, amount)
exports['br-inventory']:getCash(source) -> number
exports['br-inventory']:getCards(source)
exports['br-inventory']:giveCard(source, card)
exports['br-inventory']:getBank()
```

## Client exports

```lua
exports['br-inventory']:Search(search, item, metadata?)
exports['br-inventory']:GetPlayerItems() -> items
exports['br-inventory']:GetPlayerWeight() -> number
exports['br-inventory']:GetPlayerMaxWeight() -> number
exports['br-inventory']:GetSlotWithItem(itemName, metadata?, strict?)
exports['br-inventory']:GetSlotIdWithItem(itemName, metadata?, strict?)
exports['br-inventory']:GetSlotsWithItem(itemName, metadata?, strict?)
exports['br-inventory']:GetItemCount(itemName, metadata?, strict?) -> number

exports['br-inventory']:GetArmor() -> current, max   -- LocalPlayer.state.brArmor / brArmorMax

exports['br-inventory']:getCurrentWeapon() -> currentWeapon|nil
exports['br-inventory']:setStashTarget(id, owner?)
exports['br-inventory']:openInventory(invType?, data?)
exports['br-inventory']:closeInventory()
exports['br-inventory']:useItem(data, cb?)
exports['br-inventory']:useSlot(slot)
exports['br-inventory']:openNearbyInventory()
exports['br-inventory']:giveItemToTarget(serverId, slotId, count)

exports['br-inventory']:Items(item?) / ItemList(item?)
exports['br-inventory']:displayMetadata(metadata, value?)
exports['br-inventory']:notify(...)
exports['br-inventory']:suppressItemNotifications(state)
exports['br-inventory']:weaponWheel(state)
exports['br-inventory']:setGetPlayerNameMethod(fn)

exports['br-inventory']:Keyboard(...)          -- lib.inputDialog
exports['br-inventory']:Progress(options, completed)
exports['br-inventory']:CancelProgress(...)
exports['br-inventory']:ProgressActive(...)
```

## Usage

```lua
-- server: give loot
exports['br-inventory']:AddItem(source, 'ammo-9', 30)

-- server: wipe on eliminate
exports['br-inventory']:ClearInventory(source)

-- server: temp airdrop stash
local id = exports['br-inventory']:CreateTemporaryStash({
  label = 'Airdrop',
  slots = 12,
  maxWeight = 100000,
  items = { ... },
})
```
