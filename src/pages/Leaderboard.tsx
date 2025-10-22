import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Medal, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Profile {
  id: string;
  username: string;
  total_points: number;
}

const Leaderboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchLeaderboard();
  }, [user, navigate]);

  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('total_points', { ascending: false })
        .limit(100);

      if (error) throw error;
      if (data) setProfiles(data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown className="w-6 h-6 text-yellow-500 animate-pulse" />;
    if (index === 1) return <Medal className="w-6 h-6 text-gray-400" />;
    if (index === 2) return <Medal className="w-6 h-6 text-amber-600" />;
    return <span className="w-6 text-center font-bold">{index + 1}</span>;
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-earth p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-2">
            <Trophy className="w-8 h-8 text-primary animate-bounce" />
            Leaderboard
          </h1>
          <p className="text-muted-foreground">Top eco-warriors making a difference</p>
        </div>

        <Card className="shadow-glow">
          <CardHeader>
            <CardTitle>Top 100 Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {profiles.map((profile, index) => (
                <div
                  key={profile.id}
                  className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                    profile.id === user?.id 
                      ? 'bg-primary/10 border-2 border-primary' 
                      : 'bg-muted/50 hover:bg-muted'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8">
                      {getRankIcon(index)}
                    </div>
                    <div>
                      <p className="font-bold">
                        {profile.username || 'Anonymous'}
                        {profile.id === user?.id && (
                          <span className="ml-2 text-sm text-primary">(You)</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-primary" />
                    <span className="font-bold text-lg">{profile.total_points}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Leaderboard;
