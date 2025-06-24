import type { AIService, AIConfig, AIResponse } from '../../types/AI';

export abstract class BaseAIService implements AIService {
  protected config: AIConfig;

  constructor(config: AIConfig) {
    this.config = config;
  }

  abstract generateText(prompt: string, config?: Partial<AIConfig>): Promise<AIResponse>;
  abstract improveText(text: string, instructions?: string): Promise<AIResponse>;
  abstract continueText(text: string, length?: number): Promise<AIResponse>;
  abstract summarizeText(text: string, maxLength?: number): Promise<AIResponse>;
  abstract testConnection(): Promise<boolean>;

  protected buildPrompt(systemPrompt: string, userPrompt: string): string {
    return `${systemPrompt}\n\nUser: ${userPrompt}\n\nAssistant:`;
  }

  protected handleError(error: unknown): never {
    if (error instanceof Error) {
      throw new Error(`AI Service Error: ${error.message}`);
    }
    throw new Error('AI Service Error: Unknown error occurred');
  }

  updateConfig(newConfig: Partial<AIConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}