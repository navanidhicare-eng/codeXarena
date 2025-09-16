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
        item: "px-4 py-2 text-sm",
        group: "px-6 py-3 text-base font-bold",
    }

    const iconMap = {
        completed: <CheckCircle className="w-5 h-5" />,
        unlocked: <Sparkles className="w-5 h-5 animate-pulse" />,
        locked: <Lock className="w-5 h-5" />,
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
                                "w-full flex items-center justify-center text-center transition-all duration-300 border-2 rounded-lg shadow-md",
                                nodeStyles[node.type],
                                status === 'completed' && "bg-green-100 border-green-500 text-green-800",
                                status === 'unlocked' && "bg-yellow-100 border-yellow-500 text-yellow-800 cursor-pointer hover:bg-yellow-200 hover:shadow-lg",
                                status === 'locked' && "bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed"
                            )}
                        >
                            <span className="mr-2">{iconMap[status]}</span>
                            {node.title}
                        </button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p className="font-bold">{node.title}</p>
                        <p className="capitalize text-sm text-muted-foreground">{status}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </motion.div>
    );
}
