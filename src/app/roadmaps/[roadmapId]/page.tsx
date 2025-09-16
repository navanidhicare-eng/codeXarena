"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getRoadmapById, userProgress as initialUserProgress, Roadmap, RoadmapNode, NodeStatus, NodeType } from '@/lib/mock-roadmaps-data';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { RoadmapNodeComponent } from '@/components/RoadmapNode';

const Line = ({ fromNode, toNode, isCompleted }: { fromNode: RoadmapNode, toNode: RoadmapNode, isCompleted: boolean }) => {
  return (
    <motion.line
      x1={`${fromNode.position_x}%`}
      y1={`${fromNode.position_y}%`}
      x2={`${toNode.position_x}%`}
      y2={`${toNode.position_y}%`}
      stroke={isCompleted ? "hsl(var(--primary))" : "#4A5568"}
      strokeWidth="2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    />
  );
};

export default function RoadmapViewPage() {
  const params = useParams();
  const roadmapId = Array.isArray(params.roadmapId) ? params.roadmapId[0] : params.roadmapId;
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [userProgress, setUserProgress] = useState(initialUserProgress);
  const [nodePositions, setNodePositions] = useState<{ [key: string]: RoadmapNode }>({});
  
  useEffect(() => {
    if (!roadmapId) return;
    const fetchedRoadmap = getRoadmapById(roadmapId);
    if (fetchedRoadmap) {
      setRoadmap(fetchedRoadmap);
      
      const positions: { [key: string]: RoadmapNode } = {};
      fetchedRoadmap.nodes.forEach(node => {
        positions[node.id] = node;
      });
      setNodePositions(positions);

      // Initialize progress based on dependencies
      const newProgress = { ...initialUserProgress };
      let changed = true;
      while (changed) {
        changed = false;
        fetchedRoadmap.nodes.forEach(node => {
          if (newProgress[node.id]?.status === 'completed') return;

          if (node.parent_node_id) {
            const parents = node.parent_node_id.split(',').map(p => p.trim());
            const allParentsComplete = parents.every(pId => newProgress[pId]?.status === 'completed');
            
            if (allParentsComplete && (!newProgress[node.id] || newProgress[node.id].status === 'locked')) {
              newProgress[node.id] = { status: 'unlocked' };
              changed = true;
            }
          } else if (!newProgress[node.id]) { // Root nodes
            newProgress[node.id] = { status: 'unlocked' };
            changed = true;
          }
        });
      }
      setUserProgress(newProgress);
    }
  }, [roadmapId]);

  const getNodeStatus = (nodeId: string): NodeStatus => {
    return userProgress[nodeId]?.status || 'locked';
  };

  const handleNodeClick = (node: RoadmapNode, status: NodeStatus) => {
    if (status === 'unlocked' || status === 'completed') {
        const newProgress = { ...userProgress };
        newProgress[node.id] = { status: 'completed' };

        // Unlock children if all parents are now complete
        roadmap?.nodes.forEach(childNode => {
            if (childNode.parent_node_id) {
                const parents = childNode.parent_node_id.split(',').map(p => p.trim());
                const allParentsComplete = parents.every(pId => newProgress[pId]?.status === 'completed');
                if (allParentsComplete && (!newProgress[childNode.id] || newProgress[childNode.id].status === 'locked')) {
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
                <h1 className="text-4xl font-bold text-foreground">
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
        
        <div className="flex-grow w-full border border-border rounded-lg bg-panel/50 relative overflow-auto p-4">
             <div 
                className="absolute inset-0 w-full h-full" 
                style={{
                    backgroundImage: 'linear-gradient(rgba(var(--border-rgb), 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--border-rgb), 0.1) 1px, transparent 1px)',
                    backgroundSize: '30px 30px',
                }}
            />
            <div className="relative w-[1500px] h-[1000px]">
                <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
                    <AnimatePresence>
                        {roadmap.nodes.map(node => {
                            if (!node.parent_node_id) return null;
                            
                            const parents = node.parent_node_id.split(',');
                            return parents.map((parentId, index) => {
                                const parent = nodePositions[parentId.trim()];
                                if (parent) {
                                    const isParentCompleted = getNodeStatus(parent.id) === 'completed';
                                    return <Line key={`${parent.id}-${node.id}-${index}`} fromNode={parent} toNode={node} isCompleted={isParentCompleted} />;
                                }
                                return null;
                            });
                        })}
                    </AnimatePresence>
                </svg>

                <AnimatePresence>
                    {roadmap.nodes.map((node, index) => {
                        const status = getNodeStatus(node.id);
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
    </div>
  );
}
