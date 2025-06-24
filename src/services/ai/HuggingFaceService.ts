import { BaseAIService } from './AIService';
import type { AIConfig, AIResponse } from '../../types/AI';

export class HuggingFaceService extends BaseAIService {
  private baseUrl = 'https://api-inference.huggingface.co/models';

  constructor(config: AIConfig) {
    super(config);
  }

  async generateText(prompt: string, config?: Partial<AIConfig>): Promise<AIResponse> {
    try {
      const model = config?.model || this.config.model || 'microsoft/DialoGPT-large';
      const response = await fetch(`${this.baseUrl}/${model}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            temperature: config?.temperature || this.config.temperature || 0.7,
            max_new_tokens: config?.maxTokens || this.config.maxTokens || 1000,
            return_full_text: false,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HuggingFace API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (Array.isArray(data) && data[0]?.generated_text) {
        return {
          text: data[0].generated_text.trim(),
          usage: {
            promptTokens: 0,
            completionTokens: 0,
            totalTokens: 0,
          },
        };
      }

      throw new Error('Invalid response format from HuggingFace API');
    } catch (error) {
      this.handleError(error);
    }
  }

  async improveText(text: string, instructions?: string): Promise<AIResponse> {
    const systemPrompt = "Improve the following text:";
    const userPrompt = instructions 
      ? `${systemPrompt} ${instructions}\n\n${text}`
      : `${systemPrompt}\n\n${text}`;

    return this.generateText(userPrompt);
  }

  async continueText(text: string): Promise<AIResponse> {
    const prompt = `Continue this text naturally:\n\n${text}`;
    return this.generateText(prompt);
  }

  async summarizeText(text: string, maxLength?: number): Promise<AIResponse> {
    const prompt = maxLength 
      ? `Summarize the following text in ${maxLength} words:\n\n${text}`
      : `Summarize the following text:\n\n${text}`;
    
    return this.generateText(prompt);
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/microsoft/DialoGPT-large`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: 'Hello',
          parameters: { max_new_tokens: 5 },
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('HuggingFace connection test failed:', error);
      return false;
    }
  }
}