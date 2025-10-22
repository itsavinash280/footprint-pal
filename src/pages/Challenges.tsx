import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Trophy, Award, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  points: number;
  category: string;
}

interface UserChallenge {
  challenge_id: string;
  completed: boolean;
}

const Challenges = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [userChallenges, setUserChallenges] = useState<UserChallenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      const [challengesRes, userChallengesRes] = await Promise.all([
        supabase.from('challenges').select('*'),
        supabase.from('user_challenges').select('*').eq('user_id', user?.id)
      ]);

      if (challengesRes.data) setChallenges(challengesRes.data);
      if (userChallengesRes.data) setUserChallenges(userChallengesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const startChallenge = async (challengeId: string) => {
    try {
      const { error } = await supabase.from('user_challenges').insert({
        user_id: user?.id,
        challenge_id: challengeId
      });

      if (error) throw error;

      toast({
        title: 'Challenge Started!',
        description: 'Good luck on your eco-journey!'
      });
      fetchData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const completeChallenge = async (challengeId: string) => {
    try {
      const { error } = await supabase
        .from('user_challenges')
        .update({ completed: true, completed_at: new Date().toISOString() })
        .eq('user_id', user?.id)
        .eq('challenge_id', challengeId);

      if (error) throw error;

      toast({
        title: 'Challenge Completed!',
        description: 'Points added to your account!'
      });
      fetchData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-success';
      case 'medium': return 'bg-warning';
      case 'hard': return 'bg-destructive';
      default: return 'bg-muted';
    }
  };

  const getChallengeStatus = (challengeId: string) => {
    const userChallenge = userChallenges.find(uc => uc.challenge_id === challengeId);
    if (!userChallenge) return 'not_started';
    return userChallenge.completed ? 'completed' : 'in_progress';
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-nature p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-2">
            <Trophy className="w-8 h-8 text-primary animate-bounce" />
            Challenges
          </h1>
          <p className="text-muted-foreground">Complete challenges to earn points and reduce your carbon footprint</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge) => {
            const status = getChallengeStatus(challenge.id);
            return (
              <Card key={challenge.id} className="shadow-card hover:shadow-glow transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{challenge.title}</CardTitle>
                    <Badge className={getDifficultyColor(challenge.difficulty)}>
                      {challenge.difficulty}
                    </Badge>
                  </div>
                  <CardDescription>{challenge.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-primary" />
                      <span className="font-bold">{challenge.points} points</span>
                    </div>
                    <Badge variant="outline">{challenge.category}</Badge>
                  </div>
                  
                  {status === 'not_started' && (
                    <Button onClick={() => startChallenge(challenge.id)} className="w-full">
                      <Target className="w-4 h-4 mr-2" />
                      Start Challenge
                    </Button>
                  )}
                  {status === 'in_progress' && (
                    <Button onClick={() => completeChallenge(challenge.id)} variant="secondary" className="w-full">
                      Mark as Complete
                    </Button>
                  )}
                  {status === 'completed' && (
                    <Button disabled className="w-full">
                      <Trophy className="w-4 h-4 mr-2" />
                      Completed
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Challenges;
