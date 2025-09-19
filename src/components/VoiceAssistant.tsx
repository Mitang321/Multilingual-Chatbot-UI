import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Square,
  Waves,
  MessageCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VoiceAssistantProps {
  selectedLanguage: string;
  onVoiceMessage: (message: string) => void;
  onSpeakResponse: (text: string) => void;
  isCompact?: boolean;
}

export function VoiceAssistant({ 
  selectedLanguage,
  onVoiceMessage,
  onSpeakResponse,
  isCompact = false
}: VoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);
  const [error, setError] = useState('');

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number>();

  // Language mappings for speech recognition and synthesis
  const languageMap: Record<string, { speech: string; synthesis: string }> = {
    'en': { speech: 'en-US', synthesis: 'en-US' },
    'hi': { speech: 'hi-IN', synthesis: 'hi-IN' },
    'mr': { speech: 'mr-IN', synthesis: 'mr-IN' },
    'te': { speech: 'te-IN', synthesis: 'te-IN' },
    'ta': { speech: 'ta-IN', synthesis: 'ta-IN' }
  };

  useEffect(() => {
    // Check for speech recognition support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const speechSynthesis = window.speechSynthesis;
    
    if (SpeechRecognition && speechSynthesis) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      synthesisRef.current = speechSynthesis;
      
      // Configure speech recognition
      const recognition = recognitionRef.current;
      recognition.continuous = false;
      recognition.interimResults = true;
      
      recognition.onstart = () => {
        setIsListening(true);
        setError('');
        setTranscript('');
        setupAudioVisualization();
      };
      
      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        setTranscript(finalTranscript || interimTranscript);
        
        if (finalTranscript) {
          onVoiceMessage(finalTranscript);
          setTranscript('');
        }
      };
      
      recognition.onerror = (event) => {
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
        cleanupAudioVisualization();
      };
      
      recognition.onend = () => {
        setIsListening(false);
        cleanupAudioVisualization();
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      cleanupAudioVisualization();
    };
  }, [onVoiceMessage]);

  useEffect(() => {
    // Update language for speech recognition
    if (recognitionRef.current && languageMap[selectedLanguage]) {
      recognitionRef.current.lang = languageMap[selectedLanguage].speech;
    }
  }, [selectedLanguage]);

  const setupAudioVisualization = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
      
      analyserRef.current.fftSize = 256;
      microphoneRef.current.connect(analyserRef.current);
      
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      const updateAudioLevel = () => {
        if (analyserRef.current && isListening) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / bufferLength;
          setAudioLevel(average / 255);
          animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
        }
      };
      
      updateAudioLevel();
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('Microphone access denied');
    }
  };

  const cleanupAudioVisualization = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    microphoneRef.current = null;
    analyserRef.current = null;
    setAudioLevel(0);
  };

  const startListening = () => {
    if (!isSupported || !recognitionRef.current) {
      setError('Speech recognition not supported');
      return;
    }
    
    try {
      recognitionRef.current.start();
    } catch (err) {
      setError('Failed to start speech recognition');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const speakText = (text: string) => {
    if (!synthesisRef.current || !text.trim()) return;
    
    // Cancel any ongoing speech
    synthesisRef.current.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    const langConfig = languageMap[selectedLanguage];
    
    if (langConfig) {
      utterance.lang = langConfig.synthesis;
    }
    
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
    };
    
    synthesisRef.current.speak(utterance);
    onSpeakResponse(text);
  };

  const stopSpeaking = () => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  if (!isSupported) {
    return (
      <div className={`${isCompact ? 'p-2' : 'p-4'} text-center text-muted-foreground`}>
        <MicOff className="h-6 w-6 mx-auto mb-2" />
        <p className="text-sm">Voice features not supported in this browser</p>
      </div>
    );
  }

  if (isCompact) {
    return (
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isListening ? "destructive" : "outline"}
                size="sm"
                onClick={isListening ? stopListening : startListening}
                className="relative"
              >
                {isListening ? (
                  <>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <Mic className="h-4 w-4" />
                    </motion.div>
                  </>
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isListening ? 'Stop listening' : 'Start voice input'}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {isSpeaking && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={stopSpeaking}
                >
                  <VolumeX className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Stop speaking</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    );
  }

  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Waves className="h-5 w-5 text-primary" />
            <h3 className="font-medium">Voice Assistant</h3>
          </div>

          {/* Main Voice Control */}
          <div className="relative">
            <motion.div
              className="relative inline-block"
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant={isListening ? "destructive" : "default"}
                size="lg"
                onClick={isListening ? stopListening : startListening}
                className="relative w-20 h-20 rounded-full shadow-lg"
              >
                <AnimatePresence mode="wait">
                  {isListening ? (
                    <motion.div
                      key="listening"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="flex items-center justify-center"
                    >
                      <Square className="h-8 w-8" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="idle"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="flex items-center justify-center"
                    >
                      <Mic className="h-8 w-8" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>

              {/* Audio Level Visualization */}
              {isListening && (
                <div className="absolute inset-0 rounded-full border-4 border-destructive/20 animate-ping" />
              )}
              
              {isListening && audioLevel > 0 && (
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-destructive"
                  style={{
                    transform: `scale(${1 + audioLevel * 0.5})`,
                    opacity: audioLevel
                  }}
                />
              )}
            </motion.div>

            <p className="text-sm text-muted-foreground mt-2">
              {isListening 
                ? 'Listening... Tap to stop'
                : 'Tap to start voice input'
              }
            </p>
          </div>

          {/* Transcript Display */}
          <AnimatePresence>
            {transcript && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-muted rounded-lg p-3 text-sm"
              >
                <div className="flex items-center gap-2 mb-1">
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {isListening ? 'Listening...' : 'Recognized:'}
                  </span>
                </div>
                <p className="text-foreground">{transcript}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Speaking Controls */}
          <div className="flex items-center justify-center gap-2">
            {isSpeaking ? (
              <Button
                variant="outline"
                size="sm"
                onClick={stopSpeaking}
                className="flex items-center gap-2"
              >
                <VolumeX className="h-4 w-4" />
                Stop Speaking
              </Button>
            ) : (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Volume2 className="h-3 w-3" />
                Voice Output Ready
              </Badge>
            )}
          </div>

          {/* Language Status */}
          <div className="text-xs text-muted-foreground">
            <span>Language: </span>
            <Badge variant="outline" className="text-xs">
              {languageMap[selectedLanguage]?.speech || 'en-US'}
            </Badge>
          </div>

          {/* Error Display */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-xs text-destructive bg-destructive/10 rounded p-2"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}

