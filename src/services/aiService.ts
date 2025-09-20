interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
  }>;
}

class AIService {
  private apiKey: string;
  private baseUrl = 'https://openrouter.ai/api/v1/chat/completions';
  private model = 'x-ai/grok-4-fast:free';
  private knowledgeBase: string = '';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  setKnowledgeBase(knowledgeBase: string) {
    this.knowledgeBase = knowledgeBase;
  }

  private getSystemPrompt(language: string): string {
    const languageInstructions = {
      'en': 'Respond in English',
      'hi': 'Respond in Hindi (हिंदी)',
      'mr': 'Respond in Marathi (मराठी)',
      'te': 'Respond in Telugu (తెలుగు)',
      'ta': 'Respond in Tamil (தமிழ்)'
    };

    return `You are a helpful campus multilingual assistant for a college/university. Your primary role is to help students, faculty, and staff with campus-related queries.

IMPORTANT INSTRUCTIONS:
1. ${languageInstructions[language as keyof typeof languageInstructions] || 'Respond in English'}
2. Use the knowledge base provided below to answer questions accurately
3. If you don't find the exact answer in the knowledge base, provide helpful general guidance
4. Be concise but comprehensive in your responses
5. Always maintain a friendly and professional tone
6. If asked about topics not related to campus/education, politely redirect to campus-related topics

KNOWLEDGE BASE:
${this.knowledgeBase}

Remember to search through the knowledge base thoroughly before responding. If the information isn't available, say so and offer to help with related campus topics.`;
  }

  async sendMessage(message: string, language: string = 'en', conversationHistory: ChatMessage[] = []): Promise<string> {
    try {
      const messages: ChatMessage[] = [
        {
          role: 'system',
          content: this.getSystemPrompt(language)
        },
        ...conversationHistory.slice(-10), // Keep last 10 messages for context
        {
          role: 'user',
          content: message
        }
      ];

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Campus Multilingual Assistant',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.model,
          messages: messages,
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data: OpenRouterResponse = await response.json();
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error('No response from AI model');
      }

      return data.choices[0].message.content;
    } catch (error) {
      console.error('AI Service Error:', error);
      
      // Fallback responses based on language
      const fallbackResponses = {
        'en': "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again in a moment, or contact the campus help desk for immediate assistance.",
        'hi': "मुझे खुशी है कि आपने पूछा, लेकिन अभी मुझे अपने ज्ञान आधार से जुड़ने में समस्या हो रही है। कृपया कुछ देर बाद पुनः प्रयास करें।",
        'mr': "मला माफ करा, मला सध्या माझ्या ज्ञान आधाराशी जोडण्यात अडचण येत आहे. कृपया काही वेळानंतर पुन्हा प्रयत्न करा.",
        'te': "క్షమించండి, ప్రస్తుతం నా జ్ఞాన స్థావరంతో కనెక్ట్ అవ్వడంలో సమస్య ఉంది. దయచేసి కొంత సమయం తర్వాత మళ్లీ ప్రయత్నించండి.",
        'ta': "மன்னிக்கவும், தற்போது எனது அறிவுத் தளத்துடன் இணைப்பதில் சிக்கல் உள்ளது. தயவுசெய்து சிறிது நேரம் கழித்து மீண்டும் முயற்சிக்கவும்."
      };

      return fallbackResponses[language as keyof typeof fallbackResponses] || fallbackResponses['en'];
    }
  }
}

export default AIService;