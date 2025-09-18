
"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';

const features = [
    {
        headline: "Prove Your Skill, Live.",
        text: "No more lonely grinding. Experience the adrenaline of a real-time coding duel. See your opponent's progress as you code and feel the pressure of the clock.",
        imageUrl: "https://picsum.photos/seed/feature1/600/400",
        imageHint: "live coding duel screenshot",
        align: "left",
    },
    {
        headline: "Your AI Sparring Partner.",
        text: "Feeling stuck? Our integrated AI mentor gives you conceptual hints, not cheat-code answers. It's the perfect way to learn and overcome challenges without giving up.",
        imageUrl: "https://picsum.photos/seed/feature2/600/400",
        imageHint: "ai hint modal screenshot",
        align: "right",
    },
    {
        headline: "Level Up Your Career.",
        text: "Every battle you win earns you XP, badges, and a higher rank. Build a developer profile that's more than a resume—it's a record of your victories.",
        imageUrl: "https://picsum.photos/seed/feature3/600/400",
        imageHint: "user profile page with stats",
        align: "left",
    }
];

export function Features() {
    return (
        <section className="py-20 md:py-32 bg-panel/50 border-y border-border">
            <div className="container mx-auto px-4">
                <div className="space-y-24">
                    {features.map((feature, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                           <motion.div
                                initial={{ opacity: 0, x: feature.align === 'left' ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, amount: 0.5 }}
                                transition={{ duration: 0.6 }}
                                className={`flex flex-col justify-center ${feature.align === 'left' ? 'md:order-1' : 'md:order-2'}`}
                            >
                                <h3 className="text-3xl md:text-4xl font-bold font-headline text-primary mb-4">{feature.headline}</h3>
                                <p className="text-lg text-muted-foreground">{feature.text}</p>
                            </motion.div>
                             <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true, amount: 0.5 }}
                                transition={{ duration: 0.6 }}
                                className={`relative aspect-video ${feature.align === 'left' ? 'md:order-2' : 'md:order-1'}`}
                            >
                                <Image
                                    src={feature.imageUrl}
                                    alt={feature.headline}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="rounded-lg object-cover border-2 border-border shadow-lg"
                                    data-ai-hint={feature.imageHint}
                                />
                            </motion.div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
