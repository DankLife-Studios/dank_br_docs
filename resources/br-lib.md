# br-lib

Lightweight ox_lib-compatible helpers for Dank's BR (Enhanced-safe). Injected via `@br-lib/init.lua` as globals `lib`, `cache`, and `locale`. **No `exports()`** — depend on the shared script.

← [Docs index](../README.md)

## Dependencies

None.

## Config / convars

| Convar | Default | Purpose |
|--------|---------|---------|
| `br:locale` | `en` | Active locale |
| `br:userLocales` | `false` | Allow `/brlocale` per-player override |

## Commands

| Command | Access | Description |
|---------|--------|-------------|
| `/brlocale` | needs `br:userLocales` | Show/set/reset user locale (`code` \| `reset` \| `default`) |

## Events

| Event | Side | Payload |
|-------|------|---------|
| `br-lib:notify` | client | `{ title?, description?, type? }` |

## Public API (`lib.*`)

### Loading

```lua
lib.load(filePath, env?) -> any
lib.require(modName) -> any   -- supports @resource/path
```

### Debug / print

```lua
lib.setDebug(enabled)
lib.isDebug() -> boolean
lib.debug(...)
lib.print.info / .warn / .error / .debug / .verbose(...)
```

### Locale

```lua
locale(str, ...) -> string
lib.getLocales() -> table
lib.clearLocaleCache()
```

### ACE

```lua
lib.addAce(principal, ace, allow)
lib.removeAce(principal, ace, allow)
lib.addPrincipal(child, parent)
lib.removePrincipal(child, parent)
lib.isAdmin(source) -> boolean
```

### Callbacks

```lua
lib.callback.register(name, cb)
lib.callback.await(name, playerId|delay, ...) -> ...
lib.callback(name, delay, function(result) end, ...)
lib.callback(name, function(result) end, ...)
```

### Commands (server)

```lua
lib.addCommand(name|string[], {
  help?,
  params?: { name, type?, help?, optional? }[],
  restricted?: string|string[]|boolean  -- e.g. 'group.admin'
}, function(source, namedArgs, rawArgs) end)
```

### Notify

```lua
lib.notify(data)           -- client
lib.notify(source, data)   -- server → br-lib:notify
```

### Assets (client)

```lua
lib.requestModel(model, timeout?) -> boolean
lib.requestAnimDict(dict, timeout?) -> boolean
lib.requestAnimSet(set, timeout?) -> boolean
```

### UI (client)

```lua
lib.registerContext(menu) / lib.showContext(id) / lib.hideContext()
lib.inputDialog(title, rows) -> result|nil
lib.alertDialog(data) -> result|nil
lib.setClipboard(text)
lib.showTextUI(text, options?) / lib.hideTextUI() / lib.isTextUIOpen()
lib.progressBar(data) / lib.progressCircle(data) -> boolean
lib.cancelProgress() / lib.progressActive()
lib.registerMenu(data, cb) / lib.showMenu(id) / lib.hideMenu()
```

### Proximity (client)

```lua
lib.getClosestPlayer(coords, maxDistance?, includePlayer?)
lib.getNearbyPlayers(coords, maxDistance?, includePlayer?)
lib.getNearbyVehicles(coords, maxDistance?, includePlayerVehicle?)
```

### Zones / points (client)

```lua
-- zones are light stubs: { id, remove }
lib.zones.box(opts) / .sphere(opts) / .poly(opts)

-- points: real distance loop
local point = lib.points.new(coords|data, distance?, data?)
-- point: id, coords, distance, onEnter?, onExit?, nearby?, remove()
lib.points.getAllPoints() / getNearbyPoints() / getClosestPoint()
```

### Keybind (client)

```lua
local bind = lib.addKeybind({
  name?, description?, defaultKey?, defaultMapper?,
  onPressed?, onReleased?, disabled?
})
-- bind:disable(bool), :getCurrentKey(), :isControlPressed()
```

### Player state (client)

```lua
local p = lib.player:new(netId|-1)  -- -1 = LocalPlayer
p:get(key) / p:set(key, value) / p:setr(key, value)  -- setr replicates
```

### Cron / hooks / utils

```lua
local job = lib.cron.new('*/5 * * * *', function() end)
job:remove()

lib.registerHook(event, cb, options?) -> id
lib.removeHooks(id)

lib.waitFor(cb, timeout?, interval?)
lib.string.random(pattern)
lib.math.groupdigits(value) / lib.math.clamp(v, min, max)
lib.table.freeze / merge / deepclone / contains
lib.checkDependency(resource, minVersion?, printMessage?)
```

### Cache (global)

```lua
cache.ped / cache.resource / ...
cache:set(key, value)
lib.onCache(key, function(value, oldValue) end)
```

## Usage

```lua
-- fxmanifest.lua
shared_script '@br-lib/init.lua'

-- any script
lib.notify({ title = 'BR', description = 'Ready', type = 'inform' })
local ok = lib.callback.await('my:resource:getData', false)
```
