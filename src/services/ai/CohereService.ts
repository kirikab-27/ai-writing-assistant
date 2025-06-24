import { CohereClient } from 'cohere-ai';
import { BaseAIService } from './AIService';
import type { AIConfig, AIResponse } from '../../types/AI';

export class CohereService extends BaseAIService {
  private client: CohereClient;

  constructor(config: AIConfig) {
    super(config);
    this.client = new CohereClient({
      token: config.apiKey,
    });
  }

  async generateText(prompt: string, config?: Partial<AIConfig>): Promise<AIResponse> {
    try {
      const response = await this.client.generate({
        model: config?.model || this.config.model || 'command-r',
        prompt,
        temperature: config?.temperature || this.config.temperature || 0.7,
        maxTokens: config?.maxTokens || this.config.maxTokens || 1000,
      });

      return {
        text: response.generations[0]?.text?.trim() || '',
        usage: {
          promptTokens: 0, // Cohere API doesn't always provide detailed token usage
          completionTokens: 0,
          totalTokens: 0,
        },
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async improveText(text: string, instructions?: string): Promise<AIResponse> {
    const systemPrompt = "You are a writing assistant. Your task is to improve the given text while maintaining its original meaning and tone.";
    const userPrompt = instructions 
      ? `Please improve the following text according to these instructions: "${instructions}"\n\nText to improve:\n${text}`
      : `Please improve the following text by enhancing clarity, grammar, and flow:\n\n${text}`;

    return this.generateText(this.buildPrompt(systemPrompt, userPrompt));
  }

  async continueText(text: string, length?: number): Promise<AIResponse> {
    const systemPrompt = "You are a writing assistant. Continue the given text naturally and coherently.";
    const lengthInstruction = length ? ` in approximately ${length} words` : '';
    const userPrompt = `Please continue the following text naturally${lengthInstruction}:\n\n${text}`;

    return this.generateText(this.buildPrompt(systemPrompt, userPrompt));
  }

  async summarizeText(text: string, maxLength?: number): Promise<AIResponse> {
    const systemPrompt = "You are a writing assistant. Summarize the given text concisely while preserving key information.";
    const lengthInstruction = maxLength ? ` in no more than ${maxLength} words` : '';
    const userPrompt = `Please summarize the following text${lengthInstruction}:\n\n${text}`;

    return this.generateText(this.buildPrompt(systemPrompt, userPrompt));
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await this.client.generate({
        model: 'command-r',
        prompt: 'Hello, this is a connection test.',
        maxTokens: 10,
      });
      return !!response.generations[0]?.text;
    } catch (error) {
      console.error('Cohere connection test failed:', error);
      return false;
    }
  }

  updateConfig(newConfig: Partial<AIConfig>): void {
    super.updateConfig(newConfig);
    if (newConfig.apiKey) {
      this.client = new CohereClient({
        token: newConfig.apiKey,
      });
    }
  }
}