import React, { useEffect, useMemo, useRef, useState } from 'react';

export const Position = {
  Top: 'top',
  Right: 'right',
  Bottom: 'bottom',
  Left: 'left',
};

export const MarkerType = {
  Arrow: 'arrow',
  ArrowClosed: 'arrowclosed',
};

export const BackgroundVariant = {
  Lines: 'lines',
  Dots: 'dots',
  Cross: 'cross',
};

const nodeWidth = 184;
const nodeHeight = 100;

function anchor(node, side) {
  const x = node.position?.x ?? 0;
  const y = node.position?.y ?? 0;
  switch (side) {
    case Position.Top:
      return { x: x + nodeWidth / 2, y };
    case Position.Bottom:
      return { x: x + nodeWidth / 2, y: y + nodeHeight };
    case Position.Left:
      return { x, y: y + nodeHeight / 2 };
    case Position.Right:
    default:
      return { x: x + nodeWidth, y: y + nodeHeight / 2 };
  }
}

function getEdgePath(source, target) {
  const horizontal = Math.abs(target.x - source.x) >= Math.abs(target.y - source.y);
  if (horizontal) {
    const midX = source.x + (target.x - source.x) / 2;
    return `M ${source.x} ${source.y} C ${midX} ${source.y}, ${midX} ${target.y}, ${target.x} ${target.y}`;
  }

  const midY = source.y + (target.y - source.y) / 2;
  return `M ${source.x} ${source.y} C ${source.x} ${midY}, ${target.x} ${midY}, ${target.x} ${target.y}`;
}

function useContainerRect() {
  const ref = useRef(null);
  const [rect, setRect] = useState({ width: 1, height: 1 });

  useEffect(() => {
    if (!ref.current) return undefined;

    const sync = () => {
      const bounds = ref.current.getBoundingClientRect();
      setRect({ width: bounds.width || 1, height: bounds.height || 1 });
    };

    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return [ref, rect];
}

export function Handle({ className = '', type, position, isConnectable, ...props }) {
  void isConnectable;
  const placement = {
    position: 'absolute',
    pointerEvents: 'none',
    ...(position === Position.Top ? { top: -4, left: '50%', transform: 'translateX(-50%)' } : {}),
    ...(position === Position.Right ? { right: -4, top: '50%', transform: 'translateY(-50%)' } : {}),
    ...(position === Position.Bottom ? { bottom: -4, left: '50%', transform: 'translateX(-50%)' } : {}),
    ...(position === Position.Left ? { left: -4, top: '50%', transform: 'translateY(-50%)' } : {}),
  };

  return React.createElement('span', { className: `react-flow__handle react-flow__handle-${type} ${className}`, style: placement, ...props });
}

export function Background({ color = 'rgba(255,255,255,.16)', gap = 24, size = 1, variant = BackgroundVariant.Dots }) {
  const backgroundImage = variant === BackgroundVariant.Dots
    ? `radial-gradient(circle, ${color} ${size}px, transparent ${size + 0.5}px)`
    : `linear-gradient(to right, ${color} 1px, transparent 1px), linear-gradient(to bottom, ${color} 1px, transparent 1px)`;

  return React.createElement('div', {
    className: 'react-flow__background',
    style: {
      position: 'absolute',
      inset: 0,
      backgroundImage,
      backgroundSize: `${gap}px ${gap}px`,
      pointerEvents: 'none',
    },
  });
}

export function ReactFlow({
  nodes = [],
  edges = [],
  nodeTypes = {},
  children,
  className = '',
  fitView,
  fitViewOptions,
  minZoom,
  maxZoom,
  nodesDraggable,
  nodesConnectable,
  elementsSelectable,
  panOnDrag,
  zoomOnScroll,
  zoomOnPinch,
  zoomOnDoubleClick,
  preventScrolling,
  proOptions,
  ...props
}) {
  void nodesDraggable;
  void nodesConnectable;
  void elementsSelectable;
  void panOnDrag;
  void zoomOnScroll;
  void zoomOnPinch;
  void zoomOnDoubleClick;
  void preventScrolling;
  void proOptions;

  const [containerRef, rect] = useContainerRect();
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));
  const maxX = Math.max(360, ...nodes.map((node) => (node.position?.x ?? 0) + nodeWidth + 44));
  const maxY = Math.max(240, ...nodes.map((node) => (node.position?.y ?? 0) + nodeHeight + 44));
  const padding = fitViewOptions?.padding ?? 0.1;

  const viewport = useMemo(() => {
    if (!fitView) return { scale: 1, x: 0, y: 0 };

    const rawScale = Math.min(rect.width / maxX, rect.height / maxY) * (1 - padding);
    const lower = minZoom ?? 0.1;
    const upper = maxZoom ?? 1.5;
    const scale = Math.max(lower, Math.min(upper, rawScale));

    return {
      scale,
      x: Math.max(0, (rect.width - maxX * scale) / 2),
      y: Math.max(0, (rect.height - maxY * scale) / 2),
    };
  }, [fitView, fitViewOptions, maxX, maxY, minZoom, maxZoom, padding, rect.height, rect.width]);

  const viewportStyle = {
    width: maxX,
    height: maxY,
    transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.scale})`,
    transformOrigin: 'top left',
  };

  return React.createElement(
    'div',
    { ref: containerRef, className: `react-flow ${className}`.trim(), ...props },
    children,
    React.createElement(
      'div',
      { className: 'react-flow__viewport', style: viewportStyle },
      React.createElement(
        'svg',
        { className: 'react-flow__edges', viewBox: `0 0 ${maxX} ${maxY}`, preserveAspectRatio: 'none' },
        React.createElement(
          'defs',
          null,
          React.createElement('marker', { id: 'xyflow-arrow-cyan', markerWidth: 16, markerHeight: 16, refX: 14, refY: 8, orient: 'auto', markerUnits: 'userSpaceOnUse' },
            React.createElement('path', { d: 'M 2 2 L 14 8 L 2 14 z', fill: 'currentColor' })
          )
        ),
        edges.map((edge) => {
          const sourceNode = nodeMap.get(edge.source);
          const targetNode = nodeMap.get(edge.target);
          if (!sourceNode || !targetNode) return null;

          const source = anchor(sourceNode, sourceNode.data?.orientation === 'vertical' ? Position.Bottom : Position.Right);
          const target = anchor(targetNode, targetNode.data?.orientation === 'vertical' ? Position.Top : Position.Left);
          const style = edge.style ?? {};

          return React.createElement('g', { key: edge.id, className: `react-flow__edge ${edge.className ?? ''}`, style: { color: edge.markerEnd?.color ?? style.stroke } },
            React.createElement('path', {
              className: 'react-flow__edge-path',
              d: getEdgePath(source, target),
              fill: 'none',
              markerEnd: 'url(#xyflow-arrow-cyan)',
              style,
            })
          );
        })
      ),
      React.createElement(
        'div',
        { className: 'react-flow__nodes', style: { width: maxX, height: maxY } },
        nodes.map((node) => {
          const Component = nodeTypes[node.type] ?? (() => null);
          return React.createElement('div', {
            key: node.id,
            className: 'react-flow__node',
            style: { transform: `translate(${node.position?.x ?? 0}px, ${node.position?.y ?? 0}px)` },
          }, React.createElement(Component, { id: node.id, data: node.data, selected: false, type: node.type, dragging: false, zIndex: 0, isConnectable: false, xPos: node.position?.x ?? 0, yPos: node.position?.y ?? 0 }));
        })
      )
    )
  );
}
