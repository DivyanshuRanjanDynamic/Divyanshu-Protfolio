import { useState, useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiServer, FiDatabase, FiCode, FiLayout, FiTool, FiCpu,
  FiTerminal, FiLayers, FiBox, FiGlobe, FiCloud, FiCheckCircle,
  FiZap, FiLock, FiKey, FiShare2, FiActivity, FiSettings, FiMaximize
} from 'react-icons/fi';
import SectionWrapper from '../components/SectionWrapper';
import profile from '../data/profile';

// Types
interface SkillNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  category: string;
  level: number;
  exp: string;
  shortCode: string;
  color: string;
  angle: number;
  iconKey: string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface SkillLink extends d3.SimulationLinkDatum<SkillNode> {
  source: string | SkillNode;
  target: string | SkillNode;
  color: string;
}

// 7 Categories matching the exact user specification
const CATEGORIES: Record<string, { color: string; angle: number; label: string }> = {
  'Backend': { color: '#10b981', angle: -50, label: 'BACKEND' },       // Top (emerald)
  'Languages': { color: '#3b82f6', angle: -5, label: 'LANGUAGES' },     // Top-Right (blue)
  'Frontend': { color: '#06b6d4', angle: 30, label: 'FRONTEND' },      // Right (cyan)
  'Databases': { color: '#eab308', angle: 75, label: 'DATABASES' },     // Bottom-Right (yellow)
  'Messaging': { color: '#f97316', angle: 118, label: 'MESSAGING' },     // Bottom-Left (orange)
  'DevOps': { color: '#8b5cf6', angle: 170, label: 'DEVOPS' },        // Left (purple)
  'Concepts': { color: '#ec4899', angle: 230, label: 'CONCEPTS' },      // Top-Left (pink)
};

// Map icon keys to React components
const ICON_COMPONENTS: Record<string, any> = {
  Server: FiServer,
  Database: FiDatabase,
  Code: FiCode,
  Layout: FiLayout,
  Tool: FiTool,
  Cpu: FiCpu,
  Terminal: FiTerminal,
  Layers: FiLayers,
  Box: FiBox,
  Globe: FiGlobe,
  Cloud: FiCloud,
  Zap: FiZap,
  Lock: FiLock,
  Key: FiKey,
  Share: FiShare2,
  Activity: FiActivity,
  Settings: FiSettings,
  Maximize: FiMaximize,
};

