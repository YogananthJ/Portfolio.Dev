import React, { useState, useRef, useId } from 'react';
import { ARCHITECTURE_DATA } from '../data/architectureData';
import { ArchitectureNode, ArchitectureNodeType } from '../types/architecture';
import { 
  Cpu, 
  Server, 
  Globe, 
  Database, 
  Key, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Layers, 
  List, 
  Network, 
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';

interface Props {
  initialProjectId?: string;
}

export const ArchitectureExplorer: React.FC<Props> = ({ initialProjectId = 'cognitive-ai' }) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    ARCHITECTURE_DATA[initialProjectId] ? initialProjectId : Object.keys(ARCHITECTURE_DATA)[0]
  );
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [viewMode, setViewMode] = useState<'canvas' | 'structured'>('canvas');

  const canvasRef = useRef<HTMLDivElement>(null);
  const arrowMarkerId = useId();

  const currentArch = ARCHITECTURE_DATA[selectedProjectId] || ARCHITECTURE_DATA['cognitive-ai'];
  const selectedNode = currentArch.nodes.find(n => n.id === selectedNodeId) || currentArch.nodes[0];

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag on canvas background
    if ((e.target as HTMLElement).tagName.toLowerCase() === 'svg' || (e.target as HTMLElement).classList.contains('canvas-drag-surface')) {
      setIsPanning(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.15, 1.8));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.15, 0.6));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const getNodeIcon = (type: ArchitectureNodeType) => {
    switch (type) {
      case 'frontend':
        return <Globe className="w-3.5 h-3.5 text-blue-500" />;
      case 'backend':
        return <Server className="w-3.5 h-3.5 text-amber-500" />;
      case 'ai-model':
        return <Cpu className="w-3.5 h-3.5 text-purple-500" />;
      case 'api':
        return <Key className="w-3.5 h-3.5 text-emerald-500" />;
      case 'storage':
        return <Database className="w-3.5 h-3.5 text-cyan-500" />;
    }
  };

  const getNodeBadgeClass = (type: ArchitectureNodeType) => {
    switch (type) {
      case 'frontend':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30';
      case 'backend':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30';
      case 'ai-model':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30';
      case 'api':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
      case 'storage':
        return 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30';
    }
  };

  return (
    <section id="architecture" className="py-20 border-t border-[var(--border-color)] bg-[var(--bg-canvas)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 text-xs font-mono font-semibold uppercase tracking-wider bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/30 rounded-none mb-3">
              <Network className="w-3.5 h-3.5" />
              Interactive System Schematics
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[var(--text-main)] uppercase">
              Architecture Explorer
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-muted)] max-w-2xl mt-1">
              Visual node-and-edge diagrams dissecting data pipelines, external integrations, model inference layers, and storage boundaries.
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 self-start md:self-auto bg-[var(--bg-surface)] p-1 border border-[var(--border-color)]">
            <button
              onClick={() => setViewMode('canvas')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold transition-colors ${
                viewMode === 'canvas'
                  ? 'bg-[var(--accent)] text-white'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              Diagram Canvas
            </button>
            <button
              onClick={() => setViewMode('structured')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold transition-colors ${
                viewMode === 'structured'
                  ? 'bg-[var(--accent)] text-white'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              Structured List
            </button>
          </div>
        </div>

        {/* Project Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-thin">
          {Object.entries(ARCHITECTURE_DATA).map(([key, arch]) => (
            <button
              key={key}
              onClick={() => {
                setSelectedProjectId(key);
                setSelectedNodeId(null);
              }}
              className={`px-3.5 py-2 text-xs font-mono whitespace-nowrap font-bold border transition-all ${
                selectedProjectId === key
                  ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-sm'
                  : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-color)] hover:border-[var(--text-main)]'
              }`}
            >
              {arch.projectTitle}
            </button>
          ))}
        </div>

        {/* Main Explorer Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Canvas or Structured View (Cols 1-8) */}
          <div className="lg:col-span-8 bg-[var(--bg-card)] border border-[var(--border-color)] overflow-hidden relative shadow-sm">
            
            {/* Top Toolbar */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--border-color)] bg-[var(--bg-surface)] text-xs font-mono">
              <div className="flex items-center gap-2 text-[var(--text-muted)]">
                <span className="font-bold text-[var(--text-main)] uppercase">{currentArch.projectTitle}</span>
                <span className="text-[var(--border-color)]">/</span>
                <span>{currentArch.nodes.length} Nodes</span>
                <span className="text-[var(--border-color)]">/</span>
                <span>{currentArch.edges.length} Data Flows</span>
              </div>

              {viewMode === 'canvas' && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleZoomIn}
                    title="Zoom In"
                    className="p-1.5 hover:bg-[var(--bg-canvas)] border border-transparent hover:border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)]"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleZoomOut}
                    title="Zoom Out"
                    className="p-1.5 hover:bg-[var(--bg-canvas)] border border-transparent hover:border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)]"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleReset}
                    title="Reset View"
                    className="p-1.5 hover:bg-[var(--bg-canvas)] border border-transparent hover:border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)]"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <span className="ml-1 text-[10px] text-[var(--text-muted)]">{Math.round(zoom * 100)}%</span>
                </div>
              )}
            </div>

            {/* View Mode Canvas */}
            {viewMode === 'canvas' ? (
              <div
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className="canvas-drag-surface relative h-[480px] w-full overflow-hidden bg-[var(--bg-canvas)] cursor-grab active:cursor-grabbing select-none"
                style={{
                  backgroundImage: 'radial-gradient(circle, var(--border-color) 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }}
              >
                {/* Transform Layer */}
                <div
                  className="absolute inset-0 transition-transform duration-75 origin-top-left"
                  style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  }}
                >
                  {/* SVG Edges Layer */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ minWidth: 800, minHeight: 480 }}>
                    <defs>
                      <marker
                        id={arrowMarkerId}
                        viewBox="0 0 10 10"
                        refX="8"
                        refY="5"
                        markerWidth="6"
                        markerHeight="6"
                        orient="auto-start-reverse"
                      >
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--text-muted)" opacity="0.6" />
                      </marker>
                    </defs>

                    {currentArch.edges.map((edge, idx) => {
                      const fromNode = currentArch.nodes.find(n => n.id === edge.from);
                      const toNode = currentArch.nodes.find(n => n.id === edge.to);
                      if (!fromNode || !toNode) return null;

                      // Map percentages to canvas space (based on standard 800x440)
                      const x1 = (fromNode.x / 100) * 780 + 40;
                      const y1 = (fromNode.y / 100) * 380 + 40;
                      const x2 = (toNode.x / 100) * 780 + 40;
                      const y2 = (toNode.y / 100) * 380 + 40;

                      const isConnectedToSelected = selectedNodeId && (edge.from === selectedNodeId || edge.to === selectedNodeId);
                      const dx = x2 - x1;
                      const dy = y2 - y1;
                      const cx1 = x1 + dx * 0.5;
                      const cy1 = y1;
                      const cx2 = x1 + dx * 0.5;
                      const cy2 = y2;

                      return (
                        <g key={`${edge.from}-${edge.to}-${idx}`}>
                          <path
                            d={`M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`}
                            fill="none"
                            stroke={isConnectedToSelected ? 'var(--accent)' : 'var(--border-color)'}
                            strokeWidth={isConnectedToSelected ? '2.5' : '1.5'}
                            strokeDasharray={isConnectedToSelected ? 'none' : '4 4'}
                            markerEnd={`url(#${arrowMarkerId})`}
                            className="transition-colors duration-200"
                          />
                          {edge.label && (
                            <text
                              x={(x1 + x2) / 2}
                              y={(y1 + y2) / 2 - 8}
                              fill="var(--text-muted)"
                              fontSize="10"
                              fontFamily="monospace"
                              textAnchor="middle"
                              className="pointer-events-none select-none bg-[var(--bg-surface)] px-1"
                            >
                              {edge.label}
                            </text>
                          )}
                        </g>
                      );
                    })}
                  </svg>

                  {/* HTML Node Components Layer */}
                  {currentArch.nodes.map(node => {
                    const isSelected = selectedNode?.id === node.id;
                    return (
                      <div
                        key={node.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedNodeId(node.id);
                        }}
                        style={{
                          left: `${node.x}%`,
                          top: `${node.y}%`,
                          transform: 'translate(-50%, -50%)',
                        }}
                        className={`absolute cursor-pointer w-44 p-3 border transition-all duration-150 ${
                          isSelected
                            ? 'bg-[var(--bg-surface)] border-[var(--accent)] shadow-md ring-2 ring-[var(--accent)]/30 z-20 scale-105'
                            : 'bg-[var(--bg-card)] border-[var(--border-color)] hover:border-[var(--text-main)] hover:shadow-sm z-10'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-mono uppercase font-bold border ${getNodeBadgeClass(node.type)}`}>
                            {getNodeIcon(node.type)}
                            {node.type}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-[var(--text-main)] line-clamp-1">
                          {node.label}
                        </h4>
                        <p className="text-[10px] text-[var(--text-muted)] font-mono line-clamp-1 mt-0.5">
                          {node.subtitle}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Canvas Floating Legend */}
                <div className="absolute bottom-3 left-3 flex flex-wrap gap-2 p-2 bg-[var(--bg-surface)]/90 backdrop-blur-sm border border-[var(--border-color)] text-[10px] font-mono z-20">
                  <span className="flex items-center gap-1 text-[var(--text-muted)]">
                    <Globe className="w-3 h-3 text-blue-500" /> UI
                  </span>
                  <span className="flex items-center gap-1 text-[var(--text-muted)]">
                    <Server className="w-3 h-3 text-amber-500" /> Backend
                  </span>
                  <span className="flex items-center gap-1 text-[var(--text-muted)]">
                    <Cpu className="w-3 h-3 text-purple-500" /> AI/Model
                  </span>
                  <span className="flex items-center gap-1 text-[var(--text-muted)]">
                    <Key className="w-3 h-3 text-emerald-500" /> External
                  </span>
                  <span className="flex items-center gap-1 text-[var(--text-muted)]">
                    <Database className="w-3 h-3 text-cyan-500" /> Storage
                  </span>
                </div>
              </div>
            ) : (
              /* Structured List View */
              <div className="p-6 space-y-4 max-h-[480px] overflow-y-auto">
                <div className="text-xs font-mono text-[var(--text-muted)] mb-2">
                  Sequential component breakdown of the system pipeline:
                </div>
                {currentArch.nodes.map((node, i) => (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`p-4 border cursor-pointer transition-colors ${
                      selectedNode?.id === node.id
                        ? 'border-[var(--accent)] bg-[var(--bg-surface)]'
                        : 'border-[var(--border-color)] hover:border-[var(--text-main)] bg-[var(--bg-card)]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[var(--text-muted)]">0{i + 1}.</span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-bold border ${getNodeBadgeClass(node.type)}`}>
                          {getNodeIcon(node.type)}
                          {node.type}
                        </span>
                        <h4 className="text-sm font-bold text-[var(--text-main)]">{node.label}</h4>
                      </div>
                      <span className="text-xs font-mono text-[var(--text-muted)]">{node.subtitle}</span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] mb-3">{node.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {node.technologies.map(t => (
                        <span key={t} className="text-[10px] font-mono px-2 py-0.5 bg-[var(--bg-canvas)] border border-[var(--border-color)] text-[var(--text-muted)]">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Bottom Architecture Narrative */}
            <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-surface)]">
              <div className="flex items-start gap-2.5">
                <Info className="w-4 h-4 text-[var(--accent)] mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs font-mono font-bold uppercase text-[var(--text-main)] mb-1">
                    System Architecture Workflow
                  </div>
                  <ul className="text-xs text-[var(--text-muted)] space-y-1">
                    {currentArch.textExplanation.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="font-mono text-[var(--accent)] shrink-0">{idx + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Node Inspector Details Panel (Cols 9-12) */}
          <div className="lg:col-span-4 bg-[var(--bg-card)] border border-[var(--border-color)] p-6 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)] mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] font-semibold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[var(--accent)]" />
                Component Inspector
              </span>
              {selectedNode && (
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono uppercase font-bold border ${getNodeBadgeClass(selectedNode.type)}`}>
                  {getNodeIcon(selectedNode.type)}
                  {selectedNode.type}
                </span>
              )}
            </div>

            {selectedNode ? (
              <div className="space-y-5">
                <div>
                  <h3 className="text-base font-bold text-[var(--text-main)]">
                    {selectedNode.label}
                  </h3>
                  <div className="text-xs font-mono text-[var(--text-muted)] mt-0.5">
                    {selectedNode.subtitle}
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mt-2 leading-relaxed">
                    {selectedNode.description}
                  </p>
                </div>

                {/* Technologies */}
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)] font-bold mb-2">
                    Technologies & Libraries
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedNode.technologies.map(tech => (
                      <span
                        key={tech}
                        className="px-2 py-1 text-xs font-mono bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-main)]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Responsibilities */}
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)] font-bold mb-2">
                    Key Responsibilities
                  </label>
                  <ul className="space-y-1.5">
                    {selectedNode.responsibilities.map((resp, i) => (
                      <li key={i} className="text-xs text-[var(--text-muted)] flex items-start gap-2">
                        <ArrowRight className="w-3 h-3 text-[var(--accent)] shrink-0 mt-0.5" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Inputs & Outputs */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[var(--border-color)]">
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold mb-1">
                      Data Inputs
                    </label>
                    <ul className="text-[11px] font-mono text-[var(--text-muted)] space-y-1">
                      {selectedNode.inputs.map((inp, i) => (
                        <li key={i} className="truncate" title={inp}>
                          • {inp}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 font-bold mb-1">
                      Data Outputs
                    </label>
                    <ul className="text-[11px] font-mono text-[var(--text-muted)] space-y-1">
                      {selectedNode.outputs.map((outp, i) => (
                        <li key={i} className="truncate" title={outp}>
                          • {outp}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

              </div>
            ) : (
              <div className="text-center py-12 text-xs font-mono text-[var(--text-muted)]">
                Click any node in the schematic to inspect component specifications.
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
