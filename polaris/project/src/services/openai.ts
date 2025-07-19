import axios from 'axios';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || 'your_openai_api_key_here';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export interface AltTextRequest {
  imageUrl?: string;
  imageFile?: File;
  context?: string;
  style?: 'descriptive' | 'concise' | 'emotional';
}

export interface AltTextResponse {
  altText: string;
  confidence: number;
  suggestions: string[];
  analysis: ImageAnalysis;
}

export interface ImageAnalysis {
  objects: string[];
  scene: string;
  mood: string;
  colors: string[];
  text?: string;
  people?: number;
  accessibility_concerns?: string[];
}

export interface AccessibilityAnalysisRequest {
  content: string;
  contentType: 'html' | 'image' | 'text';
  context?: string;
}

export interface AccessibilityAnalysisResponse {
  issues: Array<{
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    recommendation: string;
    codeExample?: string;
  }>;
  suggestions: string[];
  score: number;
}

export class OpenAIService {
  private static instance: OpenAIService;

  public static getInstance(): OpenAIService {
    if (!OpenAIService.instance) {
      OpenAIService.instance = new OpenAIService();
    }
    return OpenAIService.instance;
  }

  async generateAltTextFromImage(request: AltTextRequest): Promise<AltTextResponse> {
    try {
      let imageData: string;
      
      if (request.imageFile) {
        imageData = await this.fileToBase64(request.imageFile);
      } else if (request.imageUrl) {
        // For URLs, we'll use the URL directly in the vision API
        imageData = request.imageUrl;
      } else {
        throw new Error('No image provided');
      }

      const analysisPrompt = this.buildImageAnalysisPrompt(request);
      
      const response = await axios.post(
        OPENAI_API_URL,
        {
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: 'You are an expert accessibility consultant specializing in creating meaningful alt text and analyzing images for accessibility compliance. Provide detailed, accurate descriptions that help screen reader users understand the content and context of images.'
            },
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: analysisPrompt
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: request.imageFile ? `data:image/jpeg;base64,${imageData}` : imageData,
                    detail: 'high'
                  }
                }
              ]
            }
          ],
          max_tokens: 500,
          temperature: 0.3
        },
        {
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const analysisResult = this.parseImageAnalysis(response.data.choices[0].message.content);
      
      // Generate variations based on style
      const suggestions = await this.generateAltTextVariations(analysisResult.altText, request.style);

      return {
        altText: analysisResult.altText,
        confidence: 0.95,
        suggestions,
        analysis: analysisResult.analysis
      };
    } catch (error) {
      console.error('OpenAI Vision API Error:', error);
      
      // Enhanced fallback based on file analysis
      if (request.imageFile) {
        const fallbackAnalysis = await this.generateFallbackFromFile(request.imageFile, request.style);
        return fallbackAnalysis;
      }
      
      throw new Error('Failed to analyze image. Please check your API key and try again.');
    }
  }

  async analyzeContentAccessibility(request: AccessibilityAnalysisRequest): Promise<AccessibilityAnalysisResponse> {
    try {
      const prompt = this.buildAccessibilityAnalysisPrompt(request);
      
      const response = await axios.post(
        OPENAI_API_URL,
        {
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: 'You are a WCAG 2.1 accessibility expert. Analyze content for accessibility issues and provide specific, actionable recommendations with code examples.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 800,
          temperature: 0.2
        },
        {
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return this.parseAccessibilityAnalysis(response.data.choices[0].message.content);
    } catch (error) {
      console.error('OpenAI Accessibility Analysis Error:', error);
      throw new Error('Failed to analyze content accessibility');
    }
  }

  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  private buildImageAnalysisPrompt(request: AltTextRequest): string {
    let prompt = `Analyze this image and provide a comprehensive accessibility assessment. Please provide:

1. A ${request.style || 'descriptive'} alt text (50-150 characters)
2. Detailed analysis including:
   - Main objects and elements
   - Scene description
   - Mood/atmosphere
   - Dominant colors
   - Any text present
   - Number of people (if any)
   - Accessibility concerns

Format your response as JSON:
{
  "altText": "your alt text here",
  "analysis": {
    "objects": ["object1", "object2"],
    "scene": "scene description",
    "mood": "mood description",
    "colors": ["color1", "color2"],
    "text": "any text found",
    "people": number,
    "accessibility_concerns": ["concern1", "concern2"]
  }
}`;

    if (request.context) {
      prompt += `\n\nContext: ${request.context}`;
    }

    switch (request.style) {
      case 'concise':
        prompt += '\n\nStyle: Keep the alt text brief and essential (under 50 characters).';
        break;
      case 'emotional':
        prompt += '\n\nStyle: Include emotional context and atmosphere in the alt text.';
        break;
      default:
        prompt += '\n\nStyle: Provide a descriptive but concise alt text that conveys the essential information.';
    }

    return prompt;
  }

  private buildAccessibilityAnalysisPrompt(request: AccessibilityAnalysisRequest): string {
    let prompt = `Analyze the following ${request.contentType} content for accessibility issues according to WCAG 2.1 guidelines:

${request.content}

Please identify:
1. Accessibility issues with severity levels (critical, high, medium, low)
2. Specific recommendations for each issue
3. Code examples where applicable
4. Overall accessibility score (0-100)

Format as JSON:
{
  "issues": [
    {
      "type": "issue type",
      "severity": "critical|high|medium|low",
      "description": "detailed description",
      "recommendation": "how to fix",
      "codeExample": "example code if applicable"
    }
  ],
  "suggestions": ["general suggestion 1", "suggestion 2"],
  "score": 85
}`;

    if (request.context) {
      prompt += `\n\nContext: ${request.context}`;
    }

    return prompt;
  }

  private parseImageAnalysis(response: string): { altText: string; analysis: ImageAnalysis } {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          altText: parsed.altText,
          analysis: parsed.analysis
        };
      }
    } catch (error) {
      console.warn('Failed to parse JSON response, extracting manually');
    }

    // Fallback parsing
    const altTextMatch = response.match(/alt[Tt]ext['":\s]*([^"'\n]+)/);
    const altText = altTextMatch ? altTextMatch[1].trim() : 'Image content analyzed by AI';

    return {
      altText,
      analysis: {
        objects: ['Various elements'],
        scene: 'Image content',
        mood: 'Neutral',
        colors: ['Multiple colors'],
        accessibility_concerns: []
      }
    };
  }

  private parseAccessibilityAnalysis(response: string): AccessibilityAnalysisResponse {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.warn('Failed to parse accessibility analysis JSON');
    }

    // Fallback parsing
    return {
      issues: [
        {
          type: 'general',
          severity: 'medium',
          description: 'Content requires manual accessibility review',
          recommendation: 'Review content against WCAG 2.1 guidelines'
        }
      ],
      suggestions: ['Ensure proper heading structure', 'Add alt text to images', 'Check color contrast'],
      score: 75
    };
  }

  private async generateFallbackFromFile(file: File, style?: string): Promise<AltTextResponse> {
    const fileName = file.name.toLowerCase();
    const fileType = file.type;
    
    let altText = '';
    let objects = ['Unknown content'];
    let scene = 'Image file';
    
    // Basic analysis based on file properties
    if (fileName.includes('chart') || fileName.includes('graph')) {
      altText = style === 'concise' ? 'Chart or graph' : 'Data visualization chart showing information';
      objects = ['Chart', 'Data visualization'];
      scene = 'Business or analytical chart';
    } else if (fileName.includes('logo') || fileName.includes('brand')) {
      altText = style === 'concise' ? 'Company logo' : 'Company or brand logo image';
      objects = ['Logo', 'Branding'];
      scene = 'Corporate branding';
    } else if (fileName.includes('photo') || fileName.includes('picture')) {
      altText = style === 'concise' ? 'Photograph' : 'Photographic image showing visual content';
      objects = ['Photograph'];
      scene = 'Photographic content';
    } else if (fileType.includes('svg')) {
      altText = style === 'concise' ? 'Vector graphic' : 'Scalable vector graphic with visual elements';
      objects = ['Vector graphic', 'SVG'];
      scene = 'Vector illustration';
    } else {
      altText = style === 'concise' ? 'Image content' : 'Image file containing visual information';
    }

    return {
      altText,
      confidence: 0.6,
      suggestions: [
        'Upload to AI service for detailed analysis',
        'Manually review and provide specific description',
        'Consider the image context and purpose'
      ],
      analysis: {
        objects,
        scene,
        mood: 'Unknown',
        colors: ['Unknown'],
        accessibility_concerns: ['Requires manual review for accurate description']
      }
    };
  }

  private async generateAltTextVariations(baseAltText: string, style?: string): Promise<string[]> {
    try {
      const response = await axios.post(
        OPENAI_API_URL,
        {
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'user',
              content: `Create 3 alternative versions of this alt text, each with a different focus (concise, detailed, emotional): "${baseAltText}"`
            }
          ],
          max_tokens: 200,
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const variations = response.data.choices[0].message.content
        .split('\n')
        .filter((line: string) => line.trim() && !line.includes(':'))
        .map((line: string) => line.replace(/^\d+\.\s*/, '').replace(/^[-*]\s*/, '').trim())
        .slice(0, 3);

      return variations.length > 0 ? variations : [
        'Concise version focusing on key elements',
        'Detailed version with comprehensive description',
        'Contextual version emphasizing purpose and meaning'
      ];
    } catch (error) {
      console.error('Error generating variations:', error);
      return [
        'Alternative description focusing on main subject',
        'Brief description highlighting key features',
        'Detailed description including context and purpose'
      ];
    }
  }

  // Legacy method for backward compatibility
  async generateAltText(request: AltTextRequest): Promise<AltTextResponse> {
    return this.generateAltTextFromImage(request);
  }

  async analyzeContent(content: string): Promise<any> {
    return this.analyzeContentAccessibility({
      content,
      contentType: 'html'
    });
  }
}