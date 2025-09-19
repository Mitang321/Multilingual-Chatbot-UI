import React, { useState } from 'react';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Mic, Waves } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { VoiceChat } from './VoiceChat';

interface VoiceButtonProps {
  selectedLanguage: string;
  onVoiceMessage: (message: string) => void;
  onSpeakResponse: (text: string) => void;
  lastBotResponse?: string;
  className?: string;
  variant?: 'floating' | 'inline';
}

export function VoiceButton({ 
  selectedLanguage,
  onVoiceMessage,
  onSpeakResponse,
  lastBotResponse = '',
  className = '',
  variant = 'floating'
}: VoiceButtonProps) {
  const [isVoiceChatOpen, setIsVoiceChatOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleOpenVoiceChat = () => {
    setIsVoiceChatOpen(true);
  };

  if (variant === 'inline') {
    return (
      <>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenVoiceChat}
                className={className}
              >
                <Mic className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Voice Assistant
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <VoiceChat
          selectedLanguage={selectedLanguage}
          onVoiceMessage={onVoiceMessage}
          onSpeakResponse={onSpeakResponse}
          lastBotResponse={lastBotResponse}
          open={isVoiceChatOpen}
          onOpenChange={setIsVoiceChatOpen}
        />
      </>
    );
  }

  return (
    <>
      {/* Floating Voice Button */}
      <motion.div
        className={`fixed bottom-6 right-6 z-50 ${className}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20,
          delay: 0.5
        }}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
              >
                <Button
                  size="lg"
                  onClick={handleOpenVoiceChat}
                  className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 border-2 border-background/20"
                >
                  <AnimatePresence mode="wait">
                    {isHovered ? (
                      <motion.div
                        key="waves"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Waves className="h-6 w-6" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="mic"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Mic className="h-6 w-6" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent side="left" sideOffset={10}>
              <div className="flex items-center gap-2">
                <Waves className="h-4 w-4" />
                <span>Voice Assistant</span>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Floating background effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-blue-500/20 -z-10"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.1, 0.4]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Additional glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-blue-400/10 -z-20"
          animate={{
            scale: [1, 1.6, 1],
            opacity: [0.2, 0, 0.2]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </motion.div>

      {/* Voice Chat Modal */}
      <VoiceChat
        selectedLanguage={selectedLanguage}
        onVoiceMessage={onVoiceMessage}
        onSpeakResponse={onSpeakResponse}
        lastBotResponse={lastBotResponse}
        open={isVoiceChatOpen}
        onOpenChange={setIsVoiceChatOpen}
      />
    </>
  );
}