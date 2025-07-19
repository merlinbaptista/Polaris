export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

export interface VoiceCommand {
  command: string;
  action: () => void;
  description: string;
}

export class SpeechService {
  private recognition: any;
  private synthesis: SpeechSynthesis;
  private isListening: boolean = false;
  private commands: VoiceCommand[] = [];

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.initializeSpeechRecognition();
  }

  private initializeSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      this.recognition = new SpeechRecognition();
      
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
      this.recognition.maxAlternatives = 1;
    }
  }

  public isSupported(): boolean {
    return !!(this.recognition && this.synthesis);
  }

  public startListening(
    onResult: (result: SpeechRecognitionResult) => void,
    onError?: (error: string) => void
  ): void {
    if (!this.recognition) {
      onError?.('Speech recognition not supported');
      return;
    }

    this.recognition.onresult = (event: any) => {
      const last = event.results.length - 1;
      const result = event.results[last];
      
      onResult({
        transcript: result[0].transcript,
        confidence: result[0].confidence,
        isFinal: result.isFinal
      });

      // Check for voice commands
      if (result.isFinal) {
        this.processVoiceCommand(result[0].transcript);
      }
    };

    this.recognition.onerror = (event: any) => {
      onError?.(event.error);
    };

    this.recognition.onend = () => {
      this.isListening = false;
    };

    this.recognition.start();
    this.isListening = true;
  }

  public stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  public speak(text: string, options?: {
    rate?: number;
    pitch?: number;
    volume?: number;
    voice?: SpeechSynthesisVoice;
  }): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      
      utterance.rate = options?.rate || 0.8;
      utterance.pitch = options?.pitch || 1;
      utterance.volume = options?.volume || 1;
      
      if (options?.voice) {
        utterance.voice = options.voice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(new Error(event.error));

      this.synthesis.speak(utterance);
    });
  }

  public getVoices(): SpeechSynthesisVoice[] {
    return this.synthesis.getVoices();
  }

  public registerCommand(command: VoiceCommand): void {
    this.commands.push(command);
  }

  public registerCommands(commands: VoiceCommand[]): void {
    this.commands.push(...commands);
  }

  private processVoiceCommand(transcript: string): void {
    const normalizedTranscript = transcript.toLowerCase().trim();
    
    for (const command of this.commands) {
      if (normalizedTranscript.includes(command.command.toLowerCase())) {
        command.action();
        break;
      }
    }
  }

  public getRegisteredCommands(): VoiceCommand[] {
    return [...this.commands];
  }

  public clearCommands(): void {
    this.commands = [];
  }
}