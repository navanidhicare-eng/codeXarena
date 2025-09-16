
"use client";

import { Brain, Swords, Trophy } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
    {
        icon: <Swords className="w-12 h-12 text-primary" />,
        title: "Find a Match",
        description: "Challenge a friend with a private link or get instantly matched with a player of your skill level.",
    },
    {
        icon: <Brain className="w-12 h-12 text-secondary" />,
        title: "Solve the Challenge",
        description: "Go head-to-head in our real-time arena to solve the algorithmic challenge first. No second place.",
    },
    {
        icon: <Trophy className="w-12 h-12 text-success" />,
        title: "Claim Victory",
        description: "Earn XP, climb the global rankings, and build a profile that proves your skill.",
    },
];

export function HowItWorks() {
    return (
        <section className="py-20 md:py-32 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold font-headline text-foreground">Three Steps to Glory</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.title}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            className="flex flex-col items-center text-center"
                        >
                            <div className="mb-6 flex items-center justify-center h-24 w-24 rounded-full bg-panel border-2 border-border">
                                {step.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-foreground mb-3">{step.title}</h3>
                            <p className="text-muted-foreground">{step.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
