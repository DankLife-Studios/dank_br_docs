# Commands

Master command and keybind reference. Restricted = ACE / permission check as noted.

← [Docs index](README.md) · [Overview](overview.md)

## Keybinds

| Key | Action | Resource |
|-----|--------|----------|
| **T** | Open chat | [br-chat](resources/br-chat.md) |
| **F2** / **K** / **TAB** | Inventory (convars) | [br-inventory](resources/br-inventory.md) |
| **F7** | Leaderboard | [br-leaderboard](resources/br-leaderboard.md) |
| **F10** | Admin menu | [br-admin](resources/br-admin.md) |
| **F11** | Cycle voice proximity | [pma-voice](dependencies.md) |
| **Left Alt** | Hold targeting | [br-target](resources/br-target.md) |
| **F** | Jump from plane (default) | [br-airplane](resources/br-airplane.md) |
| **E** | Open landed airdrop | [br-airdrops](resources/br-airdrops.md) |

## Player / lobby

| Command | Resource | Access | Description |
|---------|----------|--------|-------------|
| `/teams` | br-teams | Lobby | Open party NUI |
| `/tints` | br-tints | Lobby | Weapon tint selection |
| `/crates` | br-crates | Lobby | Open cosmetic crates |
| `/leaderboard` | br-leaderboard | All | Career board (also F7) |
| `/chatsettings` | br-chat | All | Chat font/opacity/position |
| `/relog` | br-multicharacter | All | Return to character select |
| `/reloadskin` | br-appearance | All | Reload saved appearance |
| `/clearstuckprops` | br-appearance | All | Clear stuck props |
| `/ooc` | br-core | All | Proximity OOC chat |
| `/id` | br-core | All | Show server id |
| `/citizenid` | br-core | All | Show citizenid |
| `/steal` | br-inventory | Convar | Open nearby player inventory |
| `/minimapshape` | br-hud | All | Set/toggle minimap `circle` \| `square` |

## Match admin

| Command | Resource | Access | Description |
|---------|----------|--------|-------------|
| `/startmatch` | br-match | `group.admin` | Start match from lobby |
| `/endmatch` | br-match | `group.admin` | Force-end match |
| `/quitmatch` | br-match | `group.admin` | Quit match for yourself |
| `/botmatch [count]` | br-bots | `group.admin` | Observe + start bot test match (min 2 bots) |
| `/spawnbots [count]` | br-bots | `group.admin` | Queue NPC bots for next match |
| `/clearbots` | br-bots | `group.admin` | Clear queued / active test bots |
| `/botstatus` | br-bots | `group.admin` | Bot match status (alive, host, stages) |
| `/botkill [id\|all]` | br-bots | `group.admin` | Force-eliminate bot(s) |
| `/botgoto [id]` | br-bots | `group.admin` | Teleport to a bot |
| `/admin` | br-admin | Menu open; actions need admin | Open admin NUI (F10) |
| `/adminduty` | br-admin | Admin check | Toggle duty (excluded from matchmaking) |

## Core / moderation

| Command | Resource | Access | Args | Description |
|---------|----------|--------|------|-------------|
| `/tp` | br-core | `group.admin` | `x` or `x y z` / playerId | Teleport |
| `/tpm` | br-core | `group.admin` | — | Teleport to waypoint |
| `/togglepvp` | br-core | `group.admin` | — | Toggle `GlobalState.PVPEnabled` |
| `/addpermission` | br-core | `group.admin` | playerId, permission | Grant permission |
| `/removepermission` | br-core | `group.admin` | playerId, permission | Remove permission |
| `/openserver` | br-core | `group.admin` | — | Open server |
| `/closeserver` | br-core | `group.admin` | reason | Close + kick non-whitelist |
| `/car` | br-core | `group.admin` | model, keep? | Spawn vehicle |
| `/dv` | br-core | `group.admin` | radius? | Delete vehicle(s) |
| `/logout` | br-core | `group.admin` | — | Logout player |
| `/deletechar` | br-core | `group.admin` | id | Force-delete character |
| `/optin` | br-core | `group.admin` | — | Only if `requireOptIn` |
| `/pedmenu` | br-appearance | `group.admin` | playerID? | Open ped/clothing menu |

## Inventory admin

| Command | Resource | Access | Args | Description |
|---------|----------|--------|------|-------------|
| `/additem` `/giveitem` | br-inventory | `group.admin` | target, item, count?, type? | Give item |
| `/removeitem` | br-inventory | `group.admin` | target, item, count?, type? | Remove item |
| `/setitem` | br-inventory | `group.admin` | target, item, count?, type? | Set item count |
| `/clearinv` | br-inventory | `group.admin` | invId | Wipe inventory |
| `/takeinv` | br-inventory | `group.admin` | target | Confiscate |
| `/restoreinv` `/returninv` | br-inventory | `group.admin` | target | Return confiscated |
| `/saveinv` | br-inventory | `group.admin` | lock? | Save to DB |
| `/viewinv` | br-inventory | `group.admin` | invId | Inspect inventory |
| `/clearevidence` | br-inventory | boss check | locker | Clear evidence stash |
| `/convertinventory` | br-inventory | console | esx\|… | Migration |
| `/clearActiveIdentifier` | br-inventory | console | identifier | Kick stuck player |

## Tints / crates admin

| Command | Resource | Access | Args | Description |
|---------|----------|--------|------|-------------|
| `/unlocktint` | br-tints | `group.admin` | id, weapon (`*`\|`WEAPON_*`), tint | Unlock tint |
| `/listtints` | br-tints | `group.admin` | — | List tint labels (F8) |
| `/unlockskin` | br-tints | `group.admin` | — | Stub (skins disabled) |
| `/grantcrate` | br-crates | `group.admin` | id, amount? | Grant crates |

## Weather / time

All require `group.admin` ([br-weather](resources/br-weather.md)).

| Command | Args | Description |
|---------|------|-------------|
| `/weather` | type | Force weather |
| `/weathercycle` `/weatherseq` | — | Rebuild weather queue |
| `/freezeweather` | `0`\|`1` | Freeze queue |
| `/blackout` | — | Toggle blackout |
| `/time` | hour, minute? | Set time |
| `/noon` `/morning` `/evening` `/night` | — | Presets 12 / 9 / 18 / 23 |
| `/timescale` | scale (≥500) | ms per game minute |
| `/freezetime` | `0`\|`1` | Freeze time |

## Lib / misc

| Command | Resource | Access | Description |
|---------|----------|--------|-------------|
| `/brlocale` | br-lib | needs `br:userLocales` | Show/set/reset user locale |
| `+br_target` / `-br_target` | br-target | keybind | Targeting hold |

## ACE setup

```cfg
add_ace group.admin command allow
add_principal identifier.fivem:YOUR_ID group.admin
```
