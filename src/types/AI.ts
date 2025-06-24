export type AIProvider = 'gemini' | 'cohere' | 'huggingface';

export interface AIConfig {
  provider: AIProvider;
  apiKey: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AIResponse {
  text: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface AIService {
  generateText(prompt: string, config?: Partial<AIConfig>): Promise<AIResponse>;
  improveText(text: string, instructions?: string): Promise<AIResponse>;
  continueText(text: string, length?: number): Promise<AIResponse>;
  summarizeText(text: string, maxLength?: number): Promise<AIResponse>;
  testConnection(): Promise<boolean>;
}

export interface AISettings {
  provider: AIProvider;
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
  enabled: boolean;
}

export const DEFAULT_AI_SETTINGS: AISettings = {
  provider: 'gemini',
  apiKey: '',
  model: 'gemini-1.5-flash',
  temperature: 0.7,
  maxTokens: 1000,
  enabled: false,
};

export const AI_MODELS = {
  gemini: [
    'gemini-1.5-flash',
    'gemini-1.5-pro',
    'gemini-1.0-pro',
  ],
  cohere: [
    'command-r-plus',
    'command-r',
    'command',
  ],
  huggingface: [
    'microsoft/DialoGPT-large',
    'google/flan-t5-large',
    'facebook/blenderbot-400M-distill',
  ],
} as const;