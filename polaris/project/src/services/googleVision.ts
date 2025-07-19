import axios from 'axios';

const GOOGLE_VISION_API_KEY = import.meta.env.VITE_GOOGLE_VISION_API_KEY || 'your_google_vision_api_key_here';
const GOOGLE_VISION_API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_API_KEY}`;

export interface VisionAnalysisResult {
  labels: Array<{
    description: string;
    score: number;
  }>;
  text?: string;
  faces?: number;
  objects?: Array<{
    name: string;
    score: number;
  }>;
  safeSearch?: {
    adult: string;
    spoof: string;
    medical: string;
    violence: string;
    racy: string;
  };
}

export class GoogleVisionService {
  private static instance: GoogleVisionService;

  public static getInstance(): GoogleVisionService {
    if (!GoogleVisionService.instance) {
      GoogleVisionService.instance = new GoogleVisionService();
    }
    return GoogleVisionService.instance;
  }

  async analyzeImage(imageUrl: string): Promise<VisionAnalysisResult> {
    try {
      const response = await axios.post(GOOGLE_VISION_API_URL, {
        requests: [
          {
            image: {
              source: {
                imageUri: imageUrl
              }
            },
            features: [
              { type: 'LABEL_DETECTION', maxResults: 10 },
              { type: 'TEXT_DETECTION' },
              { type: 'FACE_DETECTION' },
              { type: 'OBJECT_LOCALIZATION', maxResults: 10 },
              { type: 'SAFE_SEARCH_DETECTION' }
            ]
          }
        ]
      });

      const result = response.data.responses[0];
      
      return {
        labels: result.labelAnnotations?.map((label: any) => ({
          description: label.description,
          score: label.score
        })) || [],
        text: result.textAnnotations?.[0]?.description || undefined,
        faces: result.faceAnnotations?.length || 0,
        objects: result.localizedObjectAnnotations?.map((obj: any) => ({
          name: obj.name,
          score: obj.score
        })) || [],
        safeSearch: result.safeSearchAnnotation
      };
    } catch (error) {
      console.error('Google Vision API Error:', error);
      throw new Error('Failed to analyze image');
    }
  }

  async analyzeImageFromFile(file: File): Promise<VisionAnalysisResult> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Image = (reader.result as string).split(',')[1];
          
          const response = await axios.post(GOOGLE_VISION_API_URL, {
            requests: [
              {
                image: {
                  content: base64Image
                },
                features: [
                  { type: 'LABEL_DETECTION', maxResults: 10 },
                  { type: 'TEXT_DETECTION' },
                  { type: 'FACE_DETECTION' },
                  { type: 'OBJECT_LOCALIZATION', maxResults: 10 },
                  { type: 'SAFE_SEARCH_DETECTION' }
                ]
              }
            ]
          });

          const result = response.data.responses[0];
          
          resolve({
            labels: result.labelAnnotations?.map((label: any) => ({
              description: label.description,
              score: label.score
            })) || [],
            text: result.textAnnotations?.[0]?.description || undefined,
            faces: result.faceAnnotations?.length || 0,
            objects: result.localizedObjectAnnotations?.map((obj: any) => ({
              name: obj.name,
              score: obj.score
            })) || [],
            safeSearch: result.safeSearchAnnotation
          });
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}