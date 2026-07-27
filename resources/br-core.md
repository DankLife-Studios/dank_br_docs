# br-core

Session framework: login/logout, player objects, bans, permissions, and career BR stats (`metadata.br` + `player_stats`).

← [Docs index](../README.md)

## Dependencies

`br-lib`, `oxmysql`, `/server:10731`, `/onesync`

## Config

| File | Highlights |
|------|------------|
| `config/shared.lua` | `serverName`, `defaultSpawn`, `notifyPosition`, `starterItems`, `debug` |
| `config/server.lua` | `pvp`, `closed`, `whitelist`, `permissions`, `defaultNumberOfCharacters = 1` |
| `config/client.lua` | `characters.useExternalCharacters = true`, pause map text, Discord RPC |

## Commands

See [Commands — Core](../commands.md#core--moderation). Includes `tp`, `tpm`, `togglepvp`, permissions, server open/close, `car`, `dv`, `ooc`, `id`, `citizenid`, `logout`, `deletechar`, `optin`.

## Events

| Event | Side |
|-------|------|
| `BRCore:Client:OnPlayerLoaded` / `OnPlayerUnload` | client |
| `BRCore:Player:SetPlayerData` | client |
| `BRCore:Notify` | client |
| `BRCore:Command:TeleportToPlayer` / `TeleportToCoords` / `GoToMarker` | client |
| `BRCore:Server:OnPlayerLoaded` / `PlayerLoaded` | server |
| `BRCore:Server:CloseServer` / `OpenServer` | server |
| `br-core:server:deleteCharacter` | server |
| `br-core:client:playerLoggedOut` / `spawnNoApartments` | client |

## State

| Key | Type |
|-----|------|
| `GlobalState.PlayerCount` | number |
| `GlobalState.MaxPlayers` | number |
| `GlobalState.PVPEnabled` | boolean |
| `Player.state.isLoggedIn` | boolean |
| `Player.state.instance` | bucket |
| `Player.state.loadInventory` / `canUseWeapons` | boolean |

## Server exports

### Players

```lua
exports['br-core']:GetSource(identifier) -> source|0
exports['br-core']:GetUserId(identifier) -> userId|0
exports['br-core']:GetPlayer(source|identifier) -> Player?
exports['br-core']:GetPlayerByCitizenId(citizenid) -> Player?
exports['br-core']:GetPlayerByUserId(userId) -> Player?
exports['br-core']:GetQBPlayers() -> table<Source, Player>
exports['br-core']:GetOfflinePlayer(citizenid) -> Player?
exports['br-core']:GetPlayersData() -> PlayerData[]
exports['br-core']:SearchPlayers(filters) -> Player[]
```

### Session

```lua
exports['br-core']:Login(source, citizenid?, newData?) -> boolean
exports['br-core']:Logout(source)
exports['br-core']:CreatePlayer(playerData, opts?)
exports['br-core']:Save(source)
exports['br-core']:SaveOffline(playerData)
exports['br-core']:DeleteCharacter(citizenid)
exports['br-core']:CreateSessionId(entity) -> sessionId
exports['br-core']:GiveStarterItems(source)
exports['br-core']:GenerateUniqueIdentifier(type) -> string  -- 'citizenid'|'WalletId'
```

### Player data

```lua
exports['br-core']:SetPlayerData(source, key, value)
exports['br-core']:UpdatePlayerData(source)
exports['br-core']:SetMetadata(source, meta, val)
exports['br-core']:GetMetadata(source, meta?) -> any
exports['br-core']:SetCharInfo(source, key, value)
```

### Routing buckets

```lua
exports['br-core']:GetBucketObjects()
exports['br-core']:SetPlayerBucket(source, bucket) -> boolean
exports['br-core']:SetEntityBucket(entity, bucket) -> boolean
exports['br-core']:GetPlayersInBucket(bucket)
exports['br-core']:GetEntitiesInBucket(bucket)
```

### Items / permissions / misc

```lua
exports['br-core']:CreateUseableItem(item, cb)
exports['br-core']:CanUseItem(item) -> cb|nil
exports['br-core']:IsWhitelisted(source) -> boolean
exports['br-core']:AddPermission(source, permission)
exports['br-core']:RemovePermission(source, permission)
exports['br-core']:HasPermission(source, permission|table) -> boolean
exports['br-core']:GetPermission(source) -> table
exports['br-core']:IsOptin(source) -> boolean
exports['br-core']:ToggleOptin(source)
exports['br-core']:IsPlayerBanned(source) -> banned, reason?
exports['br-core']:Notify(source, text, type?, duration?, subTitle?, ...)
exports['br-core']:GetCoreVersion(invokingResource?) -> string
exports['br-core']:ExploitBan(playerId, origin)
exports['br-core']:HasPrimaryGroup(source, filter) -> boolean
exports['br-core']:HasGroup(source, filter) -> boolean
exports['br-core']:GetGroups(source) -> table
exports['br-core']:DeleteVehicle(vehicle)
exports['br-core']:GetVehicleClass(...)
exports['br-core']:GetVehiclesByName() / GetVehiclesByHash() / GetVehiclesByCategory()
exports['br-core']:GetWeapons() / GetLocations()
```

### BR career stats

```lua
exports['br-core']:GetBrStats(source|citizenid) -> { wins, kills, deaths, matches, knocks, revives, rank, ... }|nil
exports['br-core']:ApplyMatchResult(source, { kills?, death?, win?, match?, knock?, revive? }) -> brStats|nil
exports['br-core']:GetRankForWins(wins) -> rankId [, label]
exports['br-core']:ResetBrStats(source|citizenid)
```

### Bridge / hooks

```lua
exports['br-core']:GetCoreObject() -> QBCore-compat object
exports['br-core']:registerHook(event, cb) -> id
exports['br-core']:removeHooks(id)
exports['br-core']:SetField(...)  -- qb bridge
```

## Client exports

```lua
exports['br-core']:Notify(text, type?, duration?, ...)
exports['br-core']:GetPlayerData() -> PlayerData
exports['br-core']:HasPrimaryGroup(filter) -> boolean
exports['br-core']:HasGroup(filter) -> boolean
exports['br-core']:GetGroups() -> table
exports['br-core']:GetVehiclesByName() / GetVehiclesByHash() / GetVehiclesByCategory()
exports['br-core']:GetWeapons() / GetLocations()
exports['br-core']:GetCoreObject() -> QBCore-compat object
```

## Shared helpers

`HasPlayerGotGroup`, `GetPlayerGroups`, `BrRanks.GetRankForWins` / `GetLabel`, `Locale` (from shared modules / ranks).

## Usage

```lua
local player = exports['br-core']:GetPlayer(source)
local stats = exports['br-core']:GetBrStats(source)
exports['br-core']:ApplyMatchResult(source, { kills = 2, win = true, match = true })
exports['br-core']:SetPlayerBucket(source, 1)
```
