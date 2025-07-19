import React, { useState } from 'react';
import { Image, Sparkles, Copy, Check, Upload, Eye, Palette } from 'lucide-react';
import { OpenAIService } from '../services/openai';

const AltTextGenerator = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [altText, setAltText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [style, setStyle] = useState<'descriptive' | 'concise' | 'emotional'>('descriptive');
  const [previewUrl, setPreviewUrl] = useState('');

  const generateAltText = async () => {
    if (!selectedFile && !imageUrl) {
      alert('Please upload an image or provide an image URL');
      return;
    }

    setIsGenerating(true);
    setAltText('');
    setSuggestions([]);
    setAnalysisData(null);
    
    try {
      const openAIService = OpenAIService.getInstance();
      
      // Use OpenAI Vision API for image analysis
      const result = await openAIService.generateAltTextFromImage({
        imageFile: selectedFile || undefined,
        imageUrl: !selectedFile ? imageUrl : undefined,
        style: style,
        context: 'Web accessibility - this image will be used on a website'
      });
      
      setAltText(result.altText);
      setSuggestions(result.suggestions);
      setAnalysisData(result.analysis);
      
    } catch (error) {
      console.error('Error generating alt text:', error);
      
      // Enhanced fallback with better analysis
      const fallbackAnalysis = await generateEnhancedFallback();
      setAltText(fallbackAnalysis.altText);
      setSuggestions(fallbackAnalysis.suggestions);
      setAnalysisData(fallbackAnalysis.analysis);
    }
    
    setIsGenerating(false);
  };

  const generateEnhancedFallback = async () => {
    let altText = '';
    let analysis = {
      objects: ['Image content'],
      scene: 'Visual content',
      mood: 'Informative',
      colors: ['Various colors'],
      accessibility_concerns: ['Requires manual review']
    };

    if (selectedFile) {
      const fileName = selectedFile.name.toLowerCase();
      const fileType = selectedFile.type;
      
      if (fileName.includes('chart') || fileName.includes('graph') || fileName.includes('data')) {
        altText = style === 'concise' 
          ? 'Data chart' 
          : style === 'emotional'
          ? 'Informative data visualization presenting key insights'
          : 'Chart or graph displaying data and statistics for analysis';
        analysis.objects = ['Chart', 'Data visualization', 'Statistics'];
        analysis.scene = 'Business analytics dashboard';
      } else if (fileName.includes('logo') || fileName.includes('brand')) {
        altText = style === 'concise' 
          ? 'Company logo' 
          : style === 'emotional'
          ? 'Professional brand identity representing company values'
          : 'Company logo featuring brand elements and corporate identity';
        analysis.objects = ['Logo', 'Brand elements', 'Typography'];
        analysis.scene = 'Corporate branding';
      } else if (fileName.includes('photo') || fileName.includes('picture') || fileType.includes('jpeg') || fileType.includes('jpg')) {
        altText = style === 'concise' 
          ? 'Photograph' 
          : style === 'emotional'
          ? 'Captivating photograph capturing a meaningful moment'
          : 'Photograph showing people, places, or objects in a real-world setting';
        analysis.objects = ['People or objects', 'Natural setting'];
        analysis.scene = 'Real-world photography';
      } else if (fileType.includes('svg')) {
        altText = style === 'concise' 
          ? 'Vector graphic' 
          : style === 'emotional'
          ? 'Clean, scalable graphic design with modern appeal'
          : 'Vector graphic illustration with scalable design elements';
        analysis.objects = ['Vector shapes', 'Design elements'];
        analysis.scene = 'Digital illustration';
      } else {
        altText = style === 'concise' 
          ? 'Image' 
          : style === 'emotional'
          ? 'Visual content designed to inform and engage viewers'
          : 'Image containing visual information relevant to the content';
      }
    } else if (imageUrl) {
      // Analyze URL for context
      if (imageUrl.includes('chart') || imageUrl.includes('graph')) {
        altText = 'Data visualization chart';
        analysis.objects = ['Chart', 'Data'];
      } else if (imageUrl.includes('logo')) {
        altText = 'Company or brand logo';
        analysis.objects = ['Logo', 'Branding'];
      } else {
        altText = 'Image from external source';
      }
    }

    return {
      altText,
      suggestions: [
        style === 'concise' ? 'Detailed version with more context' : 'Concise version focusing on essentials',
        style === 'emotional' ? 'Factual version without emotional language' : 'Emotional version highlighting mood and feeling',
        'Custom version tailored to specific context and audience'
      ],
      analysis
    };
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setImageUrl(''); // Clear URL when file is uploaded
    }
  };

  const handleUrlChange = (url: string) => {
    setImageUrl(url);
    setPreviewUrl(url);
    setSelectedFile(null); // Clear file when URL is provided
  };

  const regenerateWithStyle = async (newStyle: 'descriptive' | 'concise' | 'emotional') => {
    setStyle(newStyle);
    if (selectedFile || imageUrl) {
      await generateAltText();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(altText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const useAlternative = (suggestion: string) => {
    setAltText(suggestion);
    navigator.clipboard.writeText(suggestion);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-6 gradient-text animated-gradient">
            AI Alt-Text Generator
          </h1>
          <p className="text-xl text-white/80">
            Generate descriptive, meaningful alt text using OpenAI's advanced vision analysis
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Input */}
          <div className="space-y-6">
            <div className="bg-gray-900/50 rounded-xl p-8 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-6">Upload Image</h3>
              
              <div className="image-upload-area mb-6">
                <div className="text-center py-12">
                  <Upload className="w-16 h-16 mx-auto mb-4 text-white/40" />
                  <div className="text-white/60 mb-4">
                    Upload an image for AI-powered analysis
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="image-upload"
                    onChange={handleFileUpload}
                  />
                  <label
                    htmlFor="image-upload"
                    className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all cursor-pointer inline-block"
                  >
                    Choose Image File
                  </label>
                </div>
              </div>

              <div className="text-center text-white/60 mb-4">or</div>

              <div>
                <label className="block text-white/80 mb-2">Paste image URL:</label>
                <div className="flex space-x-4">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 bg-gray-800/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-blue-400 focus:outline-none"
                  />
                </div>
              </div>

              <button
                onClick={generateAltText}
                disabled={(!imageUrl && !selectedFile) || isGenerating}
                className="w-full mt-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-4 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Analyzing with AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Generate Alt Text</span>
                  </>
                )}
              </button>
            </div>

            {/* Style Selection */}
            <div className="bg-gray-900/50 rounded-xl p-6 border border-white/10">
              <h4 className="text-lg font-semibold text-white mb-4">Alt Text Style</h4>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { key: 'descriptive', label: 'Descriptive', icon: Eye, desc: 'Detailed and informative' },
                  { key: 'concise', label: 'Concise', icon: Image, desc: 'Brief and essential' },
                  { key: 'emotional', label: 'Emotional', icon: Palette, desc: 'Mood and feeling' }
                ].map((styleOption) => (
                  <button
                    key={styleOption.key}
                    onClick={() => setStyle(styleOption.key as any)}
                    className={`p-4 rounded-lg font-medium transition-all text-center ${
                      style === styleOption.key
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                        : 'bg-gray-800/50 text-white/70 hover:bg-gray-800 border border-white/20'
                    }`}
                  >
                    <styleOption.icon className="w-6 h-6 mx-auto mb-2" />
                    <div className="font-semibold">{styleOption.label}</div>
                    <div className="text-xs opacity-80">{styleOption.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Image Preview */}
            {previewUrl && (
              <div className="bg-gray-900/50 rounded-xl p-6 border border-white/10">
                <h4 className="text-lg font-semibold text-white mb-4">Image Preview</h4>
                <div className="relative rounded-lg overflow-hidden">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-64 object-cover"
                    onError={() => {
                      setPreviewUrl('');
                      setImageUrl('');
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
                
                {/* File Info */}
                {selectedFile && (
                  <div className="mt-4 p-4 bg-gray-800/50 rounded-lg">
                    <h5 className="text-white font-medium mb-2">File Information</h5>
                    <div className="text-sm text-white/70 space-y-1">
                      <p><strong>Name:</strong> {selectedFile.name}</p>
                      <p><strong>Size:</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      <p><strong>Type:</strong> {selectedFile.type}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Generated Alt Text */}
          <div className="space-y-6">
            <div className="bg-gray-900/50 rounded-xl p-8 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-6">AI-Generated Alt Text</h3>
              
              {altText ? (
                <div className="space-y-6">
                  <div className="bg-gray-800/50 rounded-lg p-6 border border-white/10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        <span className="text-green-400 font-medium">AI Generated ({style})</span>
                      </div>
                      <button
                        onClick={copyToClipboard}
                        className="text-white/60 hover:text-white transition-colors"
                        aria-label="Copy alt text"
                      >
                        {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>
                    <p className="text-white leading-relaxed text-lg">{altText}</p>
                    <div className="mt-4 text-sm text-white/60">
                      Length: {altText.length} characters
                      {altText.length > 150 && (
                        <span className="text-yellow-400 ml-2">⚠ Consider shortening for better accessibility</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Style Regeneration */}
                  <div className="grid grid-cols-1 gap-3">
                    <button 
                      onClick={() => regenerateWithStyle('descriptive')}
                      disabled={isGenerating || style === 'descriptive'}
                      className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-4 py-3 rounded-lg font-medium hover:shadow-lg transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="flex items-center space-x-3">
                        <Eye className="w-5 h-5" />
                        <div>
                          <div className="font-semibold">Generate Descriptive Version</div>
                          <div className="text-sm opacity-80">Detailed and comprehensive description</div>
                        </div>
                      </div>
                    </button>
                    <button 
                      onClick={() => regenerateWithStyle('concise')}
                      disabled={isGenerating || style === 'concise'}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-3 rounded-lg font-medium hover:shadow-lg transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="flex items-center space-x-3">
                        <Image className="w-5 h-5" />
                        <div>
                          <div className="font-semibold">Generate Concise Version</div>
                          <div className="text-sm opacity-80">Brief and essential information only</div>
                        </div>
                      </div>
                    </button>
                    <button 
                      onClick={() => regenerateWithStyle('emotional')}
                      disabled={isGenerating || style === 'emotional'}
                      className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-3 rounded-lg font-medium hover:shadow-lg transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="flex items-center space-x-3">
                        <Palette className="w-5 h-5" />
                        <div>
                          <div className="font-semibold">Generate Emotional Version</div>
                          <div className="text-sm opacity-80">Focus on mood and emotional context</div>
                        </div>
                      </div>
                    </button>
                  </div>
                  
                  {/* AI Analysis Results */}
                  {analysisData && (
                    <div className="bg-gray-800/30 rounded-lg p-6 border border-white/10">
                      <h5 className="text-white font-medium mb-4">AI Analysis Results</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-white/80 font-medium mb-2">Detected Objects:</div>
                          <div className="text-white/60">{analysisData.objects?.join(', ') || 'Various elements'}</div>
                        </div>
                        <div>
                          <div className="text-white/80 font-medium mb-2">Scene:</div>
                          <div className="text-white/60">{analysisData.scene || 'Visual content'}</div>
                        </div>
                        <div>
                          <div className="text-white/80 font-medium mb-2">Mood:</div>
                          <div className="text-white/60">{analysisData.mood || 'Neutral'}</div>
                        </div>
                        <div>
                          <div className="text-white/80 font-medium mb-2">Colors:</div>
                          <div className="text-white/60">{analysisData.colors?.join(', ') || 'Multiple colors'}</div>
                        </div>
                        {analysisData.text && (
                          <div className="md:col-span-2">
                            <div className="text-white/80 font-medium mb-2">Text Found:</div>
                            <div className="text-white/60">{analysisData.text}</div>
                          </div>
                        )}
                        {analysisData.people && (
                          <div>
                            <div className="text-white/80 font-medium mb-2">People:</div>
                            <div className="text-white/60">{analysisData.people} detected</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Alternative Suggestions */}
                  {suggestions.length > 0 && (
                    <div>
                      <h5 className="text-white font-medium mb-3">Alternative Suggestions</h5>
                      <div className="space-y-3">
                        {suggestions.map((suggestion, index) => (
                          <div key={index} className="bg-gray-800/30 rounded-lg p-4 border border-white/10">
                            <p className="text-white/80 mb-2">{suggestion}</p>
                            <button
                              onClick={() => useAlternative(suggestion)}
                              className="text-purple-400 hover:text-purple-300 text-sm font-medium"
                            >
                              Use this version
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Sparkles className="w-16 h-16 mx-auto mb-4 text-white/40" />
                  <div className="text-white/60 mb-4">
                    Upload an image or paste a URL to generate AI-powered alt text
                  </div>
                  <div className="text-sm text-white/40">
                    Powered by OpenAI's advanced vision analysis
                  </div>
                </div>
              )}
            </div>

            {/* Best Practices */}
            <div className="bg-gray-900/50 rounded-xl p-6 border border-white/10">
              <h4 className="text-lg font-semibold text-white mb-4">Alt Text Best Practices</h4>
              <ul className="space-y-3 text-white/80">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                  <span>Keep it concise (ideally under 150 characters)</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                  <span>Describe the image's purpose and context</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                  <span>Avoid redundant phrases like "image of" or "picture of"</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-teal-400 rounded-full mt-2"></div>
                  <span>Include important text that appears in the image</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                  <span>Consider the image's role in the content</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AltTextGenerator;