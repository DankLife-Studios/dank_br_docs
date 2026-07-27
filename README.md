# Dank’s BR Documentation

Detailed documentation for the Battle Royale resource stack.

## Docs website

A React (JSX) site under [`site/`](site/) renders these markdown pages with navigation, search, and an interactive React Flow game-loop diagram on Overview.

From this folder (`[docs]`), or from the server base:

```bash
cd site                 # or: cd "[docs]/site" from server base
pnpm install
pnpm start          # http://localhost:5174
pnpm build          # static output → site/dist
pnpm preview        # serve the production build
```

Markdown in `[docs]/` remains the source of truth — edit `.md` files, then refresh the site.

## Guides

| Page | Description |
|------|-------------|
| [Overview](overview.md) | Architecture, game loop, buckets, state bags, progress |
| [Commands](commands.md) | Master command and keybind reference |
| [Dependencies](dependencies.md) | `oxmysql`, `pma-voice`, stock CFX, and upstream notes |

## Resources

### Foundation

| Resource | Page |
|----------|------|
| br-lib | [resources/br-lib.md](resources/br-lib.md) |
| br-core | [resources/br-core.md](resources/br-core.md) |
| br-queue | [resources/br-queue.md](resources/br-queue.md) |
| br-chat | [resources/br-chat.md](resources/br-chat.md) |
| br-inventory | [resources/br-inventory.md](resources/br-inventory.md) |
| br-target | [resources/br-target.md](resources/br-target.md) |

### Session & lobby

| Resource | Page |
|----------|------|
| br-loadscreen | [resources/br-loadscreen.md](resources/br-loadscreen.md) |
| br-multicharacter | [resources/br-multicharacter.md](resources/br-multicharacter.md) |
| br-appearance | [resources/br-appearance.md](resources/br-appearance.md) |
| br-lobby | [resources/br-lobby.md](resources/br-lobby.md) |
| br-teams | [resources/br-teams.md](resources/br-teams.md) |
| br-tints | [resources/br-tints.md](resources/br-tints.md) |
| br-crates | [resources/br-crates.md](resources/br-crates.md) |
| br-leaderboard | [resources/br-leaderboard.md](resources/br-leaderboard.md) |

### Match loop

| Resource | Page |
|----------|------|
| br-airplane | [resources/br-airplane.md](resources/br-airplane.md) |
| br-loot | [resources/br-loot.md](resources/br-loot.md) |
| br-airdrops | [resources/br-airdrops.md](resources/br-airdrops.md) |
| br-zone | [resources/br-zone.md](resources/br-zone.md) |
| br-hud | [resources/br-hud.md](resources/br-hud.md) |
| br-lifeline | [resources/br-lifeline.md](resources/br-lifeline.md) |
| br-weather | [resources/br-weather.md](resources/br-weather.md) |
| br-match | [resources/br-match.md](resources/br-match.md) |
| br-admin | [resources/br-admin.md](resources/br-admin.md) |

## Exports & public APIs (by resource)

Each resource page has a full **Exports / Public API** section. Jump links:

| Resource | API surface |
|----------|-------------|
| [br-lib](resources/br-lib.md#public-api-lib) | Global `lib.*` / `cache` / `locale` |
| [br-core](resources/br-core.md#server-exports) | Session, players, stats, buckets |
| [br-queue](resources/br-queue.md#server-exports) | Queue size / in-queue |
| [br-chat](resources/br-chat.md#exports) | Messages & suggestions |
| [br-inventory](resources/br-inventory.md#server-exports) | Items, drops, stashes, hooks |
| [br-target](resources/br-target.md#client-exports) | Zones / models / entities |
| [br-multicharacter](resources/br-multicharacter.md#server-exports) | Selection bucket |
| [br-appearance](resources/br-appearance.md#client-exports) | Ped get/set / customization |
| [br-lobby](resources/br-lobby.md#server-exports) | Enter/leave, countdown |
| [br-teams](resources/br-teams.md#server-exports) | Party map |
| [br-tints](resources/br-tints.md#server-exports) | Unlock / query tints |
| [br-crates](resources/br-crates.md#server-exports) | Grant / balance |
| [br-airplane](resources/br-airplane.md#server-exports) | Drop lifecycle |
| [br-loot](resources/br-loot.md#server-exports) | Loot lifecycle |
| [br-airdrops](resources/br-airdrops.md#server-exports) | Airdrop lifecycle |
| [br-zone](resources/br-zone.md#server-exports) | Zone lifecycle |
| [br-lifeline](resources/br-lifeline.md#server-exports) | Heals / last stand / revive |
| [br-weather](resources/br-weather.md#server-exports) | Weather / time |
| [br-match](resources/br-match.md#server-exports) | Match orchestration |
| [br-admin](resources/br-admin.md#server-exports) | Duty / admin checks |
| br-hud / br-leaderboard / br-loadscreen | No exports — see event contracts / commands on their pages |

## Quick links

- Root hub: [../resources/README.md](../resources/README.md)
- Admin menu: `/admin` or **F10**
- Leaderboard: `/leaderboard` or **F7**
- Targeting: hold **Left Alt**
- Voice proximity cycle: **F11**
