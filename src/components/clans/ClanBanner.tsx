
"use client";

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

type ClanBannerProps = {
    symbol: React.ReactNode;
    bgColor: string;
    size?: 'small' | 'medium' | 'large';
    className?: string;
};

const sizeClasses = {
    small: 'w-10 h-14',
    medium: 'w-12 h-16',
    large: 'w-32 h-40',
};

const symbolSizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8',
    large: 'w-20 h-20',
};

export function ClanBanner({ symbol, bgColor, size = 'small', className }: ClanBannerProps) {
    return (
        <motion.div 
            className={cn(
                "pixel-box bg-gray-800 flex items-center justify-center relative overflow-hidden",
                sizeClasses[size],
                className
            )}
            style={{ backgroundColor: bgColor }}
            whileHover={{ scale: 1.05, rotate: -2 }}
        >
            <div className={cn("text-white/80", symbolSizeClasses[size])}>
                {symbol}
            </div>
            {/* Sheen effect */}
            <div 
                className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-br from-white/20 via-transparent to-transparent"
                style={{ transform: 'rotate(45deg)' }}
            />
        </motion.div>
    );
}
