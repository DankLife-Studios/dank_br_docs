# br-crates

CS:GO-style lobby crate opening (`/crates`). Match winners earn crates; open for weighted tint unlocks. Balance in `player_crates`.

← [Docs index](../README.md)

## Dependencies

`br-lib`, `br-core`, `br-lobby`, `br-tints`, `oxmysql`

## Config (`shared/config.lua`)

```lua
Config.Command = 'crates'
Config.GrantOnWin = 1
```

## Commands

| Command | Access | Args | Description |
|---------|--------|------|-------------|
| `/crates` | lobby | — | Open crates UI |
| `/grantcrate` | `group.admin` | id, amount? | Grant crates |

## Events / callbacks

| Name | Notes |
|------|-------|
| `br-crates:client:open` | Open UI |
| `br-crates:server:getData` | `lib.callback` — lobby only |
| `br-crates:server:open` | `lib.callback` — open one crate |

## Server exports

```lua
exports['br-crates']:GrantCrate(source, amount) -> boolean
exports['br-crates']:GetCrateBalance(sourceOrCitizenId) -> number
```

## Usage

```lua
-- on match win (also done by br-match)
exports['br-crates']:GrantCrate(source, Config.GrantOnWin)
local bal = exports['br-crates']:GetCrateBalance(source)
```
