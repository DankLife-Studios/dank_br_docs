# br-chat

Custom violet NUI chat (`provide 'chat'`). Font size, opacity, drag position via settings (⚙ / `/chatsettings`); KVP per player. Replaces stock `chat`.

← [Docs index](../README.md)

## Dependencies

`br-lib`

## Config

| Key | Default |
|-----|---------|
| `OpenKey` | `T` |
| `MaxHistory` | `100` |
| `MaxMessageLength` | `280` |
| `RateLimitMs` | `400` |
| Defaults | fontSize 15, opacity 0.72, width 28% |

## Commands

| Command | Access | Description |
|---------|--------|-------------|
| `/chatsettings` | all | Open chat settings UI |

## Events

Stock-compatible: `chat:addMessage`, `chat:addSuggestion`, `chat:addSuggestions`, `chat:removeSuggestion`, `chat:clear`.

BR: `br-chat:client:addMessage`, `br-chat:server:send`.

## Exports

### Client

```lua
exports['br-chat']:addMessage(message)  -- table or { args = ... }
exports['br-chat']:addSuggestion(name, help, params?)
exports['br-chat']:addSuggestions(list)
exports['br-chat']:removeSuggestion(name)
exports['br-chat']:clear()
```

### Server

```lua
exports['br-chat']:addMessage(target?, message)
-- target optional (-1 = all); message table or string
```

## Usage

```lua
exports['br-chat']:addMessage(-1, {
  args = { 'System', 'Match starting' },
  color = { 180, 100, 255 },
})
```
