"use client";

import { RoadmapNode, NodeStatus, NodeType } from '@/lib/mock-roadmaps-data';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CheckCircle, Lock, Sparkles } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


type RoadmapNodeProps = {
    node: RoadmapNode;
    status: NodeStatus;
    onClick: (node: RoadmapNode, status: NodeStatus) => void;
    index: number;
}

export function RoadmapNodeComponent({ node, status, onClick, index }: RoadmapNodeProps) {
    
    const nodeStyles = {
        item: "px-6 py-3 text-base",
        group: "px-8 py-4 text-lg font-bold",
    }

    const iconMap = {
        completed: <CheckCircle className="w-6 h-6" />,
        unlocked: <Sparkles className="w-6 h-6 animate-pulse" />,
        locked: <Lock className="w-6 h-6" />,
    }

    return (
        <motion.div
            key={node.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="absolute"
            style={{
                left: `${node.position_x}%`,
                top: `${node.position_y}%`,
                width: node.width ? `${node.width}%` : 'auto',
                transform: 'translate(-50%, -50%)',
            }}
        >
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            onClick={() => onClick(node, status)}
                            className={cn(
                                "w-full flex items-center justify-center text-center transition-all duration-300 border-2 rounded-lg shadow-lg backdrop-blur-sm",
                                nodeStyles[node.type],
                                status === 'completed' && "bg-green-500/20 border-green-500 text-green-200 shadow-green-500/20",
                                status === 'unlocked' && "bg-yellow-500/20 border-yellow-500 text-yellow-200 cursor-pointer hover:bg-yellow-500/30 hover:shadow-xl shadow-yellow-500/30",
                                status === 'locked' && "bg-gray-500/10 border-gray-600 text-gray-400 cursor-not-allowed"
                            )}
                        >
                            <span className="mr-3">{iconMap[status]}</span>
                            {node.title}
                        </button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-panel border-primary">
                        <p className="font-bold text-primary">{node.title}</p>
                        <p className="capitalize text-sm text-muted-foreground">{status}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </motion.div>
    );
}
