
import { openAIService } from './OpenAIService';

export interface VisionAnalysisResult {
  description: string;
  venueType?: string;
  venueName?: string;
  menuItems?: string[];
  atmosphere?: string;
  priceRange?: string;
  confidence: number;
  suggestions: string[];
}

export interface DocumentAnalysisResult {
  type: 'menu' | 'flyer' | 'sign' | 'poster' | 'other';
  text: string;
  extractedInfo: {
    venueName?: string;
    prices?: string[];
    events?: string[];
    hours?: string;
    contact?: string;
  };
  recommendations: string[];
}

export class VisionProcessor {
  private isProcessing = false;

  async analyzeVenueImage(imageFile: File): Promise<VisionAnalysisResult> {
    if (this.isProcessing) {
      throw new Error('Vision analysis already in progress');
    }

    this.isProcessing = true;

    try {
      const base64Image = await this.fileToBase64(imageFile);
      
      const response = await openAIService.chatCompletion([
        {
          role: 'system',
          content: `You are a venue recognition expert. Analyze images of restaurants, bars, clubs, and other venues. 
          Provide detailed information about the venue type, atmosphere, estimated price range, and recommendations.
          Respond in JSON format with: description, venueType, venueName (if visible), atmosphere, priceRange, confidence (0-1), and suggestions array.`
        },
        {
          role: 'user',
          content: `Analyze this venue image and tell me what type of place this is, what the atmosphere seems like, and any recommendations:

          ${base64Image}`
        }
      ], {
        model: 'gpt-4o',
        temperature: 0.3,
        maxTokens: 800
      });

      const analysis = JSON.parse(response.content);
      
      return {
        description: analysis.description || 'Unable to analyze image',
        venueType: analysis.venueType,
        venueName: analysis.venueName,
        atmosphere: analysis.atmosphere,
        priceRange: analysis.priceRange,
        confidence: analysis.confidence || 0.5,
        suggestions: analysis.suggestions || []
      };

    } catch (error) {
      console.error('Vision analysis error:', error);
      throw new Error('Failed to analyze image. Please try again.');
    } finally {
      this.isProcessing = false;
    }
  }

  async analyzeDocument(imageFile: File): Promise<DocumentAnalysisResult> {
    try {
      const base64Image = await this.fileToBase64(imageFile);
      
      const response = await openAIService.chatCompletion([
        {
          role: 'system',
          content: `You are a document analysis expert. Extract text and useful information from menus, flyers, signs, and posters.
          Focus on venue names, prices, events, hours, and contact info. Respond in JSON format.`
        },
        {
          role: 'user',
          content: `Extract all text and relevant information from this document:

          ${base64Image}`
        }
      ], {
        model: 'gpt-4o',
        temperature: 0.1,
        maxTokens: 1000
      });

      const analysis = JSON.parse(response.content);
      
      return {
        type: analysis.type || 'other',
        text: analysis.text || '',
        extractedInfo: analysis.extractedInfo || {},
        recommendations: analysis.recommendations || []
      };

    } catch (error) {
      console.error('Document analysis error:', error);
      throw new Error('Failed to analyze document. Please try again.');
    }
  }

  async findSimilarVenues(imageFile: File): Promise<string[]> {
    try {
      const analysis = await this.analyzeVenueImage(imageFile);
      
      // Generate search queries based on visual analysis
      const queries = [
        `${analysis.venueType} with ${analysis.atmosphere} atmosphere`,
        `${analysis.priceRange} ${analysis.venueType} venues`,
        analysis.description.slice(0, 100) // First 100 chars of description
      ].filter(Boolean);

      return queries;

    } catch (error) {
      console.error('Similar venue search error:', error);
      return ['Similar venues to uploaded image'];
    }
  }

  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  isAnalyzing(): boolean {
    return this.isProcessing;
  }
}

export const visionProcessor = new VisionProcessor();