// Comprehensive Skill Metadata Map
const SKILL_METADATA: Record<string, { level: number; exp: string; code: string; iconKey: string }> = {
  // Languages
  'Java': { level: 88, exp: '2+ yrs', code: 'Java', iconKey: 'Code' },
  'Python': { level: 90, exp: '2+ yrs', code: 'Py', iconKey: 'Code' },
  'JavaScript': { level: 92, exp: '2+ yrs', code: 'JS', iconKey: 'Code' },
  'TypeScript': { level: 85, exp: '1.5 yrs', code: 'TS', iconKey: 'Code' },

  // Backend
  'Node.js': { level: 88, exp: '2+ yrs', code: 'Node', iconKey: 'Server' },
  'Express.js': { level: 85, exp: '1.5 yrs', code: 'Exp', iconKey: 'Server' },
  'REST APIs': { level: 92, exp: '2+ yrs', code: 'API', iconKey: 'Globe' },
  'WebSockets': { level: 85, exp: '1+ yrs', code: 'WS', iconKey: 'Activity' },
  'WebRTC': { level: 80, exp: '1+ yrs', code: 'RTC', iconKey: 'Share' },
  'gRPC': { level: 78, exp: '1+ yrs', code: 'gRPC', iconKey: 'Zap' },
  'JWT': { level: 90, exp: '2+ yrs', code: 'JWT', iconKey: 'Lock' },
  'OAuth 2.0': { level: 85, exp: '1.5 yrs', code: 'OAuth', iconKey: 'Key' },

  // Databases
  'PostgreSQL': { level: 88, exp: '1.5 yrs', code: 'PG', iconKey: 'Database' },
  'MongoDB': { level: 88, exp: '1.5 yrs', code: 'Mongo', iconKey: 'Database' },
  'Redis': { level: 85, exp: '1+ yrs', code: 'Redis', iconKey: 'Zap' },
  'Prisma ORM': { level: 82, exp: '1+ yrs', code: 'Prisma', iconKey: 'Database' },

  // Messaging
  'Apache Kafka': { level: 82, exp: '1+ yrs', code: 'Kafka', iconKey: 'Layers' },
  'RabbitMQ': { level: 80, exp: '1+ yrs', code: 'Rabbit', iconKey: 'Layers' },
  'Event-Driven Architecture': { level: 85, exp: '1.5 yrs', code: 'EDA', iconKey: 'Zap' },

  // DevOps
  'Docker': { level: 85, exp: '1.5 yrs', code: 'Doc', iconKey: 'Box' },
  'Kubernetes': { level: 78, exp: '1+ yrs', code: 'K8s', iconKey: 'Layers' },
  'AWS (EC2, S3)': { level: 82, exp: '1+ yrs', code: 'AWS', iconKey: 'Cloud' },
  'GitHub Actions': { level: 85, exp: '1+ yrs', code: 'GHA', iconKey: 'Settings' },
  'CI/CD': { level: 85, exp: '1.5 yrs', code: 'CICD', iconKey: 'Tool' },
  'Nginx': { level: 80, exp: '1+ yrs', code: 'Nginx', iconKey: 'Server' },
  'Linux': { level: 88, exp: '2+ yrs', code: 'Linux', iconKey: 'Terminal' },

  // Frontend
  'React.js': { level: 92, exp: '2+ yrs', code: 'React', iconKey: 'Layout' },
  'Next.js': { level: 85, exp: '1.5 yrs', code: 'Next', iconKey: 'Layout' },

  // Concepts
  'Distributed Systems': { level: 82, exp: '1+ yrs', code: 'DistSys', iconKey: 'Share' },
  'System Design': { level: 85, exp: '1.5 yrs', code: 'SysDes', iconKey: 'Terminal' },
  'High-Concurrency API Design': { level: 84, exp: '1+ yrs', code: 'HighCon', iconKey: 'Zap' },
  'WebAssembly': { level: 78, exp: '1+ yrs', code: 'Wasm', iconKey: 'Cpu' },
  'OOP': { level: 90, exp: '2+ yrs', code: 'OOP', iconKey: 'Cpu' },
};

// Pointy-topped Hexagon SVG Polygon points generator
const getHexPolygonPoints = (radius: number) => {
  const points: [number, number][] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    points.push([radius * Math.cos(angle), radius * Math.sin(angle)]);
  }
  return points.map(p => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
};

