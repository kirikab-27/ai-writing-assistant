import type { AIProvider, AIConfig } from '../../types/AI';
import type { AIService } from '../../types/AI';
import { GeminiService } from './GeminiService';
import { CohereService } from './CohereService';
import { HuggingFaceService } from './HuggingFaceService';

export class AIServiceFactory {
  private static instances: Map<string, AIService> = new Map();

  static createService(config: AIConfig): AIService {
    const key = `${config.provider}-${config.apiKey.slice(-8)}`;
    
    if (this.instances.has(key)) {
      const service = this.instances.get(key)!;
      return service;
    }

    let service: AIService;

    switch (config.provider) {
      case 'gemini':
        service = new GeminiService(config);
        break;
      case 'cohere':
        service = new CohereService(config);
        break;
      case 'huggingface':
        service = new HuggingFaceService(config);
        break;
      default:
        throw new Error(`Unsupported AI provider: ${config.provider}`);
    }

    this.instances.set(key, service);
    return service;
  }

  static clearCache(): void {
    this.instances.clear();
  }

  static getSupportedProviders(): AIProvider[] {
    return ['gemini', 'cohere', 'huggingface'];
  }
}