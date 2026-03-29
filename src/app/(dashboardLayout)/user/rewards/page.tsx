import { getCurrentUser } from "@/lib/auth";
import { getMyRewards } from "@/lib/actions/reward";
import { redirect } from "next/navigation";
import { 
  Trophy, 
  Zap, 
  Gift, 
  History, 
  TrendingUp, 
  ArrowRight,
  ShieldCheck,
  Award,
  ChevronRight,
  Star
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "My Rewards | TasteNest",
  description: "View and redeem your loyalty points",
};

export default async function MyRewardsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/signin");
  }

  const result = await getMyRewards();
  const rewards = result.success ? result.data : [];
  
  // Calculate total points
  const totalPoints = rewards.reduce((acc: number, r: any) => {
    return r.type === 'earn' ? acc + r.points : acc - r.points;
  }, 0);

  const nextTierPoints = 1000;
  const progressPercent = (totalPoints / nextTierPoints) * 100;

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Progress Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
          <div className="lg:col-span-12">
            <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-3xl p-10 relative overflow-hidden shadow-2xl shadow-gray-900/40">
                {/* Background Decorations */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/10 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2" />
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-12">
                    <div className="max-w-md">
                        <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs mb-4">
                            <Award className="w-4 h-4" />
                            <span>TasteNest Loyalty Program</span>
                        </div>
                        <h2 className="text-4xl font-extrabold text-white tracking-tight mb-4">You have <span className="text-primary italic">{totalPoints}</span> Points!</h2>
                        <p className="text-gray-400 font-medium leading-relaxed">
                            Every meal brings you closer to exclusive rewards. Keep ordering to unlock VIP benefits.
                        </p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex-1 max-w-lg">
                        <div className="flex justify-between items-end mb-4">
                            <div className="space-y-1 py-1">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Tier Status</p>
                                <p className="text-white font-bold text-xl">Silver Member</p>
                            </div>
                            <Badge className="bg-primary hover:bg-primary text-white border-none px-4 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-lg shadow-primary/20">
                                450 to go
                            </Badge>
                        </div>
                        <Progress value={progressPercent} className="h-4 bg-white/5" />
                        <div className="flex justify-between mt-4">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">0 XP</span>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">1000 XP (Gold)</span>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>

        {/* Rewards Section */}
        <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Gift className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Available For Redemption</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 px-1">
            <Card className="border-gray-100 shadow-xl shadow-gray-200/20 rounded-3xl overflow-hidden ring-1 ring-black/2 group hover:ring-primary/20 transition-all duration-300">
                <CardHeader className="bg-gray-50/50 border-b border-gray-50 flex flex-row items-center gap-4 py-6">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500">
                        <Zap className="w-6 h-6" />
                    </div>
                    <div>
                        <CardTitle className="text-lg font-bold">15% Discount Voucher</CardTitle>
                        <CardDescription className="text-primary font-bold">250 Points</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                   <p className="text-sm text-gray-500 font-medium mb-6">Enjoy a sit-wide 15% discount on any order over $20. Valid for one usage.</p>
                   <Button variant="outline" className="w-full border-2 border-gray-100 hover:border-primary/20 hover:bg-primary/5 rounded-xl font-bold h-12 px-0 transition-all">Redeem Now</Button>
                </CardContent>
            </Card>

            <Card className="border-gray-100 shadow-xl shadow-gray-200/20 rounded-3xl overflow-hidden ring-1 ring-black/2 group hover:ring-primary/20 transition-all duration-300 opacity-60">
                <CardHeader className="bg-gray-50/50 border-b border-gray-50 flex flex-row items-center gap-4 py-6">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center">
                        <Package className="w-6 h-6" />
                    </div>
                    <div>
                        <CardTitle className="text-lg font-bold">Free Main Dish</CardTitle>
                        <CardDescription className="text-gray-400 font-bold">600 Points</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                   <p className="text-sm text-gray-500 font-medium mb-6">Unlock a free main dish of your choice with your next dinner booking.</p>
                   <Button disabled className="w-full rounded-xl font-bold h-12 px-0 border border-transparent bg-gray-100 text-gray-400">Not Enough Points</Button>
                </CardContent>
            </Card>

             <Card className="border-gray-100 shadow-xl shadow-gray-200/20 rounded-3xl overflow-hidden ring-1 ring-black/2 group hover:ring-primary/20 transition-all duration-300 opacity-60">
                <CardHeader className="bg-gray-50/50 border-b border-gray-50 flex flex-row items-center gap-4 py-6">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <CardTitle className="text-lg font-bold">Priority Delivery</CardTitle>
                        <CardDescription className="text-gray-400 font-bold">1000 Points</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                   <p className="text-sm text-gray-500 font-medium mb-6">Your orders will always be at the front of the queue, delivered with priority speed.</p>
                   <Button disabled className="w-full rounded-xl font-bold h-12 px-0 border border-transparent bg-gray-100 text-gray-400">Not Enough Points</Button>
                </CardContent>
            </Card>
        </div>

        {/* History Section */}
        <div className="flex items-center gap-3 mb-8 px-1">
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                <History className="w-5 h-5 text-gray-600" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Earning History</h2>
        </div>

        {rewards.length > 0 ? (
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/20 border border-gray-100 overflow-hidden ring-1 ring-black/2 px-1 py-1">
             <div className="divide-y divide-gray-50">
               {rewards.map((reward: any) => (
                 <div key={reward.id} className="p-6 flex items-center justify-between hover:bg-gray-50/80 transition-colors">
                   <div className="flex items-center gap-4">
                     <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${reward.type === 'earn' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                       {reward.type === 'earn' ? <TrendingUp className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                     </div>
                     <div className="space-y-0.5 py-1">
                        <h4 className="font-bold text-gray-900 tracking-tight">{reward.description}</h4>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                            {new Date(reward.createdAt).toLocaleDateString()} at {new Date(reward.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                     </div>
                   </div>
                   <div className="flex items-center gap-3">
                        <span className={`font-exrabold text-lg tracking-tight ${reward.type === 'earn' ? 'text-green-600' : 'text-red-500'}`}>
                            {reward.type === 'earn' ? '+' : '-'}{reward.points}
                        </span>
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                            <Star className="w-3 h-3 text-primary fill-primary" />
                        </div>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border-dashed border-2 border-gray-200 p-16 flex flex-col items-center text-center">
            <Trophy className="w-12 h-12 text-gray-300 mb-6" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No points history</h3>
            <p className="text-gray-500 max-w-xs font-medium">Place your first order and start earning loyalty points today!</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Package(props: any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m7.5 4.27 9 5.15" />
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
        <path d="m3.3 7 8.7 5 8.7-5" />
        <path d="M12 22V12" />
      </svg>
    )
  }
