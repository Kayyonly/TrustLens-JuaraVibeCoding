import type { CSSProperties, ReactNode } from 'react';

export declare const Position: {
  readonly Top: 'top';
  readonly Right: 'right';
  readonly Bottom: 'bottom';
  readonly Left: 'left';
};

export declare const MarkerType: {
  readonly Arrow: 'arrow';
  readonly ArrowClosed: 'arrowclosed';
};

export declare const BackgroundVariant: {
  readonly Lines: 'lines';
  readonly Dots: 'dots';
  readonly Cross: 'cross';
};

export type Node<Data = Record<string, unknown>, Type extends string | undefined = string | undefined> = {
  id: string;
  type?: Type;
  position: { x: number; y: number };
  data: Data;
  draggable?: boolean;
  selectable?: boolean;
};

export type Edge = {
  id: string;
  source: string;
  target: string;
  type?: string;
  animated?: boolean;
  className?: string;
  markerEnd?: { type?: string; color?: string; width?: number; height?: number };
  style?: CSSProperties;
};

export type NodeProps<TNode extends Node = Node> = {
  id: string;
  data: TNode['data'];
  selected?: boolean;
  type?: TNode['type'];
  dragging?: boolean;
  zIndex?: number;
  isConnectable?: boolean;
  xPos?: number;
  yPos?: number;
};

export declare function Handle(props: {
  className?: string;
  type: 'source' | 'target';
  position: typeof Position[keyof typeof Position];
  isConnectable?: boolean;
}): ReactNode;

export declare function Background(props: {
  color?: string;
  gap?: number;
  size?: number;
  variant?: typeof BackgroundVariant[keyof typeof BackgroundVariant];
}): ReactNode;

export declare function ReactFlow<TNode extends Node = Node>(props: {
  nodes?: TNode[];
  edges?: Edge[];
  nodeTypes?: Record<string, React.ComponentType<NodeProps<TNode>>>;
  children?: ReactNode;
  fitView?: boolean;
  fitViewOptions?: { padding?: number };
  minZoom?: number;
  maxZoom?: number;
  nodesDraggable?: boolean;
  nodesConnectable?: boolean;
  elementsSelectable?: boolean;
  panOnDrag?: boolean;
  zoomOnScroll?: boolean;
  zoomOnPinch?: boolean;
  zoomOnDoubleClick?: boolean;
  preventScrolling?: boolean;
  proOptions?: { hideAttribution?: boolean };
}): ReactNode;
