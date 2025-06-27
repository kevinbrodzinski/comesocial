
import { openAIService } from './OpenAIService';

export interface VoiceCommand {
  command: string;
  intent: 'navigation' | 'search' | 'action' | 'question';
  parameters: Record<string, any>;
  confidence: number;
}

export interface VoiceResponse {
  text: string;
  shouldSpeak: boolean;
  action?: {
    type: string;
    payload: any;
  };
}

export class VoiceProcessor {
  private recognition: SpeechRecognition | null = null;
  private synthesis: SpeechSynthesis;
  private isListening = false;
  private isProcessing = false;

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.initializeSpeechRecognition();
  }

  private initializeSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognitionConstructor();
      
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';
      this.recognition.maxAlternatives = 1;
    }
  }

  async startListening(): Promise<string> {
    if (!this.recognition) {
      throw new Error('Speech recognition not supported');
    }

    if (this.isListening) {
      throw new Error('Already listening');
    }

    return new Promise((resolve, reject) => {
      this.isListening = true;

      this.recognition!.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log('Voice input:', transcript);
        resolve(transcript);
      };

      this.recognition!.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        reject(new Error(`Speech recognition failed: ${event.error}`));
      };

      this.recognition!.onend = () => {
        this.isListening = false;
      };

      this.recognition!.start();
    });
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  async processVoiceCommand(transcript: string): Promise<VoiceCommand> {
    try {
      const response = await openAIService.chatCompletion([
        {
          role: 'system',
          content: `You are a voice command processor for a nightlife app. Analyze voice commands and classify them.
          Available intents: navigation (go to map, open friends, etc), search (find bars, restaurants), action (check in, message friend), question (what time, how far).
          Respond in JSON with: command, intent, parameters object, confidence (0-1).`
        },
        {
          role: 'user',
          content: `Analyze this voice command: "${transcript}"`
        }
      ], {
        model: 'gpt-4o-mini',
        temperature: 0.2,
        maxTokens: 300
      });

      const command = JSON.parse(response.content);
      
      return {
        command: transcript,
        intent: command.intent || 'question',
        parameters: command.parameters || {},
        confidence: command.confidence || 0.5
      };

    } catch (error) {
      console.error('Voice command processing error:', error);
      return {
        command: transcript,
        intent: 'question',
        parameters: {},
        confidence: 0.3
      };
    }
  }

  async generateVoiceResponse(command: VoiceCommand, context?: any): Promise<VoiceResponse> {
    try {
      const response = await openAIService.chatCompletion([
        {
          role: 'system',
          content: `You are Nova, a helpful nightlife assistant. Generate concise, natural voice responses.
          Keep responses under 50 words for voice output. Be friendly and conversational.
          Include action suggestions when appropriate (navigation, search, etc).`
        },
        {
          role: 'user',
          content: `User said: "${command.command}"
          Intent: ${command.intent}
          Parameters: ${JSON.stringify(command.parameters)}
          Context: ${JSON.stringify(context || {})}`
        }
      ], {
        model: 'gpt-4o-mini',
        temperature: 0.7,
        maxTokens: 200
      });

      const action = this.determineAction(command);

      return {
        text: response.content,
        shouldSpeak: true,
        action
      };

    } catch (error) {
      console.error('Voice response generation error:', error);
      return {
        text: "I'm having trouble processing that. Could you try again?",
        shouldSpeak: true
      };
    }
  }

  private determineAction(command: VoiceCommand): { type: string; payload: any } | undefined {
    switch (command.intent) {
      case 'navigation':
        if (command.parameters.destination) {
          return {
            type: 'navigate',
            payload: { route: command.parameters.destination }
          };
        }
        break;
      case 'search':
        if (command.parameters.query) {
          return {
            type: 'search',
            payload: { query: command.parameters.query }
          };
        }
        break;
      case 'action':
        return {
          type: 'action',
          payload: command.parameters
        };
    }
    return undefined;
  }

  async speak(text: string, rate: number = 1, pitch: number = 1): Promise<void> {
    if (!this.synthesis) {
      throw new Error('Speech synthesis not supported');
    }

    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = 0.8;

      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(new Error(`Speech synthesis failed: ${event.error}`));

      this.synthesis.speak(utterance);
    });
  }

  isSupported(): boolean {
    return !!(this.recognition && this.synthesis);
  }

  getListeningState(): boolean {
    return this.isListening;
  }

  getProcessingState(): boolean {
    return this.isProcessing;
  }
}

export const voiceProcessor = new VoiceProcessor();
