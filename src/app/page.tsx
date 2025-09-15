
"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Github, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const GoogleIcon = () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
        <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
        />
        <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
        />
        <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
        />
        <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
        />
    </svg>
);

const AppleIcon = () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
        <path
        d="M12.01,2.09c-2.31-0.02-4.23,1.02-5.48,2.58c-1.33,1.65-1.74,4.2-1.2,6.33c1.23,0.12,2.5,0.72,3.75-0.12 c1-0.67,1.8-1.87,1.75-3.21c-0.02-1.39-1.03-2.52-2.12-2.88c0.75-1.22,2.08-2.01,3.58-1.99c0.23,0,0.44,0.02,0.67,0.06 c-0.13,0.38-0.2,0.78-0.2,1.19c0,1.87,1.19,3.3,2.8,3.95c1.4,0.56,2.89,0.7,4.24,0.33c0.1-1.4-0.34-2.83-1.12-3.88 c-1.22-1.63-3.02-2.75-5.15-2.75"
        fill="currentColor"
        />
        <path
        d="M13.48,10.66c-1.23,0-2.48,0.58-3.21,1.61c-0.81,1.13-1.13,2.6-0.8,3.95c0.55,2.4,2.55,4.23,4.92,4.64 c0.33,0.06,0.66,0.09,0.98,0.09c1.6,0,3.2-0.81,4.14-1.89c-1.13-0.09-2.27-0.65-3.08-1.57c-0.89-1.02-1.27-2.42-0.95-3.82 c0.5-2.21,2.54-3.66,4.62-3.66c0.33,0,0.65,0.04,0.96,0.11c-1.26-2.11-3.22-3.41-5.58-3.41"
        fill="currentColor"
        />
    </svg>
);

const PasswordStrengthIndicator = ({ strength }: { strength: number }) => {
    const segments = [
        { color: "bg-destructive", active: strength >= 1 },
        { color: "bg-destructive", active: strength >= 2 },
        { color: "bg-yellow-500", active: strength >= 3 },
        { color: "bg-success", active: strength >= 4 },
    ];

    return (
        <div className="flex w-full h-1 gap-1.5 mt-1">
        {segments.map((segment, index) => (
            <div
            key={index}
            className={`flex-1 rounded-full transition-colors ${
                segment.active ? segment.color : "bg-muted/50"
            }`}
            />
        ))}
        </div>
    );
};

export default function AuthPage() {
    const [view, setView] = useState("login");
    const [password, setPassword] = useState("");
    const [passwordStrength, setPasswordStrength] = useState(0);

    const checkPasswordStrength = (pass: string) => {
        let strength = 0;
        if (pass.length > 7) strength++;
        if (pass.match(/[a-z]+/)) strength++;
        if (pass.match(/[A-Z]+/)) strength++;
        if (pass.match(/[0-9]+/)) strength++;
        if (pass.match(/[$@#&!]+/)) strength++;
        // Simple strength check, can be improved
        if (strength > 4) strength = 4;
        setPassword(pass);
        setPasswordStrength(strength);
    };
    
    return (
        <div className="min-h-screen w-full bg-background grid grid-cols-1 md:grid-cols-2">
            <div className="relative flex-col items-center justify-center hidden md:flex">
                <Image
                    src="https://picsum.photos/seed/future-ui/1200/1800"
                    alt="CodeVerse Arena"
                    fill
                    objectFit="cover"
                    className="opacity-20"
                    data-ai-hint="futuristic abstract"
                />
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative z-10 bg-black/30 backdrop-blur-sm p-8 rounded-xl border border-primary/20 shadow-2xl shadow-primary/20"
                >
                    <h1 className="font-headline font-bold text-6xl bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text" style={{ textShadow: '0 0 15px hsla(var(--primary), 0.5)' }}>
                        CodeVerse
                    </h1>
                    <p className="font-headline text-secondary text-xl mt-2">
                        Stop Grinding. Start Battling.
                    </p>
                </motion.div>
            </div>

            <div className="flex items-center justify-center p-4 sm:p-8">
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="w-full max-w-md"
                >
                    <Tabs defaultValue="login" className="w-full" onValueChange={setView}>
                        <h2 className="text-3xl font-bold font-headline text-center text-foreground mb-2">
                            {view === "login" ? "Welcome Back" : "Join the Battle"}
                        </h2>
                        <p className="text-center text-muted-foreground mb-6">
                            {view === 'login' ? 'Sign in to continue your journey.' : 'Create an account to start competing.'}
                        </p>
                        <TabsList className="grid w-full grid-cols-2 mb-6">
                            <TabsTrigger value="login">Login</TabsTrigger>
                            <TabsTrigger value="register">Register</TabsTrigger>
                        </TabsList>
                        
                        <div className="space-y-4 mb-6">
                            <Button variant="outline" className="w-full h-12 text-base border-border hover:bg-accent/50 hover:border-primary/50 transition-all duration-300 transform hover:scale-105">
                                <GoogleIcon /> Continue with Google
                            </Button>
                            <Button variant="outline" className="w-full h-12 text-base border-border hover:bg-accent/50 hover:border-primary/50 transition-all duration-300 transform hover:scale-105">
                                <Github /> Continue with Github
                            </Button>
                            <Button variant="outline" className="w-full h-12 text-base border-border hover:bg-accent/50 hover:border-primary/50 transition-all duration-300 transform hover:scale-105">
                                <AppleIcon /> Continue with Apple
                            </Button>
                        </div>
                        
                        <div className="flex items-center my-6">
                            <div className="flex-grow border-t border-border"></div>
                            <span className="flex-shrink mx-4 text-xs text-muted-foreground uppercase">Or continue with email</span>
                            <div className="flex-grow border-t border-border"></div>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={view}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <TabsContent value="login">
                                    <form className="space-y-4">
                                        <Input type="email" placeholder="Email" required className="h-12"/>
                                        <Input type="password" placeholder="Password" required className="h-12"/>
                                        <div className="text-right">
                                            <Button variant="link" className="text-muted-foreground p-0 h-auto">Forgot Password?</Button>
                                        </div>
                                        <Button type="submit" className="w-full h-14 text-lg font-bold">Login</Button>
                                    </form>
                                </TabsContent>
                                <TabsContent value="register">
                                    <form className="space-y-4">
                                        <Input type="text" placeholder="Username" required className="h-12"/>
                                        <Input type="email" placeholder="Email" required className="h-12"/>
                                        <div>
                                            <Input 
                                                type="password" 
                                                placeholder="Password" 
                                                required 
                                                className="h-12"
                                                value={password}
                                                onChange={(e) => checkPasswordStrength(e.target.value)}
                                            />
                                            <PasswordStrengthIndicator strength={passwordStrength} />
                                        </div>
                                        <Button type="submit" className="w-full h-14 text-lg font-bold">Create Account</Button>
                                    </form>
                                </TabsContent>
                            </motion.div>
                        </AnimatePresence>
                    </Tabs>
                </motion.div>
            </div>
        </div>
    );
}

