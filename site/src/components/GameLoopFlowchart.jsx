import { useMemo } from 'react';
import {
  Background,
  BackgroundVariant,
  Controls,
  Handle,
  MarkerType,
  MiniMap,
  Panel,
  Position,
  ReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const PHASE = {
  connect: {
    accent: '#a78bfa',
    glow: 'rgba(167, 139, 250, 0.35)',
    fill: 'linear-gradient(160deg, rgba(167,139,250,0.22), rgba(22,27,32,0.95) 55%)',
  },
  identity: {
    accent: '#8b5cf6',
    glow: 'rgba(139, 92, 246, 0.32)',
    fill: 'linear-gradient(160deg, rgba(139,92,246,0.2), rgba(22,27,32,0.95) 55%)',
  },
  lobby: {
    accent: '#60a5fa',
    glow: 'rgba(96, 165, 250, 0.3)',
    fill: 'linear-gradient(160deg, rgba(96,165,250,0.18), rgba(22,27,32,0.95) 55%)',
  },
  match: {
    accent: '#f472b6',
    glow: 'rgba(244, 114, 182, 0.28)',
    fill: 'linear-gradient(160deg, rgba(244,114,182,0.16), rgba(22,27,32,0.95) 55%)',
  },
  end: {
    accent: '#34d399',
    glow: 'rgba(52, 211, 153, 0.3)',
    fill: 'linear-gradient(160deg, rgba(52,211,153,0.16), rgba(22,27,32,0.95) 55%)',
  },
};

function PhaseBand({ data }) {
  const theme = PHASE[data.phase] || PHASE.connect;
  return (
    <div className="flow-phase-band" style={{ '--phase-accent': theme.accent }}>
      <span className="flow-phase-band-label">{data.label}</span>
      <span className="flow-phase-band-hint">{data.hint}</span>
    </div>
  );
}

function FlowNode({ data }) {
  const theme = PHASE[data.phase] || PHASE.connect;
  const isHub = data.kind === 'hub';
  const isWin = data.kind === 'win';
  const isCompact = data.kind === 'chip';

  return (
    <div
      className={[
        'flow-node',
        isHub ? 'flow-node--hub' : '',
        isWin ? 'flow-node--win' : '',
        isCompact ? 'flow-node--chip' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        '--node-accent': theme.accent,
        '--node-glow': theme.glow,
        background: theme.fill,
      }}
    >
      <Handle type="target" position={Position.Top} className="flow-handle" />
      <div className="flow-node-accent" />
      <div className="flow-node-body">
        {data.eyebrow ? <div className="flow-node-eyebrow">{data.eyebrow}</div> : null}
        <div className="flow-node-title">{data.label}</div>
        {data.sub ? <div className="flow-node-sub">{data.sub}</div> : null}
      </div>
      <Handle type="source" position={Position.Bottom} className="flow-handle" />
      {data.sideSource ? (
        <Handle type="source" position={Position.Right} id="side" className="flow-handle" />
      ) : null}
      {data.leftSource ? (
        <Handle type="source" position={Position.Left} id="left" className="flow-handle" />
      ) : null}
    </div>
  );
}

function DecisionNode({ data }) {
  return (
    <div className="flow-decision">
      <Handle type="target" position={Position.Top} className="flow-handle" />
      <div className="flow-decision-inner">
        <span className="flow-decision-label">{data.label}</span>
      </div>
      <Handle type="source" position={Position.Right} id="yes" className="flow-handle" />
      <Handle type="source" position={Position.Bottom} id="no" className="flow-handle" />
    </div>
  );
}

const nodeTypes = {
  flow: FlowNode,
  decision: DecisionNode,
  phase: PhaseBand,
};

const stroke = {
  main: '#7c6cf0',
  soft: '#4b5568',
  loop: '#34d399',
  branch: '#60a5fa',
  danger: '#f472b6',
  warn: '#fbbf24',
};

function marker(color) {
  return { type: MarkerType.ArrowClosed, color, width: 18, height: 18 };
}

function n(id, type, x, y, data, width) {
  return {
    id,
    type,
    position: { x, y },
    data,
    draggable: false,
    connectable: false,
    selectable: false,
    style: width ? { width } : undefined,
  };
}

function e(id, source, target, label, opts = {}) {
  const color = opts.color || stroke.main;
  return {
    id,
    source,
    target,
    sourceHandle: opts.sourceHandle,
    targetHandle: opts.targetHandle,
    label: label || undefined,
    type: 'smoothstep',
    animated: Boolean(opts.animated),
    style: {
      stroke: color,
      strokeWidth: opts.thick ? 2.25 : 1.6,
      strokeDasharray: opts.dashed ? '6 5' : undefined,
      opacity: opts.muted ? 0.75 : 1,
    },
    markerEnd: marker(color),
    labelStyle: {
      fill: '#e8edf2',
      fontSize: 11,
      fontWeight: 600,
      fontFamily: 'IBM Plex Sans, sans-serif',
    },
    labelBgStyle: {
      fill: '#0e1114',
      fillOpacity: 0.88,
    },
    labelBgPadding: [5, 8],
    labelBgBorderRadius: 999,
  };
}

/** Compact column layout: main spine + clear branches */
const X = { band: 40, main: 260, left: 40, right: 520, chip0: 120, chipGap: 130 };
const Y = {
  bandConnect: 0,
  join: 56,
  queue: 150,
  load: 244,
  bandIdentity: 340,
  multi: 396,
  login: 490,
  appearance: 584,
  lobby: 700,
  meta: 700,
  late: 790,
  start: 900,
  bandMatch: 990,
  plane: 1046,
  para: 1140,
  warmup: 1234,
  fight: 1340,
  chips: 1450,
  life: 1560,
  win: 1560,
  elimQ: 1680,
  crates: 1680,
  spec: 1800,
  back: 1920,
};

export default function GameLoopFlowchart() {
  const { nodes, edges } = useMemo(() => {
    const nodes = [
      n('band-connect', 'phase', X.band, Y.bandConnect, {
        label: '01 · Connect',
        hint: 'Queue & session boot',
        phase: 'connect',
      }, 640),
      n('join', 'flow', X.main, Y.join, {
        label: 'FiveM join',
        sub: 'Player connects to server',
        phase: 'connect',
        eyebrow: 'Entry',
        kind: 'hub',
      }),
      n('queue', 'flow', X.main, Y.queue, {
        label: 'br-queue',
        sub: 'Deferral / admit',
        phase: 'connect',
      }),
      n('load', 'flow', X.main, Y.load, {
        label: 'br-loadscreen',
        sub: 'Tactical loading UI',
        phase: 'connect',
      }),

      n('band-identity', 'phase', X.band, Y.bandIdentity, {
        label: '02 · Character',
        hint: 'One slot · login · appearance',
        phase: 'identity',
      }, 640),
      n('multi', 'flow', X.main, Y.multi, {
        label: 'br-multicharacter',
        sub: 'Single character slot',
        phase: 'identity',
      }),
      n('login', 'flow', X.main, Y.login, {
        label: 'br-core Login',
        sub: 'Session + player state',
        phase: 'identity',
        sideSource: true,
        leftSource: true,
      }),
      n('appearance', 'flow', X.left, Y.appearance, {
        label: 'br-appearance',
        sub: 'New character only',
        phase: 'identity',
      }),

      n('lobby', 'flow', X.main, Y.lobby, {
        label: 'br-lobby',
        sub: 'Bucket 1 · invincible wait room',
        phase: 'lobby',
        eyebrow: 'Hub',
        kind: 'hub',
        sideSource: true,
      }),
      n('meta', 'flow', X.right, Y.meta, {
        label: 'Lobby UIs',
        sub: '/teams · /tints · /crates · /lb',
        phase: 'lobby',
      }),
      n('late', 'flow', X.left, Y.late, {
        label: 'Late join',
        sub: 'Waits for next match',
        phase: 'lobby',
      }),
      n('start', 'flow', X.main, Y.start, {
        label: 'StartMatch',
        sub: 'Countdown or /startmatch',
        phase: 'lobby',
        eyebrow: 'br-match',
      }),

      n('band-match', 'phase', X.band, Y.bandMatch, {
        label: '03 · Match',
        hint: 'Bucket 2 · drop · fight · systems',
        phase: 'match',
      }, 640),
      n('plane', 'flow', X.main, Y.plane, {
        label: 'br-airplane',
        sub: 'Shared cargoplane drop',
        phase: 'match',
        leftSource: true,
      }),
      n('para', 'flow', X.left, Y.para, {
        label: 'Parachute',
        sub: 'Jump or force eject',
        phase: 'match',
      }),
      n('warmup', 'flow', X.main, Y.warmup, {
        label: 'Warmup',
        sub: '10 seconds',
        phase: 'match',
      }),
      n('fight', 'flow', X.main, Y.fight, {
        label: 'InProgress',
        sub: 'Last player / team wins',
        phase: 'match',
        eyebrow: 'Fight',
        kind: 'hub',
        sideSource: true,
        leftSource: true,
      }),

      n('zone', 'flow', X.chip0, Y.chips, {
        label: 'br-zone',
        phase: 'match',
        kind: 'chip',
      }),
      n('loot', 'flow', X.chip0 + X.chipGap, Y.chips, {
        label: 'br-loot',
        phase: 'match',
        kind: 'chip',
      }),
      n('air', 'flow', X.chip0 + X.chipGap * 2, Y.chips, {
        label: 'br-airdrops',
        phase: 'match',
        kind: 'chip',
      }),
      n('hud', 'flow', X.chip0 + X.chipGap * 3, Y.chips, {
        label: 'br-hud',
        phase: 'match',
        kind: 'chip',
      }),

      n('life', 'flow', X.left, Y.life, {
        label: 'br-lifeline',
        sub: 'Downed · revive window',
        phase: 'match',
      }),
      n('win', 'flow', X.right, Y.win, {
        label: 'Victory',
        sub: 'Every teammate gets win',
        phase: 'end',
        eyebrow: 'Win',
        kind: 'win',
      }),
      n('elimQ', 'decision', X.main + 20, Y.elimQ, {
        label: 'Teammates alive?',
      }),
      n('crates', 'flow', X.right, Y.crates, {
        label: 'br-crates',
        sub: 'Grant win crate',
        phase: 'end',
      }),
      n('spec', 'flow', X.right, Y.spec, {
        label: 'Spectate',
        sub: 'Cycle alive teammates',
        phase: 'match',
      }),
      n('back', 'flow', X.main, Y.back, {
        label: 'Back to lobby',
        sub: 'Placement · ~5s return',
        phase: 'end',
        eyebrow: 'Loop',
        kind: 'hub',
      }),
    ];

    const edges = [
      e('e1', 'join', 'queue', null, { color: stroke.main, thick: true, animated: true }),
      e('e2', 'queue', 'load', 'admit', { color: stroke.main, thick: true }),
      e('e3', 'load', 'multi', null, { color: stroke.main, thick: true }),
      e('e4', 'multi', 'login', null, { color: stroke.main, thick: true }),
      e('e5', 'login', 'appearance', 'new', {
        color: stroke.branch,
        sourceHandle: 'left',
      }),
      e('e6', 'appearance', 'lobby', null, { color: stroke.branch }),
      e('e7', 'login', 'lobby', 'existing', {
        color: stroke.main,
        thick: true,
      }),
      e('e8', 'lobby', 'meta', 'UIs', {
        color: stroke.branch,
        sourceHandle: 'side',
      }),
      e('e9', 'meta', 'lobby', null, {
        color: stroke.branch,
        animated: true,
        dashed: true,
      }),
      e('e10', 'late', 'lobby', 'wait', { color: stroke.soft, muted: true }),
      e('e11', 'lobby', 'start', 'ready', { color: stroke.main, thick: true, animated: true }),
      e('e12', 'start', 'plane', null, { color: stroke.danger, thick: true }),
      e('e13', 'plane', 'para', 'jump', {
        color: stroke.danger,
        sourceHandle: 'left',
      }),
      e('e14', 'plane', 'warmup', 'route end', { color: stroke.danger }),
      e('e15', 'para', 'warmup', null, { color: stroke.danger }),
      e('e16', 'warmup', 'fight', null, { color: stroke.danger, thick: true, animated: true }),
      e('e17', 'fight', 'zone', null, { color: stroke.soft, dashed: true, muted: true }),
      e('e18', 'fight', 'loot', null, { color: stroke.soft, dashed: true, muted: true }),
      e('e19', 'fight', 'air', null, { color: stroke.soft, dashed: true, muted: true }),
      e('e20', 'fight', 'hud', null, { color: stroke.soft, dashed: true, muted: true }),
      e('e21', 'fight', 'life', 'downed', {
        color: stroke.warn,
        sourceHandle: 'left',
      }),
      e('e22', 'life', 'fight', 'revived', {
        color: stroke.loop,
        animated: true,
        dashed: true,
      }),
      e('e23', 'life', 'elimQ', 'bleedout', { color: stroke.warn }),
      e('e24', 'fight', 'elimQ', 'eliminated', { color: stroke.warn }),
      e('e25', 'elimQ', 'spec', 'yes', {
        color: stroke.branch,
        sourceHandle: 'yes',
      }),
      e('e26', 'elimQ', 'back', 'no / solo', {
        color: stroke.soft,
        sourceHandle: 'no',
      }),
      e('e27', 'spec', 'back', 'team wiped', { color: stroke.soft }),
      e('e28', 'fight', 'win', 'last alive', {
        color: stroke.loop,
        thick: true,
        sourceHandle: 'side',
        animated: true,
      }),
      e('e29', 'win', 'crates', 'reward', { color: stroke.loop }),
      e('e30', 'crates', 'lobby', 'next round', {
        color: stroke.loop,
        thick: true,
        animated: true,
      }),
      e('e31', 'back', 'lobby', 'next round', {
        color: stroke.loop,
        thick: true,
        animated: true,
      }),
    ];

    return { nodes, edges };
  }, []);

  return (
    <div className="game-loop-flow" aria-label="Game loop flowchart">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.12, maxZoom: 1.05 }}
        minZoom={0.28}
        maxZoom={1.35}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnScroll
        zoomOnScroll
        preventScrolling={false}
        defaultEdgeOptions={{ type: 'smoothstep' }}
        colorMode="dark"
      >
        <Background
          id="dots"
          variant={BackgroundVariant.Dots}
          gap={22}
          size={1.2}
          color="rgba(167, 139, 250, 0.16)"
        />
        <Background
          id="fade"
          variant={BackgroundVariant.Lines}
          gap={88}
          color="rgba(42, 52, 62, 0.35)"
          lineWidth={0.5}
        />
        <MiniMap
          className="flow-minimap"
          pannable
          zoomable
          maskColor="rgba(8, 10, 14, 0.72)"
          nodeStrokeWidth={2}
          nodeColor={(node) => {
            if (node.type === 'phase') return 'transparent';
            if (node.type === 'decision') return '#fbbf24';
            const phase = node.data?.phase;
            return PHASE[phase]?.accent || '#a78bfa';
          }}
        />
        <Controls showInteractive={false} position="bottom-left" />
        <Panel position="top-right" className="flow-legend">
          <div className="flow-legend-title">Phases</div>
          <div className="flow-legend-row"><i style={{ background: PHASE.connect.accent }} />Connect</div>
          <div className="flow-legend-row"><i style={{ background: PHASE.identity.accent }} />Character</div>
          <div className="flow-legend-row"><i style={{ background: PHASE.lobby.accent }} />Lobby</div>
          <div className="flow-legend-row"><i style={{ background: PHASE.match.accent }} />Match</div>
          <div className="flow-legend-row"><i style={{ background: PHASE.end.accent }} />Outcome</div>
          <div className="flow-legend-hint">Scroll to pan · Ctrl+scroll to zoom</div>
        </Panel>
      </ReactFlow>
    </div>
  );
}
