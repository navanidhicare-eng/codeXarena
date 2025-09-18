"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getBugHuntById, getProblemForBugHunt } from '@/lib/bug-hunts-data';
import type { BugHuntChallenge, BugHuntLanguage } from '@/lib/bug-hunts-data';
import type { Problem } from '@/server/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { TestCasesPanel } from '@/components/TestCasesPanel';
import { Check, FlaskConical, BookOpen, Bug, FileCode, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function BugHuntArena() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const huntId = params.huntId as string;

  const [hunt, setHunt] = useState<BugHuntChallenge | null>(null);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [code, setCode] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<BugHuntLanguage>('javascript');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResults, setVerificationResults] = useState<(boolean | null)[]>([]);
  const [isSolved, setIsSolved] = useState(false);

  useEffect(() => {
    if (huntId) {
      const foundHunt = getBugHuntById(huntId);
      if (foundHunt) {
        setHunt(foundHunt);
        const associatedProblem = getProblemForBugHunt(foundHunt);
        setProblem(associatedProblem || null);
        
        const initialLang = foundHunt.availableLanguages[0];
        setSelectedLanguage(initialLang);
        setCode(foundHunt.buggyCode[initialLang] || '');

        const initialTestCases = associatedProblem ? associatedProblem.solutionChecker('', 'javascript').map(() => null) : [];
        setVerificationResults(initialTestCases);

      } else {
        router.push('/bug-hunts');
      }
    }
  }, [huntId, router]);

  const handleLanguageChange = (lang: BugHuntLanguage) => {
    if (hunt && hunt.buggyCode[lang]) {
        setSelectedLanguage(lang);
        setCode(hunt.buggyCode[lang]!);
    }
  };

  const handleVerify = () => {
    if (!problem) return;
    setIsVerifying(true);

    setTimeout(() => {
        const results = problem.solutionChecker(code, selectedLanguage);
        const newResults = results.map(r => r.passed);
        setVerificationResults(newResults);

        const allPassed = newResults.every(r => r === true);
        if (allPassed) {
            setIsSolved(true);
            toast({
                title: "Bug Squashed!",
                description: `You've earned ${hunt?.xpReward} XP!`,
                variant: 'default',
                className: 'bg-green-500/20 border-green-500 text-white'
            });
        }
        setIsVerifying(false);
    }, 1500);
  };

  if (!hunt || !problem) {
    return (
      <div className="h-screen w-screen bg-[#2d231a] p-4 flex flex-col gap-4">
        <Skeleton className="w-full h-20 rounded-lg bg-black/20" />
        <div className="flex-grow grid grid-cols-3 gap-4">
          <Skeleton className="w-full h-full rounded-lg bg-black/20" />
          <Skeleton className="w-full h-full rounded-lg bg-black/20" />
          <Skeleton className="w-full h-full rounded-lg bg-black/20" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-screen w-screen bg-[#2d231a] text-[#d4c8b8] p-4 flex flex-col gap-4 font-pixel overflow-hidden">
        <AnimatePresence>
        {isSolved && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/70 z-40 flex items-center justify-center"
            >
                <motion.div 
                    initial={{ scale: 0.5, y: 50 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    className="pixel-box bg-[#332a21] p-8 text-center"
                >
                    <h2 className="text-4xl text-emerald-400 font-bold mb-4">Case Closed!</h2>
                    <p className="text-lg text-white mb-2">You successfully squashed the bug.</p>
                    <p className="text-2xl text-yellow-400 font-bold mb-6">+{hunt.xpReward} XP Gained</p>
                    <Button asChild className="pixel-box bg-emerald-600 hover:bg-emerald-500 text-white h-12 text-lg">
                        <Link href="/bug-hunts">Back to Bounty Board</Link>
                    </Button>
                </motion.div>
            </motion.div>
        )}
        </AnimatePresence>

        <header className="pixel-box bg-[#332a21] p-4 flex justify-between items-center text-white">
            <h1 className="text-2xl flex items-center gap-2"><Bug /> Bug Hunt: {problem.title}</h1>
             <div className="flex gap-2">
                {hunt.availableLanguages.map(lang => (
                    <Button 
                        key={lang}
                        onClick={() => handleLanguageChange(lang)}
                        className={`pixel-box text-base ${selectedLanguage === lang ? 'bg-emerald-600' : 'bg-gray-600'}`}
                    >
                        {lang.toUpperCase()}
                    </Button>
                ))}
             </div>
        </header>
        
        <PanelGroup direction="horizontal" className="flex-grow min-h-0">
            <Panel defaultSize={25} minSize={20}>
                <div className="pixel-box-inset bg-[#1a140e] p-4 h-full flex flex-col gap-4">
                    <h2 className="text-xl flex items-center gap-2 text-yellow-300"><BookOpen /> Case File</h2>
                    <div className="bg-black/30 p-4 rounded flex-grow overflow-y-auto">
                        <h3 className="font-bold text-lg text-yellow-400 mb-2">{problem.title}</h3>
                        <p className="whitespace-pre-wrap font-body text-base">{problem.description}</p>
                    </div>
                </div>
            </Panel>
            <PanelResizeHandle className="w-4 flex items-center justify-center">
                <div className="w-2 h-16 bg-[#1a140e] rounded-full border-2 border-black" />
            </PanelResizeHandle>
            <Panel defaultSize={50} minSize={30}>
                 <div className="pixel-box-inset bg-[#1a140e] p-4 h-full flex flex-col gap-4">
                    <h2 className="text-xl flex items-center gap-2 text-red-400"><FileCode /> Crime Scene (Code)</h2>
                    <Textarea
                        value={code}
                        onChange={e => setCode(e.target.value)}
                        className="font-code text-lg bg-black/30 flex-grow w-full h-full border-2 border-gray-700 focus:border-red-500 focus-visible:ring-0 resize-none"
                    />
                 </div>
            </Panel>
            <PanelResizeHandle className="w-4 flex items-center justify-center">
                <div className="w-2 h-16 bg-[#1a140e] rounded-full border-2 border-black" />
            </PanelResizeHandle>
            <Panel defaultSize={25} minSize={20}>
                <div className="pixel-box-inset bg-[#1a140e] p-4 h-full flex flex-col gap-4">
                    <h2 className="text-xl flex items-center gap-2 text-blue-400"><FlaskConical /> Verification</h2>
                     <div className="bg-black/30 p-4 rounded flex-grow overflow-y-auto">
                        <TestCasesPanel testCases={verificationResults} />
                     </div>
                    <Button onClick={handleVerify} disabled={isVerifying} className="pixel-box bg-emerald-600 hover:bg-emerald-500 h-14 text-white text-lg w-full">
                        {isVerifying ? 'Verifying...' : 'Run & Verify'}
                    </Button>
                </div>
            </Panel>
        </PanelGroup>
    </div>
  );
}
