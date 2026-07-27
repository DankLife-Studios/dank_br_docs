/** Navigation tree + page metadata for Dank’s BR docs. */

export const guides = [
  {
    id: 'overview',
    title: 'Overview',
    description: 'Architecture, game loop, buckets, state bags, progress',
    path: '/overview',
    file: 'overview.md',
  },
  {
    id: 'commands',
    title: 'Commands',
    description: 'Master command and keybind reference',
    path: '/commands',
    file: 'commands.md',
  },
  {
    id: 'dependencies',
    title: 'Dependencies',
    description: 'oxmysql, pma-voice, and upstream notes',
    path: '/dependencies',
    file: 'dependencies.md',
  },
];

export const resourceGroups = [
  {
    id: 'foundation',
    title: 'Foundation',
    items: [
      'br-lib',
      'br-core',
      'br-queue',
      'br-chat',
      'br-inventory',
      'br-target',
    ],
  },
  {
    id: 'session',
    title: 'Session & lobby',
    items: [
      'br-loadscreen',
      'br-multicharacter',
      'br-appearance',
      'br-lobby',
      'br-teams',
      'br-tints',
      'br-crates',
      'br-leaderboard',
    ],
  },
  {
    id: 'match',
    title: 'Match loop',
    items: [
      'br-airplane',
      'br-loot',
      'br-airdrops',
      'br-zone',
      'br-hud',
      'br-lifeline',
      'br-weather',
      'br-match',
      'br-admin',
    ],
  },
];

export const resourceTitles = {
  'br-lib': 'br-lib',
  'br-core': 'br-core',
  'br-queue': 'br-queue',
  'br-chat': 'br-chat',
  'br-inventory': 'br-inventory',
  'br-target': 'br-target',
  'br-loadscreen': 'br-loadscreen',
  'br-multicharacter': 'br-multicharacter',
  'br-appearance': 'br-appearance',
  'br-lobby': 'br-lobby',
  'br-teams': 'br-teams',
  'br-tints': 'br-tints',
  'br-crates': 'br-crates',
  'br-leaderboard': 'br-leaderboard',
  'br-airplane': 'br-airplane',
  'br-loot': 'br-loot',
  'br-airdrops': 'br-airdrops',
  'br-zone': 'br-zone',
  'br-hud': 'br-hud',
  'br-lifeline': 'br-lifeline',
  'br-weather': 'br-weather',
  'br-match': 'br-match',
  'br-admin': 'br-admin',
};

export const apiJumpLinks = [
  { resource: 'br-lib', hash: 'public-api-lib', label: 'Global lib.* / cache / locale' },
  { resource: 'br-core', hash: 'server-exports', label: 'Session, players, stats, buckets' },
  { resource: 'br-queue', hash: 'server-exports', label: 'Queue size / in-queue' },
  { resource: 'br-chat', hash: 'exports', label: 'Messages & suggestions' },
  { resource: 'br-inventory', hash: 'server-exports', label: 'Items, drops, stashes, hooks' },
  { resource: 'br-target', hash: 'client-exports', label: 'Zones / models / entities' },
  { resource: 'br-multicharacter', hash: 'server-exports', label: 'Selection bucket' },
  { resource: 'br-appearance', hash: 'client-exports', label: 'Ped get/set / customization' },
  { resource: 'br-lobby', hash: 'server-exports', label: 'Enter/leave, countdown' },
  { resource: 'br-teams', hash: 'server-exports', label: 'Party map' },
  { resource: 'br-tints', hash: 'server-exports', label: 'Unlock / query tints' },
  { resource: 'br-crates', hash: 'server-exports', label: 'Grant / balance' },
  { resource: 'br-airplane', hash: 'server-exports', label: 'Drop lifecycle' },
  { resource: 'br-loot', hash: 'server-exports', label: 'Loot lifecycle' },
  { resource: 'br-airdrops', hash: 'server-exports', label: 'Airdrop lifecycle' },
  { resource: 'br-zone', hash: 'server-exports', label: 'Zone lifecycle' },
  { resource: 'br-lifeline', hash: 'server-exports', label: 'Heals / last stand / revive' },
  { resource: 'br-weather', hash: 'server-exports', label: 'Weather / time' },
  { resource: 'br-match', hash: 'server-exports', label: 'Match orchestration' },
  { resource: 'br-admin', hash: 'server-exports', label: 'Duty / admin checks' },
];

export function getResourcePath(name) {
  return `/resources/${name}`;
}

export function getAllPages() {
  const pages = [
    {
      id: 'home',
      title: 'Documentation',
      description: 'Full table of contents',
      path: '/',
      file: 'README.md',
    },
    ...guides,
  ];

  for (const group of resourceGroups) {
    for (const name of group.items) {
      pages.push({
        id: name,
        title: resourceTitles[name] || name,
        description: `${name} resource reference`,
        path: getResourcePath(name),
        file: `resources/${name}.md`,
        group: group.title,
      });
    }
  }

  return pages;
}
