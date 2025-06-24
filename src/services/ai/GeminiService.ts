import { GoogleGenerativeAI } from '@google/generative-ai';
import { BaseAIService } from './AIService';
import type { AIConfig, AIResponse } from '../../types/AI';

export class GeminiService extends BaseAIService {
  private client: GoogleGenerativeAI;

  constructor(config: AIConfig) {
    super(config);
    this.client = new GoogleGenerativeAI(config.apiKey);
  }

  async generateText(prompt: string, config?: Partial<AIConfig>): Promise<AIResponse> {
    try {
      const model = this.client.getGenerativeModel({ 
        model: config?.model || this.config.model || 'gemini-1.5-flash',
        generationConfig: {
          temperature: config?.temperature || this.config.temperature || 0.7,
          maxOutputTokens: config?.maxTokens || this.config.maxTokens || 1000,
        },
      });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return {
        text: text.trim(),
        usage: {
          promptTokens: 0, // Gemini doesn't provide token usage in free tier
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
      const model = this.client.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent('Hello, this is a connection test.');
      const response = await result.response;
      return !!response.text();
    } catch (error) {
      console.error('Gemini connection test failed:', error);
      return false;
    }
  }

  updateConfig(newConfig: Partial<AIConfig>): void {
    super.updateConfig(newConfig);
    if (newConfig.apiKey) {
      this.client = new GoogleGenerativeAI(newConfig.apiKey);
    }
  }
}