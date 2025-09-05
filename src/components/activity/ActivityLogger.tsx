import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Car, Zap, Utensils, Trash2, Plus, Calculator } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ActivityLoggerProps {
  onActivityLogged: (activity: any) => void;
}

const ActivityLogger: React.FC<ActivityLoggerProps> = ({ onActivityLogged }) => {
  const [transport, setTransport] = useState({ mode: '', distance: '', fuel: 'petrol' });
  const [energy, setEnergy] = useState({ usage: '', type: 'electricity' });
  const [food, setFood] = useState({ type: '', portions: '1' });
  const [waste, setWaste] = useState({ type: '', weight: '' });

  const calculateCO2 = {
    transport: (mode: string, distance: number, fuel: string) => {
      const factors: { [key: string]: { [fuel: string]: number } } = {
        car: { petrol: 0.23, diesel: 0.27, electric: 0.05 },
        bus: { diesel: 0.08 },
        train: { electric: 0.04 },
        motorcycle: { petrol: 0.18 },
        bicycle: { none: 0 },
        walking: { none: 0 }
      };
      return distance * (factors[mode]?.[fuel] || 0.2);
    },
    energy: (usage: number, type: string) => {
      const factors: { [key: string]: number } = {
        electricity: 0.5,
        gas: 0.2,
        heating: 0.3
      };
      return usage * (factors[type] || 0.5);
    },
    food: (type: string, portions: number) => {
      const factors: { [key: string]: number } = {
        beef: 27,
        lamb: 20,
        pork: 12,
        chicken: 6.9,
        fish: 6.1,
        vegetarian: 3.8,
        vegan: 2.3
      };
      return portions * (factors[type] || 5);
    },
    waste: (type: string, weight: number) => {
      const factors: { [key: string]: number } = {
        general: 0.5,
        plastic: 3.4,
        food: 0.3,
        paper: 0.9,
        glass: 0.2
      };
      return weight * (factors[type] || 0.5);
    }
  };

  const logTransport = () => {
    if (!transport.mode || !transport.distance) {
      toast({ title: "Please fill all transport fields", variant: "destructive" });
      return;
    }
    
    const distance = parseFloat(transport.distance);
    const co2 = calculateCO2.transport(transport.mode, distance, transport.fuel);
    
    onActivityLogged({
      type: 'transport',
      mode: transport.mode,
      distance,
      fuel: transport.fuel,
      co2,
      timestamp: new Date()
    });

    toast({
      title: "Transport Activity Logged",
      description: `${distance}km by ${transport.mode} = ${co2.toFixed(1)} kg CO₂`
    });

    setTransport({ mode: '', distance: '', fuel: 'petrol' });
  };

  const logEnergy = () => {
    if (!energy.usage) {
      toast({ title: "Please enter energy usage", variant: "destructive" });
      return;
    }

    const usage = parseFloat(energy.usage);
    const co2 = calculateCO2.energy(usage, energy.type);

    onActivityLogged({
      type: 'energy',
      energyType: energy.type,
      usage,
      co2,
      timestamp: new Date()
    });

    toast({
      title: "Energy Activity Logged",
      description: `${usage} units of ${energy.type} = ${co2.toFixed(1)} kg CO₂`
    });

    setEnergy({ usage: '', type: 'electricity' });
  };

  const logFood = () => {
    if (!food.type) {
      toast({ title: "Please select food type", variant: "destructive" });
      return;
    }

    const portions = parseFloat(food.portions);
    const co2 = calculateCO2.food(food.type, portions);

    onActivityLogged({
      type: 'food',
      foodType: food.type,
      portions,
      co2,
      timestamp: new Date()
    });

    toast({
      title: "Food Activity Logged", 
      description: `${portions} portion(s) of ${food.type} = ${co2.toFixed(1)} kg CO₂`
    });

    setFood({ type: '', portions: '1' });
  };

  const logWaste = () => {
    if (!waste.type || !waste.weight) {
      toast({ title: "Please fill all waste fields", variant: "destructive" });
      return;
    }

    const weight = parseFloat(waste.weight);
    const co2 = calculateCO2.waste(waste.type, weight);

    onActivityLogged({
      type: 'waste',
      wasteType: waste.type,
      weight,
      co2,
      timestamp: new Date()
    });

    toast({
      title: "Waste Activity Logged",
      description: `${weight}kg of ${waste.type} waste = ${co2.toFixed(1)} kg CO₂`
    });

    setWaste({ type: '', weight: '' });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Log Your Activities</h2>
        <p className="text-muted-foreground">Track your daily carbon footprint</p>
      </div>

      <Tabs defaultValue="transport" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="transport" className="flex items-center gap-2">
            <Car className="w-4 h-4" />
            Transport
          </TabsTrigger>
          <TabsTrigger value="energy" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Energy
          </TabsTrigger>
          <TabsTrigger value="food" className="flex items-center gap-2">
            <Utensils className="w-4 h-4" />
            Food
          </TabsTrigger>
          <TabsTrigger value="waste" className="flex items-center gap-2">
            <Trash2 className="w-4 h-4" />
            Waste
          </TabsTrigger>
        </TabsList>

        <TabsContent value="transport">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="w-5 h-5" />
                Transportation
              </CardTitle>
              <CardDescription>
                Log your travel activities and transport modes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="transport-mode">Transport Mode</Label>
                  <Select value={transport.mode} onValueChange={(value) => setTransport({...transport, mode: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="car">Car</SelectItem>
                      <SelectItem value="bus">Bus</SelectItem>
                      <SelectItem value="train">Train</SelectItem>
                      <SelectItem value="motorcycle">Motorcycle</SelectItem>
                      <SelectItem value="bicycle">Bicycle</SelectItem>
                      <SelectItem value="walking">Walking</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="distance">Distance (km)</Label>
                  <Input
                    id="distance"
                    type="number"
                    placeholder="0"
                    value={transport.distance}
                    onChange={(e) => setTransport({...transport, distance: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="fuel-type">Fuel Type</Label>
                  <Select value={transport.fuel} onValueChange={(value) => setTransport({...transport, fuel: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="petrol">Petrol</SelectItem>
                      <SelectItem value="diesel">Diesel</SelectItem>
                      <SelectItem value="electric">Electric</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={logTransport} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Log Transport Activity
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="energy">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Energy Usage
              </CardTitle>
              <CardDescription>
                Track your household energy consumption
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="energy-type">Energy Type</Label>
                  <Select value={energy.type} onValueChange={(value) => setEnergy({...energy, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electricity">Electricity (kWh)</SelectItem>
                      <SelectItem value="gas">Natural Gas (m³)</SelectItem>
                      <SelectItem value="heating">Heating Oil (L)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="energy-usage">Usage Amount</Label>
                  <Input
                    id="energy-usage"
                    type="number"
                    placeholder="0"
                    value={energy.usage}
                    onChange={(e) => setEnergy({...energy, usage: e.target.value})}
                  />
                </div>
              </div>
              <Button onClick={logEnergy} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Log Energy Activity
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="food">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Utensils className="w-5 h-5" />
                Food Consumption
              </CardTitle>
              <CardDescription>
                Log your meals and dietary choices
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="food-type">Food Type</Label>
                  <Select value={food.type} onValueChange={(value) => setFood({...food, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select food type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beef">Beef</SelectItem>
                      <SelectItem value="lamb">Lamb</SelectItem>
                      <SelectItem value="pork">Pork</SelectItem>
                      <SelectItem value="chicken">Chicken</SelectItem>
                      <SelectItem value="fish">Fish</SelectItem>
                      <SelectItem value="vegetarian">Vegetarian</SelectItem>
                      <SelectItem value="vegan">Vegan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="portions">Portions</Label>
                  <Input
                    id="portions"
                    type="number"
                    placeholder="1"
                    value={food.portions}
                    onChange={(e) => setFood({...food, portions: e.target.value})}
                  />
                </div>
              </div>
              <Button onClick={logFood} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Log Food Activity
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="waste">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trash2 className="w-5 h-5" />
                Waste Production
              </CardTitle>
              <CardDescription>
                Track your waste generation and recycling
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="waste-type">Waste Type</Label>
                  <Select value={waste.type} onValueChange={(value) => setWaste({...waste, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select waste type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Waste</SelectItem>
                      <SelectItem value="plastic">Plastic</SelectItem>
                      <SelectItem value="food">Food Waste</SelectItem>
                      <SelectItem value="paper">Paper</SelectItem>
                      <SelectItem value="glass">Glass</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="waste-weight">Weight (kg)</Label>
                  <Input
                    id="waste-weight"
                    type="number"
                    placeholder="0"
                    value={waste.weight}
                    onChange={(e) => setWaste({...waste, weight: e.target.value})}
                  />
                </div>
              </div>
              <Button onClick={logWaste} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Log Waste Activity
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* CO2 Calculator Info */}
      <Card className="bg-gradient-nature shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Emission Factors (kg CO₂)
          </CardTitle>
          <CardDescription>How we calculate your carbon footprint</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Transport (per km)</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>Car (petrol): 0.23</li>
                <li>Car (diesel): 0.27</li>
                <li>Bus: 0.08</li>
                <li>Train: 0.04</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Energy (per unit)</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>Electricity: 0.5 kWh</li>
                <li>Gas: 0.2 m³</li>
                <li>Heating oil: 0.3 L</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Food (per portion)</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>Beef: 27</li>
                <li>Chicken: 6.9</li>
                <li>Vegetarian: 3.8</li>
                <li>Vegan: 2.3</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Waste (per kg)</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>Plastic: 3.4</li>
                <li>Paper: 0.9</li>
                <li>General: 0.5</li>
                <li>Food: 0.3</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityLogger;