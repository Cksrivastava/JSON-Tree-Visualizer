import React, { useCallback, useEffect, useMemo } from 'react';
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import dagre from 'dagre';
import 'reactflow/dist/style.css';

const nodeWidth = 160;
const nodeHeight = 48;

export function buildFlowFromJson(json) {
  const nodes = [];
  const edges = [];
  const traverse = (obj, path='$') => {
    const id = path;
    const type = (obj === null || typeof obj !== 'object') ? 'primitive' : Array.isArray(obj) ? 'array' : 'object';
    const label = type === 'primitive' ? String(obj) : (path === '$' ? 'root' : path.split('.').slice(-1)[0]);
    nodes.push({ id, data: { label, nodeType: type, path, value: obj }, width: nodeWidth, height: nodeHeight, type: 'default' });
    if (type !== 'primitive') {
      const entries = Array.isArray(obj) ? obj.map((v,i)=>[String(i),v]) : Object.entries(obj);
      entries.forEach(([key, val]) => {
        const childPath = path === '$' ? `$.${key}` : `${path}.${key}`;
        edges.push({ id: `${id}-${childPath}`, source: id, target: childPath });
        traverse(val, childPath);
      });
    }
  };
  traverse(json);
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: 'LR', nodesep: 32, ranksep: 60 });
  nodes.forEach(n => g.setNode(n.id, { width: n.width, height: n.height }));
  edges.forEach(e => g.setEdge(e.source, e.target));
  dagre.layout(g);
  const positionedNodes = nodes.map(n => {
    const { x, y } = g.node(n.id);
    return { ...n, position: { x: x - nodeWidth/2, y: y - nodeHeight/2 }, style: styleForType(n.data.nodeType) };
  });
  return { nodes: positionedNodes, edges };
}

function styleForType(t) {
  if (t === 'object') return { padding: 8, borderRadius: 8, color:'#fff', background:'#7c3aed' };
  if (t === 'array') return { padding: 8, borderRadius: 8, color:'#fff', background:'#10b981' };
  return { padding: 8, borderRadius: 8, color:'#111', background:'#f59e0b' };
}

export default function TreeVisualizer({ jsonData, highlightPath, onNodeClick }) {
  const flow = useMemo(() => jsonData ? buildFlowFromJson(jsonData) : { nodes: [], edges: [] }, [jsonData]);
  const { nodes, edges } = flow;

  const handleNodeClick = useCallback((e, node) => {
    onNodeClick?.(node);
  }, [onNodeClick]);

  return (
    <div className="reactflow-wrapper">
      <ReactFlow nodes={nodes} edges={edges} onNodeClick={handleNodeClick}>
        <MiniMap nodeColor={n => n.data.nodeType === 'object' ? '#7c3aed' : n.data.nodeType === 'array' ? '#10b981' : '#f59e0b'} />
        <Controls />
        <Background gap={16} />
      </ReactFlow>
    </div>
  );
}
