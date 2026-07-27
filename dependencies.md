# Dependencies

Third-party and stock CFX resources used by Dank’s BR. Full upstream docs are not duplicated here.

← [Docs index](README.md)

## oxmysql

| | |
|--|--|
| **Role** | MySQL bridge for all persistence (players, skins, bans, inventories, tints, crates, stats) |
| **Provides** | `mysql-async`, `ghmattimysql` |
| **Docs** | Upstream [oxmysql README](../resources/oxmysql/README.md) |

### Usage in this stack

```lua
-- Typical patterns used by br-* resources
MySQL.query.await('SELECT ...', { ... })
MySQL.single.await(...)
MySQL.insert.await(...)
MySQL.update.await(...)
exports.oxmysql:scalar_async(...)
```

### Commands (upstream)

| Command | Description |
|---------|-------------|
| `oxmysql_debug` | Toggle debug |
| `mysql` | Open oxmysql UI |

Start **before** `br-core` and any resource that touches the DB.

---

## pma-voice

| | |
|--|--|
| **Role** | Mumble proximity VOIP |
| **Provides** | `mumble-voip`, `tokovoip`, etc. |
| **Docs** | Upstream [pma-voice/docs](../resources/pma-voice/docs/) |

### BR wiring

- Built-in voice UI is off; talking + range shown on [br-hud](resources/br-hud.md) mic indicator (lobby + match).
- Radios / calls are disabled for this stack.
- Push-to-talk uses the game voice key.
- **F11** cycles proximity: Whisper → Normal → Yell (`LocalPlayer.state.proximity`).

Use pma-voice’s own exports if you need radio/call integrations; BR code primarily reads proximity state for the HUD.

---

## Stock CFX resources

Bundled under [`resources/[cfx]`](../resources/[cfx]/). Live `server.cfg` ensures the subset below; others in the tree are unused by this stack.

| Resource | Role in this stack |
|----------|--------------------|
| `mapmanager` | Map/gametype plumbing (required by CFX spawn stack) |
| `spawnmanager` | Used by [br-core](resources/br-core.md) / [br-multicharacter](resources/br-multicharacter.md) for ped spawn |
| `sessionmanager` | Session host lock (stock CFX) |
| `hardcap` | May be `ensure`’d in `server.cfg`; [br-queue](resources/br-queue.md) **stops** it on start and owns join limiting |
| `br-chat` | Started in the CFX block; `provide 'chat'` + `stop chat` replaces stock chat |

### Present but not ensured

| Resource | Notes |
|----------|-------|
| `baseevents` | Death/vehicle events under `[cfx]/[system]/baseevents`; not started by current `server.cfg` (BR handles death via its own match/lifeline flow) |
| `basic-gamemode` | **Do not start** — lobby owns spawn |
| `runcode` / `rconlog` / builders / playernames / maps | Dev or unused stock; leave off unless you intentionally enable them |

---

## What not to start

| Resource | Reason |
|----------|--------|
| `hardcap` (as join limiter) | `br-queue` stops it on start; do not re-enable after queue |
| `ox_target` | Use [br-target](resources/br-target.md) (Left Alt) |
| Stock `chat` | [br-chat](resources/br-chat.md) provides `chat` (`stop chat` after ensure) |
| `basic-gamemode` | Lobby owns spawn |
| `ox_lib` / `qbx_core` / `ox_inventory` | Replaced by `br-lib` / `br-core` / `br-inventory` |
