import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Leaf, Car, Zap, Utensils, Trash2, Target, TrendingDown, Award, Edit3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, Legend } from 'recharts';

interface DashboardProps {
  onVoiceToggle: () => void;
  isListening: boolean;
}

const CarbonDashboard: React.FC<DashboardProps> = ({ onVoiceToggle, isListening }) => {
  const [todayFootprint, setTodayFootprint] = useState(8.2);
  const [weeklyGoal, setWeeklyGoal] = useState(50);
  const [weeklyProgress, setWeeklyProgress] = useState(32.4);
  const [newGoal, setNewGoal] = useState('');
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);

  // Load weekly goal from localStorage on component mount
  useEffect(() => {
    const savedGoal = localStorage.getItem('weeklyGoal');
    if (savedGoal) {
      setWeeklyGoal(parseFloat(savedGoal));
    }
  }, []);

  const handleGoalUpdate = () => {
    const goalValue = parseFloat(newGoal);
    if (goalValue && goalValue > 0) {
      setWeeklyGoal(goalValue);
      localStorage.setItem('weeklyGoal', goalValue.toString());
      setIsGoalDialogOpen(false);
      setNewGoal('');
    }
  };

  const weeklyData = [
    { day: 'Mon', footprint: 7.2 },
    { day: 'Tue', footprint: 9.1 },
    { day: 'Wed', footprint: 6.8 },
    { day: 'Thu', footprint: 8.9 },
    { day: 'Fri', footprint: 8.2 },
    { day: 'Sat', footprint: 5.4 },
    { day: 'Sun', footprint: 4.8 }
  ];

  const categoryData = [
    { category: 'Transport', co2: 4.2, icon: Car, color: 'text-warning' },
    { category: 'Energy', co2: 2.1, icon: Zap, color: 'text-primary' },
    { category: 'Food', co2: 1.5, icon: Utensils, color: 'text-success' },
    { category: 'Waste', co2: 0.4, icon: Trash2, color: 'text-muted-foreground' }
  ];

  // Pie chart data for daily breakdown
  const dailyPieData = [
    { name: 'Transport', value: 4.2, fill: 'hsl(35 80% 55%)' },
    { name: 'Energy', value: 2.1, fill: 'hsl(145 70% 35%)' },
    { name: 'Food', value: 1.5, fill: 'hsl(120 60% 50%)' },
    { name: 'Waste', value: 0.4, fill: 'hsl(155 15% 50%)' }
  ];

  // Pie chart data for weekly breakdown
  const weeklyPieData = [
    { name: 'Transport', value: 29.4, fill: 'hsl(35 80% 55%)' },
    { name: 'Energy', value: 14.7, fill: 'hsl(145 70% 35%)' },
    { name: 'Food', value: 10.5, fill: 'hsl(120 60% 50%)' },
    { name: 'Waste', value: 2.8, fill: 'hsl(155 15% 50%)' }
  ];

  const achievements = [
    { title: 'Eco Warrior', description: 'Reduced footprint by 15%', icon: Award },
    { title: 'Green Week', description: 'Below target for 7 days', icon: Leaf },
    { title: 'Public Transport Pro', description: 'Used transit 5 times', icon: Car }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center py-8 bg-gradient-nature rounded-3xl">
        <h1 className="text-4xl font-bold mb-2">Your Carbon Journey</h1>
        <p className="text-muted-foreground text-lg">Track, reduce, and celebrate your eco-impact</p>
      </div>

      {/* Today's Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-eco text-primary-foreground shadow-glow">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">{todayFootprint} kg</CardTitle>
            <CardDescription className="text-primary-foreground/80">CO₂ Today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <Badge variant="secondary" className="bg-white/20 text-white">
                <TrendingDown className="w-4 h-4 mr-1" />
                -12% vs yesterday
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Weekly Goal
              </div>
              <Dialog open={isGoalDialogOpen} onOpenChange={setIsGoalDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Edit3 className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Set Weekly Carbon Goal</DialogTitle>
                    <DialogDescription>
                      Set your weekly carbon footprint goal in kg CO₂
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      type="number"
                      placeholder={`Current: ${weeklyGoal} kg`}
                      value={newGoal}
                      onChange={(e) => setNewGoal(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Button onClick={handleGoalUpdate} className="flex-1">
                        Update Goal
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setIsGoalDialogOpen(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardTitle>
            <CardDescription>Stay under {weeklyGoal} kg this week</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={(weeklyProgress / weeklyGoal) * 100} className="mb-2" />
            <p className="text-sm text-muted-foreground">
              {weeklyProgress} / {weeklyGoal} kg ({Math.round(((weeklyGoal - weeklyProgress) / weeklyGoal) * 100)}% to go)
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Voice Assistant</CardTitle>
            <CardDescription>Track activities hands-free</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={onVoiceToggle}
              variant={isListening ? "destructive" : "default"}
              className={`w-full ${isListening ? 'animate-pulse' : ''}`}
            >
              {isListening ? 'Listening...' : 'Start Voice Input'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Chart */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Weekly Carbon Footprint</CardTitle>
          <CardDescription>Your daily CO₂ emissions this week</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`${value} kg CO₂`, 'Footprint']}
                labelFormatter={(label) => `${label}`}
              />
              <Area 
                type="monotone" 
                dataKey="footprint" 
                stroke="hsl(var(--primary))" 
                fill="hsl(var(--primary) / 0.2)" 
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Category Breakdown Pie Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Daily Footprint Breakdown</CardTitle>
            <CardDescription>Today's CO₂ emissions by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dailyPieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dailyPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} kg CO₂`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Weekly Footprint Breakdown</CardTitle>
            <CardDescription>This week's CO₂ emissions by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={weeklyPieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {weeklyPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} kg CO₂`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categoryData.map((category) => (
          <Card key={category.category} className="shadow-card hover:shadow-soft transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <category.icon className={`w-6 h-6 ${category.color}`} />
                <span className="text-2xl font-bold">{category.co2}</span>
              </div>
              <h3 className="font-semibold">{category.category}</h3>
              <p className="text-sm text-muted-foreground">kg CO₂ today</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Achievements */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Recent Achievements
          </CardTitle>
          <CardDescription>Keep up the great eco-work!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {achievements.map((achievement, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-accent rounded-lg">
                <achievement.icon className="w-8 h-8 text-success" />
                <div>
                  <h4 className="font-semibold">{achievement.title}</h4>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CarbonDashboard;