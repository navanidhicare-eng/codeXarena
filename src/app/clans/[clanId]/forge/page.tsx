
"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getClanById, Clan } from '@/lib/mock-clans-data';
import { getProblemForBugHunt, bugHuntChallenges } from '@/lib/bug-hunts-data';
import type { Problem } from '@/server/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { TestCasesPanel } from '@/components/TestCasesPanel';
import { BookOpen, FileCode, FlaskConical, Users, ArrowLeft, RefreshCw, Send } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';

export default function ClanForgePage() {
  const params = useParams();
  const router = useRouter();
  const clanId = params.clanId as string;

  const [clan, setClan] = useState<Clan | null>(null);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [code, setCode] = useState('');
  const [verificationResults, setVerificationResults] = useState<(boolean | null)[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (clanId) {
      const foundClan = getClanById(clanId);
      if (foundClan) {
        setClan(foundClan);
        // For simplicity, let's use a bug hunt problem
        const associatedProblem = getProblemForBugHunt(bugHuntChallenges[0]);
        setProblem(associatedProblem || null);
        setCode(associatedProblem?.starterCode['javascript'] || '');
        const initialTestCases = associatedProblem ? associatedProblem.solutionChecker('', 'javascript').map(() => null) : [];
        setVerificationResults(initialTestCases);
      } else {
        router.push('/clans');
      }
    }
  }, [clanId, router]);
  
  const handleVerify = () => {
    if (!problem) return;
    setIsVerifying(true);

    setTimeout(() => {
        const results = problem.solutionChecker(code, 'javascript');
        const newResults = results.map(r => r.passed);
        setVerificationResults(newResults);
        setIsVerifying(false);
    }, 1500);
  };
  
  if (!clan || !problem) {
    return (
      <div className="h-screen w-screen bg-[#1a140e] p-4 flex flex-col gap-4">
        <Skeleton className="w-full h-16 rounded-lg bg-black/20" />
        <div className="flex-grow grid grid-cols-3 gap-4">
          <Skeleton className="w-full h-full rounded-lg bg-black/20" />
          <Skeleton className="w-full h-full rounded-lg bg-black/20 col-span-2" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-[#1a140e] text-[#d4c8b8] p-4 flex flex-col gap-4 font-pixel overflow-hidden">
        <header className="pixel-box bg-[#332a21] p-4 flex justify-between items-center text-white">
            <h1 className="text-2xl flex items-center gap-2">The Forge: {clan.name}</h1>
            <div className="flex items-center gap-4">
                <div className="flex -space-x-4">
                 {clan.members.slice(0, 4).map(member => (
                    <Avatar key={member.name} className="w-10 h-10 pixel-box-inset p-0.5 bg-gray-800">
                        <AvatarImage src={member.avatarUrl} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                 ))}
                </div>
                 <Button asChild variant="outline" className="pixel-box bg-blue-600 hover:bg-blue-500 text-white">
                    <Link href={`/clans/${clanId}`}>
                        <ArrowLeft className="mr-2 h-4 w-4"/>
                        Leave Forge
                    </Link>
                 </Button>
            </div>
        </header>

        <PanelGroup direction="horizontal" className="flex-grow min-h-0">
            <Panel defaultSize={30} minSize={25}>
                <div className="h-full flex flex-col gap-4">
                     <div className="pixel-box-inset bg-[#1a140e] p-4 h-1/2 flex flex-col gap-4">
                        <h2 className="text-xl flex items-center gap-2 text-yellow-300"><BookOpen /> Problem</h2>
                        <div className="bg-black/30 p-4 rounded flex-grow overflow-y-auto">
                            <h3 className="font-bold text-lg text-yellow-400 mb-2">{problem.title}</h3>
                            <p className="whitespace-pre-wrap font-body text-base">{problem.description}</p>
                        </div>
                    </div>
                     <div className="pixel-box-inset bg-[#1a140e] p-4 h-1/2 flex flex-col gap-4">
                        <h2 className="text-xl flex items-center gap-2 text-blue-400"><FlaskConical /> Verification</h2>
                        <div className="bg-black/30 p-4 rounded flex-grow overflow-y-auto">
                            <TestCasesPanel testCases={verificationResults} />
                        </div>
                        <Button onClick={handleVerify} disabled={isVerifying} className="pixel-box bg-emerald-600 hover:bg-emerald-500 h-12 text-white text-lg w-full">
                            {isVerifying ? 'Verifying...' : 'Run & Verify'}
                        </Button>
                    </div>
                </div>
            </Panel>
            <PanelResizeHandle className="w-4 flex items-center justify-center">
                <div className="w-2 h-16 bg-[#1a140e] rounded-full border-2 border-black" />
            </PanelResizeHandle>
             <Panel defaultSize={70} minSize={40}>
                <div className="h-full flex flex-col gap-4">
                    <div className="pixel-box-inset bg-[#1a140e] p-4 flex-grow flex flex-col gap-4">
                        <h2 className="text-xl flex items-center gap-2 text-red-400"><FileCode /> Shared Code</h2>
                        <Textarea
                            value={code}
                            onChange={e => setCode(e.target.value)}
                            className="font-code text-lg bg-black/30 flex-grow w-full h-full border-2 border-gray-700 focus:border-red-500 focus-visible:ring-0 resize-none"
                        />
                    </div>
                    <div className="pixel-box-inset bg-[#1a140e] p-4 h-[200px] flex flex-col gap-4">
                        <h2 className="text-xl flex items-center gap-2 text-white"><Users /> Team Chat</h2>
                        <ScrollArea className="bg-black/30 p-2 rounded flex-grow">
                            {/* Mock chat */}
                             <p className="text-sm font-body"><span className="text-yellow-400">SyntaxSleuth:</span> Okay team, let's look at this two-sum problem.</p>
                             <p className="text-sm font-body"><span className="text-blue-400">CodeNinja:</span> I think we need a hash map for this.</p>
                        </ScrollArea>
                        <div className="flex items-center gap-2">
                            <Input placeholder="Send message..." className="font-body bg-black/30 border-gray-600"/>
                            <Button className="pixel-box bg-blue-600 hover:bg-blue-500"><Send /></Button>
                        </div>
                    </div>
                </div>
            </Panel>
        </PanelGroup>
    </div>
  );
}

