"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getRoadmapById, userProgress as initialUserProgress, Roadmap, RoadmapNode, NodeStatus } from '@/lib/mock-roadmaps-data';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, Lock, Sparkles } from 'lucide-react';
import { notFound } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

const getNodeStatus = (nodeId: string, progress: typeof initialUserProgress): NodeStatus => {
  return progress[nodeId]?.status || 'locked';
};

const Line = ({ fromNode, toNode, isCompleted }: { fromNode: RoadmapNode, toNode: RoadmapNode, isCompleted: boolean }) => {
  return (
    <motion.line
      x1={`${fromNode.position_x}%`}
      y1={`${fromNode.position_y}%`}
      x2={`${toNode.position_x}%`}
      y2={`${toNode.position_y}%`}
      stroke="hsl(var(--border))"
      strokeWidth="2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1, strokeDasharray: isCompleted ? "0" : "5 5" }}
      transition={{ duration: 0.8, delay: 0.3 }}
    />
  );
};


export default function RoadmapViewPage({ params }: { params: { roadmapId: string } }) {
  const router = useRouter();
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [userProgress, setUserProgress] = useState(initialUserProgress);
  const [nodePositions, setNodePositions] = useState<{[key: string]: RoadmapNode}>({});


  useEffect(() => {
    const fetchedRoadmap = getRoadmapById(params.roadmapId);
    if (fetchedRoadmap) {
      setRoadmap(fetchedRoadmap);
      const positions: {[key: string]: RoadmapNode} = {};
      fetchedRoadmap.nodes.forEach(node => {
          positions[node.id] = node;
      })
      setNodePositions(positions);

      // Recalculate progress to unlock nodes based on completion status
      const newProgress = { ...initialUserProgress };
      let changed = true;
      while(changed) {
          changed = false;
          fetchedRoadmap.nodes.forEach(node => {
              if (node.parent_node_id) {
                const parents = node.parent_node_id.split(',');
                const allParentsComplete = parents.every(pId => newProgress[pId]?.status === 'completed');
                if (allParentsComplete && !newProgress[node.id]) {
                     newProgress[node.id] = { status: 'unlocked' };
                     changed = true;
                }
              } else if (!node.parent_node_id && !newProgress[node.id]) {
                  newProgress[node.id] = { status: 'unlocked' };
                  changed = true;
              }
          });
      }
      setUserProgress(newProgress);

    } else {
      notFound();
    }
  }, [params.roadmapId]);


  const handleNodeClick = (node: RoadmapNode, status: NodeStatus) => {
    if (status === 'unlocked') {
        console.log(`Navigating to problem: ${node.problem_id}`);

        const newProgress = { ...userProgress };
        newProgress[node.id] = { status: 'completed' };

        // Unlock children if their parents are now all complete
        roadmap?.nodes.forEach(childNode => {
            if (childNode.parent_node_id) {
                const parents = childNode.parent_node_id.split(',');
                const allParentsComplete = parents.every(pId => newProgress[pId]?.status === 'completed');
                if (allParentsComplete) {
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
    <TooltipProvider>
        <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8 flex flex-col">
            <header className="flex items-center justify-between mb-8 flex-shrink-0">
                 <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl font-headline font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
                        {roadmap.title}
                    </h1>
                    <p className="text-muted-foreground mt-2">{roadmap.description}</p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Button asChild variant="outline">
                        <Link href="/roadmaps">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to All Roadmaps
                        </Link>
                    </Button>
                </motion.div>
            </header>
            
            <div className="flex-grow w-full border border-border rounded-lg bg-panel/50 backdrop-blur-sm relative overflow-hidden">
                <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
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
                    </AnimatePresence>
                </svg>

                <AnimatePresence>
                    {roadmap.nodes.map((node, index) => {
                        const status = getNodeStatus(node.id, userProgress);
                        return (
                            <motion.div
                                key={node.id}
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="absolute"
                                style={{
                                    left: `${node.position_x}%`,
                                    top: `${node.position_y}%`,
                                    transform: 'translate(-50%, -50%)',
                                }}
                            >
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button
                                            onClick={() => handleNodeClick(node, status)}
                                            className={cn(
                                                "w-28 h-28 rounded-full flex flex-col items-center justify-center p-2 text-center transition-all duration-300 border-4 shadow-lg",
                                                status === 'completed' && "bg-primary/20 border-primary text-primary-foreground shadow-primary-glow",
                                                status === 'unlocked' && "bg-secondary/20 border-secondary text-secondary-foreground animate-pulse cursor-pointer hover:scale-110 hover:shadow-secondary-glow",
                                                status === 'locked' && "bg-muted/20 border-border border-dashed text-muted-foreground cursor-not-allowed"
                                            )}
                                        >
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: 0.5 }}
                                                className="mb-1"
                                            >
                                                {status === 'completed' && <Check className="w-8 h-8" />}
                                                {status === 'unlocked' && <Sparkles className="w-8 h-8" />}
                                                {status === 'locked' && <Lock className="w-8 h-8" />}
                                            </motion.div>
                                            <span className="text-sm font-semibold leading-tight">{node.title}</span>
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-panel border-border backdrop-blur-md">
                                        <p className="font-bold text-lg text-primary">{node.title}</p>
                                        <p className="capitalize text-sm text-muted-foreground">{status}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    </TooltipProvider>
  );
}
