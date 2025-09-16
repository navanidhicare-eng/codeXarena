"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getRoadmapById, userProgress as initialUserProgress, Roadmap, RoadmapNode, NodeStatus, NodeType } from '@/lib/mock-roadmaps-data';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { RoadmapNodeComponent } from '@/components/RoadmapNode';

type GroupedNodes = {
  [key: string]: RoadmapNode[];
}

const getNodeStatus = (nodeId: string, progress: typeof initialUserProgress): NodeStatus => {
  return progress[nodeId]?.status || 'locked';
};

const Line = ({ fromNode, toNode, isCompleted }: { fromNode: RoadmapNode, toNode: RoadmapNode, isCompleted: boolean }) => {
  const fromX = fromNode.position_x + (fromNode.width || 10) / 2;
  const toX = toNode.position_x - (toNode.width || 10) / 2;
  
  return (
    <motion.line
      x1={`${fromNode.position_x + (fromNode.width || 15)}%`}
      y1={`${fromNode.position_y}%`}
      x2={`${toNode.position_x}%`}
      y2={`${toNode.position_y}%`}
      stroke={isCompleted ? "#3b82f6" : "#cbd5e1"}
      strokeWidth="2"
      strokeDasharray={isCompleted ? "0" : "4 4"}
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    />
  );
};

const DottedLine = ({ from, to }: { from: RoadmapNode, to: RoadmapNode }) => {
    const fromX = from.position_x;
    const fromY = from.position_y;
    const toX = to.position_x;
    const toY = to.position_y;
    
    // Mid-point for curve
    const midX = fromX + (toX - fromX) / 2;
    
    const path = `M ${from.position_x + (from.width || 10)} ${from.position_y} C ${midX} ${from.position_y}, ${midX} ${to.position_y}, ${to.position_x} ${to.position_y}`;

    return (
        <motion.path
            d={path}
            stroke="#3b82f6"
            strokeWidth="2"
            strokeDasharray="1 5"
            fill="transparent"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
        />
    );
};

export default function RoadmapViewPage({ params: { roadmapId } }: { params: { roadmapId: string } }) {
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [userProgress, setUserProgress] = useState(initialUserProgress);
  const [nodePositions, setNodePositions] = useState<{ [key: string]: RoadmapNode }>({});
  const [groupedNodes, setGroupedNodes] = useState<GroupedNodes>({});

  useEffect(() => {
    const fetchedRoadmap = getRoadmapById(roadmapId);
    if (fetchedRoadmap) {
      setRoadmap(fetchedRoadmap);
      
      const positions: { [key: string]: RoadmapNode } = {};
      const groups: GroupedNodes = {};
      
      fetchedRoadmap.nodes.forEach(node => {
        positions[node.id] = node;
        if (node.group_id) {
            if (!groups[node.group_id]) {
                groups[node.group_id] = [];
            }
            groups[node.group_id].push(node);
        }
      });
      
      setNodePositions(positions);
      setGroupedNodes(groups);

      const newProgress = { ...initialUserProgress };
      let changed = true;
      while (changed) {
        changed = false;
        fetchedRoadmap.nodes.forEach(node => {
          if (node.parent_node_id) {
            const parents = node.parent_node_id.split(',');
            const allParentsComplete = parents.every(pId => newProgress[pId]?.status === 'completed');
            if (allParentsComplete && !newProgress[node.id]) {
              newProgress[node.id] = { status: 'unlocked' };
              changed = true;
            }
          } else if (!newProgress[node.id]) {
            newProgress[node.id] = { status: 'unlocked' };
            changed = true;
          }
        });
      }
      setUserProgress(newProgress);

    } else {
      notFound();
    }
  }, [roadmapId]);


  const handleNodeClick = (node: RoadmapNode, status: NodeStatus) => {
    if (status === 'unlocked' || status === 'completed') {
        // In a real app, you might show MCQs here
        const newProgress = { ...userProgress };
        newProgress[node.id] = { status: 'completed' };

        roadmap?.nodes.forEach(childNode => {
            if (childNode.parent_node_id) {
                const parents = childNode.parent_node_id.split(',');
                const allParentsComplete = parents.every(pId => newProgress[pId]?.status === 'completed');
                if (allParentsComplete && newProgress[childNode.id]?.status !== 'completed') {
                    newProgress[childNode.id] = { status: 'unlocked' };
                }
            }
        });
        
        setUserProgress(newProgress);
    }
  }


  if (!roadmap) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading roadmap...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8 flex flex-col">
        <header className="flex items-center justify-between mb-8 flex-shrink-0">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                <h1 className="text-4xl font-bold text-gray-800">
                    {roadmap.title}
                </h1>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                <Button asChild variant="outline">
                    <Link href="/roadmaps">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to All Roadmaps
                    </Link>
                </Button>
            </motion.div>
        </header>
        
        <div className="flex-grow w-full border border-border rounded-lg bg-white relative overflow-auto p-8">
            <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
                <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
                    </marker>
                </defs>
                <AnimatePresence>
                    {roadmap.nodes.map(node => {
                        if (!node.parent_node_id) return null;
                        
                        const parents = node.parent_node_id.split(',');
                        return parents.map(parentId => {
                            const parent = nodePositions[parentId];
                            if (parent) {
                                const isParentCompleted = getNodeStatus(parentId, userProgress) === 'completed';
                                return <Line key={`${parent.id}-${node.id}`} fromNode={parent} toNode={node} isCompleted={isParentCompleted} />;
                            }
                            return null;
                        });
                    })}
                     {Object.keys(groupedNodes).map(groupId => {
                        const groupNodes = groupedNodes[groupId];
                        const parentId = groupNodes[0].parent_node_id;
                        if (!parentId) return null;
                        const parentNode = nodePositions[parentId];
                        if (!parentNode) return null;
                        
                        return groupNodes.map(node => (
                             <DottedLine key={`${parentNode.id}-${node.id}`} from={node} to={parentNode} />
                        ))
                    })}
                     {/* Connect grouped nodes to their core concept */}
                     <DottedLine from={nodePositions['dsa-lang-syntax']} to={nodePositions['dsa-fundamentals']} />
                     <DottedLine from={nodePositions['dsa-control-structures']} to={nodePositions['dsa-fundamentals']} />
                     <DottedLine from={nodePositions['dsa-pseudo-code']} to={nodePositions['dsa-fundamentals']} />
                     <DottedLine from={nodePositions['dsa-functions']} to={nodePositions['dsa-fundamentals']} />
                     <DottedLine from={nodePositions['dsa-oop-basics']} to={nodePositions['dsa-fundamentals']} />

                </AnimatePresence>
            </svg>

            <AnimatePresence>
                {roadmap.nodes.map((node, index) => {
                    const status = getNodeStatus(node.id, userProgress);
                    return (
                        <RoadmapNodeComponent 
                            key={node.id} 
                            node={node} 
                            status={status} 
                            onClick={handleNodeClick}
                            index={index}
                        />
                    );
                })}
            </AnimatePresence>
        </div>
    </div>
  );
}