export default function Skills() {
  const [hoveredNode, setHoveredNode] = useState<SkillNode | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [computedNodes, setComputedNodes] = useState<SkillNode[]>([]);
  const [computedLinks, setComputedLinks] = useState<SkillLink[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize D3 Force Simulation
  useEffect(() => {
    const rawNodes: SkillNode[] = [];
    const rawLinks: SkillLink[] = [];

    // 1. Center Hub Node
    const centerNode: SkillNode = {
      id: 'CENTER',
      name: 'Divyanshu Ranjan',
      category: 'CENTER',
      level: 100,
      exp: 'Core',
      shortCode: 'DR',
      color: '#0E7490',
      angle: 0,
      iconKey: 'Cpu',
      fx: 0,
      fy: 0,
    };
    rawNodes.push(centerNode);

    // 2. Build Skill Nodes for all 7 Categories
    Object.entries(profile.skills).forEach(([category, skillNames]) => {
      const catConfig = CATEGORIES[category] || { color: '#94a3b8', angle: 0 };
      const baseAngleRad = (catConfig.angle * Math.PI) / 180;

      skillNames.forEach((skillName, idx) => {
        const meta = SKILL_METADATA[skillName] || {
          level: 80, exp: '1+ yr', code: skillName.slice(0, 5), iconKey: 'Code'
        };

        // Radial placement in concentric rings
        const ring = Math.floor(idx / 3) + 1;
        const offsetAngle = (idx % 3 - 1) * 0.22;
        const spreadAngle = baseAngleRad + offsetAngle;
        const initialR = 160 + ring * 100;

        const node: SkillNode = {
          id: skillName,
          name: skillName,
          category,
          level: meta.level,
          exp: meta.exp,
          shortCode: meta.code,
          color: catConfig.color,
          angle: catConfig.angle,
          iconKey: meta.iconKey,
          x: Math.cos(spreadAngle) * initialR,
          y: Math.sin(spreadAngle) * initialR,
        };
        rawNodes.push(node);
      });
    });

    // 3. Build Links between nodes
    Object.keys(CATEGORIES).forEach(category => {
      const catNodes = rawNodes.filter(n => n.category === category);
      if (catNodes.length > 0) {
        // Link center to primary root node of category
        rawLinks.push({
          source: 'CENTER',
          target: catNodes[0].id,
          color: CATEGORIES[category].color,
        });

        // Link intra-category nodes sequentially and pairwise
        for (let i = 0; i < catNodes.length - 1; i++) {
          rawLinks.push({
            source: catNodes[i].id,
            target: catNodes[i + 1].id,
            color: CATEGORIES[category].color,
          });
        }
        if (catNodes.length > 3) {
          rawLinks.push({
            source: catNodes[0].id,
            target: catNodes[2].id,
            color: CATEGORIES[category].color,
          });
        }
        if (catNodes.length > 5) {
          rawLinks.push({
            source: catNodes[2].id,
            target: catNodes[5].id,
            color: CATEGORIES[category].color,
          });
        }
      }
    });

    // 4. D3 Force Simulation setup
    const simulation = d3.forceSimulation<SkillNode>(rawNodes)
      .force('charge', d3.forceManyBody().strength(-400))
      .force('collide', d3.forceCollide<SkillNode>().radius(55).iterations(5))
      .force('radial', d3.forceRadial<SkillNode>(
        (d) => d.id === 'CENTER' ? 0 : 300,
        0,
        0
      ).strength(0.35))
      .force('link', d3.forceLink<SkillNode, SkillLink>(rawLinks)
        .id((d) => d.id)
        .distance(110)
        .strength(0.4)
      )
      .stop();

    // Warmup simulation ticks for immediate static precision
    for (let i = 0; i < 350; ++i) simulation.tick();

    setComputedNodes(rawNodes);
    setComputedLinks(rawLinks);
  }, []);

  const HEX_RADIUS = 35;
  const hexPoints = useMemo(() => getHexPolygonPoints(HEX_RADIUS), []);
  const centerHexPoints = useMemo(() => getHexPolygonPoints(46), []);

  const totalSkillCount = useMemo(() => {
    return Object.values(profile.skills).reduce((sum, list) => sum + list.length, 0);
  }, []);

  return (
    <SectionWrapper id="skills" className="relative pb-40">

      {/* Header */}
      <div className="text-center mb-16 relative z-10">
        <div className="hud-text mb-4 opacity-50">[ BLUEPRINT_MAP ]</div>
        <h2 className="section-heading text-slate-900 dark:text-slate-100 mb-2">
          Technical Constellation Mapping
        </h2>
        <p className="hud-text lowercase tracking-widest text-slate-500">
          METRIC: {totalSkillCount} NODES · AVG 85% LEVEL · 7 CATEGORIES
        </p>
      </div>

      {/* Interactive Constellation Container */}
      <div
        ref={containerRef}
        className="relative w-full h-[850px] sm:h-[1050px] flex items-center justify-center overflow-hidden sm:overflow-visible select-none"
      >
        <svg
          className="w-full h-full overflow-visible"
          viewBox="-700 -550 1400 1100"
        >
          <defs>
            {/* Glow Filter for Hover State */}
            <filter id="hex-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* D3 Connection Links */}
          <g className="links opacity-30 dark:opacity-50">
            {computedLinks.map((link, i) => {
              const sourceNode = typeof link.source === 'object' ? link.source as SkillNode : computedNodes.find(n => n.id === link.source);
              const targetNode = typeof link.target === 'object' ? link.target as SkillNode : computedNodes.find(n => n.id === link.target);

              if (!sourceNode || !targetNode) return null;

              const isDimmed = selectedCategory && sourceNode.category !== selectedCategory && targetNode.category !== selectedCategory;

              return (
                <line
                  key={`link-${i}`}
                  x1={sourceNode.x}
                  y1={sourceNode.y}
                  x2={targetNode.x}
                  y2={targetNode.y}
                  stroke={sourceNode.color || link.color}
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  className={`transition-opacity duration-300 ${isDimmed ? 'opacity-10' : 'opacity-100'}`}
                />
              );
            })}
          </g>

          {/* D3 Skill Nodes */}
          <g className="nodes">
            {computedNodes.map((node) => {
              if (node.id === 'CENTER') {
                return (
                  <g
                    key="node-center"
                    transform="translate(0,0)"
                    className="cursor-pointer group"
                  >
                    {/* Center Hexagon */}
                    <polygon
                      points={centerHexPoints}
                      fill="#0E7490"
                      stroke="#06b6d4"
                      strokeWidth="3"
                      className="drop-shadow-lg"
                    />
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="font-serif font-bold text-2xl italic fill-white"
                    >
                      DR
                    </text>
                  </g>
                );
              }

              const IconComp = ICON_COMPONENTS[node.iconKey] || FiCode;
              const isHovered = hoveredNode?.id === node.id;
              const isCategorySelected = selectedCategory === node.category;
              const isDimmed = (selectedCategory && !isCategorySelected) || (hoveredNode && hoveredNode.category !== node.category && !isHovered);

              return (
                <g
                  key={`node-${node.id}`}
                  transform={`translate(${node.x || 0}, ${node.y || 0})`}
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                  className={`cursor-pointer transition-all duration-300 ${isDimmed ? 'opacity-25' : 'opacity-100'}`}
                >
                  {/* Outer Glow on Hover */}
                  {isHovered && (
                    <polygon
                      points={hexPoints}
                      fill="none"
                      stroke={node.color}
                      strokeWidth="6"
                      filter="url(#hex-glow)"
                      className="opacity-70"
                    />
                  )}

                  {/* Hexagon Body */}
                  <polygon
                    points={hexPoints}
                    className="fill-white dark:fill-[#0A0D0F] transition-colors duration-300"
                    stroke={node.color}
                    strokeWidth={isHovered || isCategorySelected ? "3" : "1.75"}
                  />

                  {/* Node Content */}
                  <foreignObject
                    x={-HEX_RADIUS}
                    y={-HEX_RADIUS}
                    width={HEX_RADIUS * 2}
                    height={HEX_RADIUS * 2}
                    className="pointer-events-none"
                  >
                    <div className="w-full h-full flex flex-col items-center justify-center p-1 text-center select-none">
                      <IconComp
                        size={14}
                        style={{ color: node.color }}
                        className="mb-0.5"
                      />
                      <span
                        className="text-[8px] font-mono font-bold leading-tight line-clamp-2 px-0.5"
                        style={{ color: node.color }}
                      >
                        {node.shortCode || node.name}
                      </span>
                      <span className="text-[6.5px] font-mono opacity-40 hud-text mt-0.5">
                        LVL
                      </span>
                    </div>
                  </foreignObject>
                </g>
              );
            })}
          </g>

          {/* D3 Category Radial Labels */}
          {Object.entries(CATEGORIES).map(([catKey, catConfig]) => {
            const rad = (catConfig.angle * Math.PI) / 180;
            const dist = 450;
            const lx = Math.cos(rad) * dist;
            const ly = Math.sin(rad) * dist;

            const isSelected = selectedCategory === catKey;

            return (
              <g
                key={`cat-${catKey}`}
                transform={`translate(${lx}, ${ly})`}
                className="cursor-pointer group"
                onClick={() => setSelectedCategory(prev => prev === catKey ? null : catKey)}
                onMouseEnter={() => setSelectedCategory(catKey)}
                onMouseLeave={() => setSelectedCategory(null)}
              >
                <rect
                  x="-75"
                  y="-14"
                  width="150"
                  height="28"
                  rx="4"
                  fill="transparent"
                />
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="font-mono text-xs font-bold tracking-widest uppercase transition-all duration-200"
                  fill={catConfig.color}
                  opacity={isSelected ? 1 : 0.65}
                  style={{
                    fontSize: isSelected ? '13px' : '11px',
                    fontWeight: isSelected ? '800' : '600'
                  }}
                >
                  {catConfig.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hovered Skill Detail Floating HUD Tooltip Card */}
        <AnimatePresence>
          {hoveredNode && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ duration: 0.15 }}
              className="absolute z-50 pointer-events-none w-64 glass p-4 rounded-sm border shadow-2xl"
              style={{
                left: `calc(50% + ${(hoveredNode.x || 0) + (hoveredNode.x && hoveredNode.x > 0 ? -280 : 30)}px)`,
                top: `calc(50% + ${(hoveredNode.y || 0) - 60}px)`,
                borderColor: hoveredNode.color,
              }}
            >
              <div className="flex items-center justify-between border-b pb-2 mb-3 border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: hoveredNode.color }}
                  />
                  <h4 className="font-serif font-bold text-base text-slate-900 dark:text-slate-100">
                    {hoveredNode.name}
                  </h4>
                </div>
                <span className="hud-text text-[9px]" style={{ color: hoveredNode.color }}>
                  {hoveredNode.category}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono text-slate-600 dark:text-slate-400">
                  <span>PROFICIENCY</span>
                  <span className="font-bold">{hoveredNode.level}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-500 rounded-full"
                    style={{
                      width: `${hoveredNode.level}%`,
                      backgroundColor: hoveredNode.color
                    }}
                  />
                </div>
              </div>

              {/* Extra Info */}
              <div className="mt-3 pt-2 flex justify-between items-center text-[10px] font-mono text-slate-500 border-t border-slate-200/60 dark:border-slate-800/60">
                <span className="flex items-center gap-1">
                  <FiCheckCircle size={10} style={{ color: hoveredNode.color }} />
                  EXPERIENCE
                </span>
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {hoveredNode.exp}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Category Legend Filter Bar at Bottom */}
      <div className="flex flex-wrap justify-center items-center gap-2.5 mt-6 max-w-5xl mx-auto px-4 relative z-10">
        {Object.entries(CATEGORIES).map(([catKey, catConfig]) => {
          const isSelected = selectedCategory === catKey;
          return (
            <button
              key={`legend-${catKey}`}
              onClick={() => setSelectedCategory(prev => prev === catKey ? null : catKey)}
              onMouseEnter={() => setSelectedCategory(catKey)}
              onMouseLeave={() => setSelectedCategory(null)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all text-xs font-mono uppercase tracking-wider"
              style={{
                borderColor: catConfig.color,
                backgroundColor: isSelected ? `${catConfig.color}20` : 'transparent',
                color: catConfig.color,
                opacity: selectedCategory && !isSelected ? 0.4 : 1,
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: catConfig.color }}
              />
              {catConfig.label}
            </button>
          );
        })}
      </div>

    </SectionWrapper>
  );
}
