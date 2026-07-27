import { useMemo } from 'react';
import {
  Background,
  Controls,
  MarkerType,
  Position,
  ReactFlow,
  Handle,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const PHASE = {
  connect: { bg: 'rgba(167, 139, 250, 0.14)', border: '#a78bfa', label: 'Connect' },
  identity: { bg: 'rgba(139, 92, 246, 0.16)', border: '#8b5cf6', label: 'Character' },
  lobby: { bg: 'rgba(96, 165, 250, 0.14)', border: '#60a5fa', label: 'Lobby · bucket 1' },
  match: { bg: 'rgba(244, 114, 182, 0.12)', border: '#f472b6', label: 'Match · bucket 2' },
  end: { bg: 'rgba(52, 211, 153, 0.12)', border: '#34d399', label: 'Outcome' },
};

function FlowNode({ data }) {
  const phase = PHASE[data.phase] || PHASE.connect;
  return (
    <div
      className={`flow-node flow-node--${data.kind || 'step'}`}
      style={{
        background: phase.bg,
        borderColor: phase.border,
      }}
    >
      <Handle type="target" position={Position.Top} className="flow-handle" />
      {data.phaseLabel ? <div className="flow-node-phase">{data.phaseLabel}</div> : null}
      <div className="flow-node-title">{data.label}</div>
      {data.sub ? <div className="flow-node-sub">{data.sub}</div> : null}
      <Handle type="source" position={Position.Bottom} className="flow-handle" />
    </div>
  );
}

function DecisionNode({ data }) {
  return (
    <div className="flow-node flow-node--decision">
      <Handle type="target" position={Position.Top} className="flow-handle" />
      <div className="flow-node-title">{data.label}</div>
      <Handle type="source" position={Position.Bottom} className="flow-handle" />
      <Handle type="source" position={Position.Right} id="yes" className="flow-handle" />
      <Handle type="source" position={Position.Left} id="no" className="flow-handle" />
    </div>
  );
}

const nodeTypes = {
  flow: FlowNode,
  decision: DecisionNode,
};

const edgeDefaults = {
  type: 'smoothstep',
  animated: false,
  style: { stroke: '#6b7280', strokeWidth: 1.5 },
  markerEnd: { type: MarkerType.ArrowClosed, color: '#6b7280', width: 16, height: 16 },
};

function n(id, label, x, y, phase, extra = {}) {
  return {
    id,
    type: extra.type || 'flow',
    position: { x, y },
    data: { label, phase, ...extra },
    draggable: false,
    connectable: false,
  };
}

function e(id, source, target, label, extras = {}) {
  return {
    id,
    source,
    target,
    label,
    ...edgeDefaults,
    labelStyle: { fill: '#c4b5fd', fontSize: 11, fontWeight: 500 },
    labelBgStyle: { fill: '#12171c', fillOpacity: 0.9 },
    labelBgPadding: [4, 6],
    labelBgBorderRadius: 4,
    ...extras,
  };
}

const COL = { main: 280, left: 40, right: 520, systems: 160 };
const ROW = 90;

export default function GameLoopFlowchart() {
  const { nodes, edges } = useMemo(() => {
    const nodes = [
      n('join', 'FiveM join', COL.main, 0, 'connect', { phaseLabel: 'Connect' }),
      n('queue', 'br-queue', COL.main, ROW, 'connect'),
      n('load', 'br-loadscreen', COL.main, ROW * 2, 'connect'),

      n('multi', 'br-multicharacter', COL.main, ROW * 3, 'identity', { phaseLabel: 'Character' }),
      n('login', 'br-core Login', COL.main, ROW * 4, 'identity'),
      n('appearance', 'br-appearance', COL.left, ROW * 5, 'identity', { sub: 'new character' }),
      n('lobby', 'br-lobby', COL.main, ROW * 6, 'lobby', { phaseLabel: 'Lobby · bucket 1' }),

      n('meta', 'Lobby UIs', COL.right, ROW * 6, 'lobby', { sub: '/teams /tints /crates /lb' }),
      n('late', 'Late join', COL.left, ROW * 6.8, 'lobby', { sub: 'during active match' }),
      n('start', 'br-match StartMatch', COL.main, ROW * 8, 'lobby', { sub: 'countdown or /startmatch' }),

      n('plane', 'br-airplane', COL.main, ROW * 9, 'match', { phaseLabel: 'Match · bucket 2' }),
      n('para', 'Parachute', COL.left, ROW * 10, 'match'),
      n('warmup', 'Warmup', COL.main, ROW * 11, 'match', { sub: '10s' }),
      n('fight', 'InProgress', COL.main, ROW * 12, 'match'),

      n('zone', 'br-zone', COL.systems, ROW * 12.8, 'match'),
      n('loot', 'br-loot', COL.systems + 120, ROW * 12.8, 'match'),
      n('air', 'br-airdrops', COL.systems + 240, ROW * 12.8, 'match'),
      n('hud', 'br-hud', COL.systems + 360, ROW * 12.8, 'match'),

      n('life', 'br-lifeline', COL.left, ROW * 14, 'match', { sub: 'downed · non-solo' }),
      n('elimQ', 'Teammates alive?', COL.main, ROW * 15.2, 'match', {
        type: 'decision',
      }),
      n('spec', 'Spectate', COL.right, ROW * 16.4, 'match'),
      n('back', 'Back to lobby', COL.main, ROW * 17.6, 'end', { phaseLabel: 'Outcome' }),
      n('win', 'Victory', COL.right, ROW * 14, 'end', { sub: 'last alive' }),
      n('crates', 'br-crates', COL.right, ROW * 15.2, 'end', { sub: 'grant crate' }),
    ];

    const edges = [
      e('e1', 'join', 'queue'),
      e('e2', 'queue', 'load', 'admit'),
      e('e3', 'load', 'multi'),
      e('e4', 'multi', 'login'),
      e('e5', 'login', 'appearance', 'new'),
      e('e6', 'appearance', 'lobby'),
      e('e7', 'login', 'lobby', 'existing', {
        sourceHandle: null,
        style: { ...edgeDefaults.style, stroke: '#8b5cf6' },
      }),
      e('e8', 'lobby', 'meta'),
      e('e9', 'meta', 'lobby', null, { animated: true }),
      e('e10', 'late', 'lobby'),
      e('e11', 'lobby', 'start', 'start match'),
      e('e12', 'start', 'plane'),
      e('e13', 'plane', 'para', 'jump / force'),
      e('e14', 'plane', 'warmup', 'route end'),
      e('e15', 'para', 'warmup'),
      e('e16', 'warmup', 'fight'),
      e('e17', 'fight', 'zone', null, { style: { stroke: '#4b5563', strokeDasharray: '4 4' } }),
      e('e18', 'fight', 'loot', null, { style: { stroke: '#4b5563', strokeDasharray: '4 4' } }),
      e('e19', 'fight', 'air', null, { style: { stroke: '#4b5563', strokeDasharray: '4 4' } }),
      e('e20', 'fight', 'hud', null, { style: { stroke: '#4b5563', strokeDasharray: '4 4' } }),
      e('e21', 'fight', 'life', 'downed'),
      e('e22', 'life', 'fight', 'revived', { animated: true }),
      e('e23', 'life', 'elimQ', 'bleedout'),
      e('e24', 'fight', 'elimQ', 'eliminated'),
      e('e25', 'elimQ', 'spec', 'yes', { sourceHandle: 'yes' }),
      e('e26', 'elimQ', 'back', 'no', { sourceHandle: 'no' }),
      e('e27', 'spec', 'back', 'team wiped'),
      e('e28', 'fight', 'win', 'last alive'),
      e('e29', 'win', 'crates', 'grant crate'),
      e('e30', 'win', 'lobby', null, {
        style: { ...edgeDefaults.style, stroke: '#34d399' },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#34d399', width: 16, height: 16 },
      }),
      e('e31', 'back', 'lobby', null, {
        style: { ...edgeDefaults.style, stroke: '#34d399' },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#34d399', width: 16, height: 16 },
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
        fitViewOptions={{ padding: 0.16 }}
        minZoom={0.35}
        maxZoom={1.4}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnScroll
        zoomOnScroll
        preventScrolling={false}
      >
        <Background gap={18} size={1} color="rgba(167, 139, 250, 0.12)" />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
