import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Leaf, BarChart3, Mic, Plus } from 'lucide-react';
import CarbonDashboard from '@/components/dashboard/CarbonDashboard';
import VoiceAssistant from '@/components/voice/VoiceAssistant';
import ActivityLogger from '@/components/activity/ActivityLogger';
import Navigation from '@/components/Navigation';
import heroImage from '@/assets/hero-nature.jpg';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [isListening, setIsListening] = useState(false);
  const [activities, setActivities] = useState<any[]>([]);
  const [totalCO2Today, setTotalCO2Today] = useState(8.2);

  useEffect(() => {
    // Load saved activities from localStorage
    const savedActivities = localStorage.getItem('carbonActivities');
    if (savedActivities) {
      setActivities(JSON.parse(savedActivities));
    }
  }, []);

  useEffect(() => {
    // Save activities to localStorage
    localStorage.setItem('carbonActivities', JSON.stringify(activities));
    
    // Calculate total CO2 for today
    const today = new Date().toDateString();
    const todayActivities = activities.filter(activity => 
      new Date(activity.timestamp).toDateString() === today
    );
    const totalToday = todayActivities.reduce((sum, activity) => sum + activity.co2, 0);
    setTotalCO2Today(totalToday);
  }, [activities]);

  const handleActivityLogged = (activity: any) => {
    setActivities(prev => [...prev, activity]);
    
    // Show encouragement based on activity type
    const encouragements = {
      transport: activity.mode === 'bicycle' || activity.mode === 'walking' 
        ? "Great eco-choice! Zero emissions transport! 🚴‍♀️"
        : "Consider trying public transport or cycling next time! 🌱",
      energy: "Every bit of energy tracking helps! Try LED bulbs to reduce usage! 💡",
      food: activity.foodType === 'vegan' || activity.foodType === 'vegetarian'
        ? "Awesome plant-based choice! 🌱"
        : "Plant-based meals can reduce your food footprint by up to 70%! 🥗",
      waste: "Good job tracking waste! Recycling makes a difference! ♻️"
    };

    setTimeout(() => {
      toast({
        title: "Eco Tip! 🌍",
        description: encouragements[activity.type as keyof typeof encouragements] || "Great job tracking your footprint!",
      });
    }, 1000);
  };

  const toggleVoiceAssistant = () => {
    setIsListening(!isListening);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      {/* Hero Section */}
      <div 
        className="relative bg-gradient-nature py-16 px-4 text-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-4xl mx-auto text-white">
          <div className="flex justify-center mb-6">
            <Badge className="bg-white/20 text-white text-lg px-4 py-2 animate-bounce-in">
              <Leaf className="w-5 h-5 mr-2 animate-spin-slow" style={{ animationDuration: '8s' }} />
              Carbon Footprint Tracker
            </Badge>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Track. Reduce. Impact.
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            Your personal AI assistant for a sustainable lifestyle
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6"
              onClick={() => document.getElementById('main-tabs')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              View Dashboard
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-white/10 border-white text-white hover:bg-white/20 text-lg px-8 py-6"
              onClick={toggleVoiceAssistant}
            >
              <Mic className="w-5 h-5 mr-2" />
              Try Voice Assistant
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="w-full" id="main-tabs">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="dashboard" className="text-lg py-3">
              <BarChart3 className="w-5 h-5 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="log" className="text-lg py-3">
              <Plus className="w-5 h-5 mr-2" />
              Log Activity
            </TabsTrigger>
            <TabsTrigger value="voice" className="text-lg py-3">
              <Mic className="w-5 h-5 mr-2" />
              Voice Assistant
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <CarbonDashboard 
              onVoiceToggle={toggleVoiceAssistant} 
              isListening={isListening} 
            />
          </TabsContent>

          <TabsContent value="log" className="space-y-6">
            <ActivityLogger onActivityLogged={handleActivityLogged} />
          </TabsContent>

          <TabsContent value="voice" className="space-y-6">
            <VoiceAssistant 
              onActivityLogged={handleActivityLogged}
              isListening={isListening}
              setIsListening={setIsListening}
            />
          </TabsContent>
        </Tabs>

        {/* Quick Stats */}
        {activities.length > 0 && (
          <div className="mt-12 p-6 bg-gradient-nature rounded-3xl">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">Your Impact So Far</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div>
                  <div className="text-3xl font-bold text-primary">{activities.length}</div>
                  <div className="text-muted-foreground">Activities Logged</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">{totalCO2Today.toFixed(1)} kg</div>
                  <div className="text-muted-foreground">CO₂ Today</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-success">
                    {Math.max(0, 15 - totalCO2Today).toFixed(1)} kg
                  </div>
                  <div className="text-muted-foreground">Below Average</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center text-muted-foreground">
          <p className="mb-2">🌱 Every small action counts towards a better planet</p>
          <p>Built with ❤️ for environmental sustainability</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;