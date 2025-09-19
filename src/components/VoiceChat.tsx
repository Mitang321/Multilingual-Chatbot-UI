import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Badge } from './ui/badge';
import { 
  Mic, 
  MicOff, 
  X, 
  Volume2,
  VolumeX,
  MessageCircle,
  Bot,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VoiceChatProps {
  selectedLanguage: string;
  onVoiceMessage: (message: string) => void;
  onSpeakResponse: (text: string) => void;
  lastBotResponse?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VoiceChat({ 
  selectedLanguage,
  onVoiceMessage,
  onSpeakResponse,
  lastBotResponse = '',
  open,
  onOpenChange
}: VoiceChatProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);
  const [error, setError] = useState('');
  const [isInitializing, setIsInitializing] = useState(false);
  const [botResponse, setBotResponse] = useState('');
  const [showBotResponse, setShowBotResponse] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);
  const animationFrameRef = useRef<number>();

  // Language mappings for speech recognition and synthesis
  const languageMap: Record<string, { speech: string; synthesis: string }> = {
    'en': { speech: 'en-US', synthesis: 'en-US' },
    'hi': { speech: 'hi-IN', synthesis: 'hi-IN' },
    'mr': { speech: 'mr-IN', synthesis: 'mr-IN' },
    'te': { speech: 'te-IN', synthesis: 'te-IN' },
    'ta': { speech: 'ta-IN', synthesis: 'ta-IN' }
  };

  // Initialize speech recognition and synthesis only once
  useEffect(() => {
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
        setIsInitializing(false);
      };
      
      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalText = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const text = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalText += text;
          } else {
            interimTranscript += text;
          }
        }
        
        // Show interim results in real-time
        setTranscript(interimTranscript);
        
        if (finalText) {
          setFinalTranscript(finalText);
          setTranscript(''); // Clear interim transcript
          
          // Send the message and prepare for bot response
          onVoiceMessage(finalText);
          
          // Show the final transcript for a moment before showing bot response
          setTimeout(() => {
            setFinalTranscript('');
            // Don't auto-close, let user see the interaction
          }, 2000);
        }
      };
      
      recognition.onerror = (event) => {
        setError(`Recognition error: ${event.error}`);
        setIsListening(false);
        setIsInitializing(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
        setIsInitializing(false);
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Update language for speech recognition
  useEffect(() => {
    if (recognitionRef.current && languageMap[selectedLanguage]) {
      recognitionRef.current.lang = languageMap[selectedLanguage].speech;
    }
  }, [selectedLanguage]);

  // Cleanup when dialog closes
  useEffect(() => {
    if (!open) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      setIsListening(false);
      setIsInitializing(false);
      setTranscript('');
      setFinalTranscript('');
      setBotResponse('');
      setShowBotResponse(false);
      setError('');
      setAudioLevel(0);
    }
  }, [open]);

  const startListening = async () => {
    if (!isSupported || !recognitionRef.current) {
      setError('Speech recognition not supported');
      return;
    }
    
    setIsInitializing(true);
    setError('');
    
    try {
      // Simple audio level animation without actual microphone access
      const animateAudioLevel = () => {
        if (isListening) {
          const randomLevel = Math.random() * 0.5 + 0.2;
          setAudioLevel(randomLevel);
          animationFrameRef.current = requestAnimationFrame(animateAudioLevel);
        }
      };
      
      recognitionRef.current.start();
      animateAudioLevel();
    } catch (err) {
      setError('Failed to start speech recognition');
      setIsInitializing(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setAudioLevel(0);
  };

  const speakText = (text: string) => {
    if (!synthesisRef.current || !text.trim()) return;
    
    // Cancel any ongoing speech
    synthesisRef.current.cancel();
    
    // Show bot response text
    setBotResponse(text);
    setShowBotResponse(true);
    
    const utterance = new SpeechSynthesisUtterance(text);
    const langConfig = languageMap[selectedLanguage];
    
    if (langConfig) {
      utterance.lang = langConfig.synthesis;
    }
    
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    utterance.onstart = () => {
      setIsSpeaking(true);
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
      // Keep the bot response visible for a moment after speaking ends
      setTimeout(() => {
        setShowBotResponse(false);
        setBotResponse('');
      }, 2000);
    };
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
      setShowBotResponse(false);
      setBotResponse('');
    };
    
    synthesisRef.current.speak(utterance);
    onSpeakResponse(text);
  };

  const stopSpeaking = () => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
      setIsSpeaking(false);
      setShowBotResponse(false);
      setBotResponse('');
    }
  };

  // Auto-close when not supported
  useEffect(() => {
    if (open && !isSupported) {
      const timeout = setTimeout(() => onOpenChange(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [open, isSupported, onOpenChange]);

  // Auto-speak new bot responses when they come in
  useEffect(() => {
    if (lastBotResponse && open && !isListening && lastBotResponse !== botResponse) {
      const timeout = setTimeout(() => {
        speakText(lastBotResponse);
      }, 1000); // Wait a moment after dialog opens
      
      return () => clearTimeout(timeout);
    }
  }, [lastBotResponse, open, isListening]);

  if (!isSupported) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle className="sr-only">Voice Features Not Supported</DialogTitle>
          <DialogDescription className="sr-only">
            Your browser doesn't support voice features. Please use a modern browser like Chrome or Safari.
          </DialogDescription>
          <div className="text-center py-8">
            <MicOff className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="mb-2">Voice features not supported</h3>
            <p className="text-sm text-muted-foreground">
              Your browser doesn't support voice features. Please use a modern browser like Chrome or Safari.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg border-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-0">
        <DialogTitle className="sr-only">Voice Assistant</DialogTitle>
        <DialogDescription className="sr-only">
          ChatGPT-style voice interface for multilingual campus assistant. Speak to interact with the bot and receive voice responses.
        </DialogDescription>
        <div className="flex flex-col items-center justify-center py-12 px-8 space-y-8">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 rounded-full h-8 w-8 p-0 hover:bg-muted/50"
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Main Voice Button - ChatGPT Style */}
          <div className="relative">
            <motion.div
              className="relative inline-block"
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={isListening ? stopListening : startListening}
                disabled={isInitializing}
                className={`relative w-32 h-32 rounded-full shadow-2xl transition-all duration-300 ${
                  isListening 
                    ? 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white' 
                    : isSpeaking 
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
                    : 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-700 dark:hover:to-gray-800'
                }`}
              >
                <AnimatePresence mode="wait">
                  {isInitializing ? (
                    <motion.div
                      key="initializing"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="flex items-center justify-center"
                    >
                      <div className="w-8 h-8 border-3 border-current border-t-transparent rounded-full animate-spin" />
                    </motion.div>
                  ) : isListening ? (
                    <motion.div
                      key="listening"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="flex items-center justify-center"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <Mic className="h-12 w-12" />
                      </motion.div>
                    </motion.div>
                  ) : isSpeaking ? (
                    <motion.div
                      key="speaking"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="flex items-center justify-center"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <Volume2 className="h-12 w-12" />
                      </motion.div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="idle"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="flex items-center justify-center"
                    >
                      <Mic className="h-12 w-12" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>

              {/* Pulsing Rings - ChatGPT Style */}
              {(isListening || isSpeaking) && (
                <>
                  <motion.div
                    className={`absolute inset-0 rounded-full ${
                      isListening ? 'border-4 border-red-400/40' : 'border-4 border-blue-400/40'
                    }`}
                    animate={{
                      scale: [1, 1.4],
                      opacity: [0.6, 0]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeOut"
                    }}
                  />
                  <motion.div
                    className={`absolute inset-0 rounded-full ${
                      isListening ? 'border-4 border-red-400/60' : 'border-4 border-blue-400/60'
                    }`}
                    animate={{
                      scale: [1, 1.25],
                      opacity: [0.8, 0]
                    }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      ease: "easeOut",
                      delay: 0.2
                    }}
                  />
                  {audioLevel > 0.1 && isListening && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-4 border-red-500/80"
                      style={{
                        transform: `scale(${1 + audioLevel * 0.3})`,
                        opacity: audioLevel * 0.9
                      }}
                    />
                  )}
                </>
              )}
            </motion.div>
          </div>

          {/* Transcript Display - ChatGPT Style */}
          <div className="w-full max-w-md min-h-[80px] flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {transcript && (
                <motion.div
                  key="interim"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-muted/30 backdrop-blur-sm rounded-2xl px-6 py-4 text-center border border-border/50"
                >
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground font-medium">You're saying</span>
                  </div>
                  <p className="text-foreground leading-relaxed">{transcript}</p>
                </motion.div>
              )}
              
              {finalTranscript && (
                <motion.div
                  key="final"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-primary/10 backdrop-blur-sm rounded-2xl px-6 py-4 text-center border border-primary/20"
                >
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <User className="h-4 w-4 text-primary" />
                    <span className="text-sm text-primary font-medium">You said</span>
                  </div>
                  <p className="text-foreground leading-relaxed font-medium">{finalTranscript}</p>
                </motion.div>
              )}

              {showBotResponse && botResponse && (
                <motion.div
                  key="response"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 backdrop-blur-sm rounded-2xl px-6 py-4 text-center border border-blue-200 dark:border-blue-800"
                >
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <motion.div
                      animate={isSpeaking ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </motion.div>
                    <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                      {isSpeaking ? 'Assistant is speaking' : 'Assistant said'}
                    </span>
                  </div>
                  <p className="text-foreground leading-relaxed">{botResponse}</p>
                </motion.div>
              )}

              {!transcript && !finalTranscript && !showBotResponse && (
                <motion.div
                  key="prompt"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center space-y-3"
                >
                  <h3 className="text-xl font-medium text-foreground">
                    {isInitializing ? 'Preparing...' :
                     isListening ? 'Listening...' : 
                     isSpeaking ? 'Assistant is speaking' :
                     'Tap to start talking'}
                  </h3>
                  <p className="text-muted-foreground">
                    {isInitializing ? 'Getting your microphone ready' :
                     isListening ? 'I can hear you, go ahead' : 
                     isSpeaking ? 'Playing response' :
                     'Press and hold the button to talk'}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            {/* Language Badge */}
            <Badge variant="outline" className="text-sm px-3 py-1">
              {languageMap[selectedLanguage]?.speech || 'en-US'}
            </Badge>

            {/* Stop Speaking Button */}
            <AnimatePresence>
              {isSpeaking && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={stopSpeaking}
                    className="flex items-center gap-2"
                  >
                    <VolumeX className="h-4 w-4" />
                    Stop
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Audio Visualization */}
          {isListening && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center justify-center gap-1.5"
            >
              {[...Array(7)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1.5 bg-red-500 rounded-full"
                  animate={{
                    height: [8, 12 + (audioLevel * 24), 8]
                  }}
                  transition={{
                    duration: 0.4 + i * 0.1,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </motion.div>
          )}

          {/* Error Display */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 text-center max-w-md"
              >
                <p className="text-destructive text-sm">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}