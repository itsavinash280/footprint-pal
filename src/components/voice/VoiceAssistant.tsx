import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Volume2, VolumeX, MessageCircle, Zap } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface VoiceAssistantProps {
  onActivityLogged: (activity: any) => void;
  isListening: boolean;
  setIsListening: (listening: boolean) => void;
}

// Declare SpeechRecognition types
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ onActivityLogged, isListening, setIsListening }) => {
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [response, setResponse] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis>(window.speechSynthesis);

  useEffect(() => {
    // Initialize speech recognition
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        console.log('Speech recognition started');
      };

      recognitionRef.current.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcription = event.results[current][0].transcript;
        setTranscript(transcription);
        
        if (event.results[current].isFinal) {
          processVoiceInput(transcription);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Voice Recognition Error",
          description: "Could not understand speech. Please try again.",
          variant: "destructive"
        });
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const processVoiceInput = async (input: string) => {
    setIsProcessing(true);
    
    // Simple activity parsing (in a real app, this would use AI)
    const lowerInput = input.toLowerCase();
    let activity = null;
    let responseText = '';

    // Transport activities
    if (lowerInput.includes('drove') || lowerInput.includes('car') || lowerInput.includes('drive')) {
      const distance = extractNumber(lowerInput);
      activity = {
        type: 'transport',
        mode: 'car',
        distance: distance || 10,
        co2: (distance || 10) * 0.23 // kg CO2 per km for average car
      };
      responseText = `Got it! I logged ${distance || 10} km of car travel. That's about ${activity.co2.toFixed(1)} kg of CO₂. Next time, consider carpooling or public transport to reduce emissions!`;
    }
    // Energy activities
    else if (lowerInput.includes('electricity') || lowerInput.includes('power') || lowerInput.includes('energy')) {
      const hours = extractNumber(lowerInput);
      activity = {
        type: 'energy',
        usage: hours || 5,
        co2: (hours || 5) * 0.5 // kg CO2 per hour of typical household usage
      };
      responseText = `I've recorded ${hours || 5} hours of electricity usage, producing ${activity.co2.toFixed(1)} kg CO₂. Great job tracking your energy! Try switching to LED bulbs to save more.`;
    }
    // Food activities  
    else if (lowerInput.includes('ate') || lowerInput.includes('food') || lowerInput.includes('meal')) {
      const co2Value = lowerInput.includes('meat') ? 2.5 : lowerInput.includes('vegetarian') ? 0.8 : 1.5;
      activity = {
        type: 'food',
        meal: lowerInput.includes('meat') ? 'meat' : 'mixed',
        co2: co2Value
      };
      responseText = `Meal logged! That contributed ${co2Value} kg CO₂. ${lowerInput.includes('meat') ? 'Consider trying plant-based meals to reduce your food footprint!' : 'Great choice with the plant-based option!'}`;
    }
    else {
      responseText = "I didn't quite catch that activity. Try saying something like 'I drove 15 kilometers' or 'I used electricity for 3 hours'.";
    }

    if (activity) {
      onActivityLogged(activity);
      toast({
        title: "Activity Logged!",
        description: `${activity.type} activity added to your tracker.`,
      });
    }

    setResponse(responseText);
    setTranscript('');
    setIsProcessing(false);
    
    // Speak the response
    speakResponse(responseText);
  };

  const extractNumber = (text: string): number | null => {
    const numbers = text.match(/\d+/);
    return numbers ? parseInt(numbers[0]) : null;
  };

  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      synthRef.current.speak(utterance);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
        setTranscript('');
        setResponse('');
      } else {
        toast({
          title: "Voice Recognition Not Supported",
          description: "Your browser doesn't support speech recognition.",
          variant: "destructive"
        });
      }
    }
  };

  const stopSpeaking = () => {
    synthRef.current.cancel();
    setIsSpeaking(false);
  };

  return (
    <div className="space-y-6">
      {/* Voice Control Panel */}
      <Card className="bg-gradient-voice shadow-glow">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Zap className="w-6 h-6" />
            EcoVoice Assistant
          </CardTitle>
          <CardDescription>
            Say things like "I drove 15 kilometers" or "I used electricity for 3 hours"
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <Button
            onClick={toggleListening}
            size="lg"
            variant={isListening ? "destructive" : "default"}
            className={`w-32 h-32 rounded-full text-lg font-semibold ${
              isListening ? 'animate-pulse bg-gradient-listening' : 'bg-gradient-eco hover:shadow-glow'
            }`}
          >
            {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
          </Button>
          
          <div className="flex justify-center gap-4">
            <Badge variant={isListening ? "default" : "secondary"}>
              {isListening ? 'Listening...' : 'Ready to listen'}
            </Badge>
            {isSpeaking && (
              <Button onClick={stopSpeaking} variant="outline" size="sm">
                <VolumeX className="w-4 h-4 mr-1" />
                Stop
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Live Transcript */}
      {(transcript || isProcessing) && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              {isProcessing ? 'Processing...' : 'What I heard:'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">
              {isProcessing ? 'Analyzing your activity...' : transcript}
            </p>
            {isProcessing && (
              <div className="mt-2">
                <div className="animate-pulse flex space-x-1">
                  <div className="rounded-full bg-primary h-2 w-2"></div>
                  <div className="rounded-full bg-primary h-2 w-2"></div>
                  <div className="rounded-full bg-primary h-2 w-2"></div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Assistant Response */}
      {response && (
        <Card className="bg-gradient-nature shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="w-5 h-5" />
              EcoVoice says:
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-relaxed">{response}</p>
            {isSpeaking && (
              <Badge variant="secondary" className="mt-2">
                <Volume2 className="w-3 h-3 mr-1" />
                Speaking...
              </Badge>
            )}
          </CardContent>
        </Card>
      )}

      {/* Voice Tips */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Voice Commands</CardTitle>
          <CardDescription>Try these example phrases</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              "I drove 25 kilometers today",
              "I used electricity for 4 hours",
              "I ate a meat meal for lunch",
              "I had a vegetarian dinner",
              "I took public transport 10 kilometers",
              "I recycled 2 kg of waste"
            ].map((example, index) => (
              <Badge key={index} variant="outline" className="p-2 text-sm">
                "{example}"
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceAssistant;