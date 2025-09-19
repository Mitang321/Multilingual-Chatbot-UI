import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { VoiceButton } from './VoiceButton';
import { Volume2, Headphones, Info } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

export function VoiceDemo() {
  const [lastVoiceMessage, setLastVoiceMessage] = useState('');
  const [lastSpokenText, setLastSpokenText] = useState('');
  const [botResponse, setBotResponse] = useState('');

  const handleVoiceMessage = (message: string) => {
    setLastVoiceMessage(message);
    console.log('Voice message received:', message);
    
    // Simulate a bot response after a delay
    setTimeout(() => {
      const responses = [
        "I understand you said: " + message + ". That's a great question!",
        "Thank you for asking about " + message + ". I'm here to help!",
        "Based on what you said about " + message + ", I can provide more information."
      ];
      const response = responses[Math.floor(Math.random() * responses.length)];
      setBotResponse(response);
    }, 1500);
  };

  const handleSpeakResponse = (text: string) => {
    setLastSpokenText(text);
    console.log('Speaking response:', text);
  };

  const testSpeak = () => {
    const testText = "Hello! This is a test of the new ChatGPT-style voice interface. You can now see your speech transcribed in real-time, and I'll respond with voice too!";
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(testText);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      window.speechSynthesis.speak(utterance);
      setLastSpokenText(testText);
    }
  };

  return (
    <div className="space-y-6">
      {/* Info Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <p>Voice features require microphone access and modern browser support.</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="outline">Chrome/Edge ✓</Badge>
              <Badge variant="outline">Firefox ✓</Badge>
              <Badge variant="outline">Safari (limited) ⚠️</Badge>
            </div>
          </div>
        </AlertDescription>
      </Alert>

      {/* Main Voice Assistant */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="h-5 w-5" />
              Voice Assistant Demo
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Click the button below to test the new ChatGPT-style voice interface
            </p>
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Experience the new ChatGPT-style voice interface with:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Real-time speech transcription</li>
                <li>• Visual voice animations</li>
                <li>• Automatic bot response speaking</li>
                <li>• Clean, modern interface</li>
              </ul>
            </div>
            <VoiceButton
              selectedLanguage="en"
              onVoiceMessage={handleVoiceMessage}
              onSpeakResponse={handleSpeakResponse}
              lastBotResponse={botResponse}
              variant="inline"
              className="h-16 w-16 rounded-full"
            />
          </CardContent>
        </Card>

        {/* Status and Test Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Headphones className="h-5 w-5" />
                Voice Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Last Voice Input:
                </label>
                <div className="mt-1 p-2 bg-muted rounded text-sm">
                  {lastVoiceMessage || 'No voice input yet...'}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Bot Response:
                </label>
                <div className="mt-1 p-2 bg-muted rounded text-sm">
                  {botResponse || 'No bot response yet...'}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Last Spoken Output:
                </label>
                <div className="mt-1 p-2 bg-muted rounded text-sm">
                  {lastSpokenText || 'No speech output yet...'}
                </div>
              </div>

              <Button 
                onClick={testSpeak}
                className="w-full flex items-center gap-2"
                variant="outline"
              >
                <Volume2 className="h-4 w-4" />
                Test Text-to-Speech
              </Button>
            </CardContent>
          </Card>

          {/* Browser Support Info */}
          <Card>
            <CardHeader>
              <CardTitle>Browser Support</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Speech Recognition:</span>
                  <Badge variant={
                    'webkitSpeechRecognition' in window || 'SpeechRecognition' in window 
                      ? 'default' : 'destructive'
                  }>
                    {('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) 
                      ? 'Supported' : 'Not Supported'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Speech Synthesis:</span>
                  <Badge variant={'speechSynthesis' in window ? 'default' : 'destructive'}>
                    {'speechSynthesis' in window ? 'Supported' : 'Not Supported'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Microphone Access:</span>
                  <Badge variant={'mediaDevices' in navigator ? 'default' : 'destructive'}>
                    {'mediaDevices' in navigator ? 'Available' : 'Not Available'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}