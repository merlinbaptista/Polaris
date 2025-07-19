import React, { useState } from 'react';
import { Eye, EyeOff, Palette, Zap, Volume2, Upload, MessageCircle, Send } from 'lucide-react';
import { SimulationService, SimulationType } from '../services/simulationService';
import { OpenAIService } from '../services/openai';

const SimulationMode = () => {
  const [activeSimulations, setActiveSimulations] = useState<string[]>([]);
  const [previewMode, setPreviewMode] = useState('side-by-side');
  const [simulationService] = useState(() => SimulationService.getInstance());
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatting, setIsChatting] = useState(false);

  const simulations = [
    {
      id: 'color-blind',
      icon: Palette,
      title: 'Color Blindness',
      types: ['Protanopia', 'Deuteranopia', 'Tritanopia', 'Monochromacy'],
      description: 'Simulate different types of color vision deficiencies'
    },
    {
      id: 'low-vision',
      icon: Eye,
      title: 'Low Vision',
      types: ['Blur', 'Tunnel Vision', 'Cataracts', 'Glaucoma'],
      description: 'Experience various low vision conditions'
    },
    {
      id: 'motor',
      icon: Zap,
      title: 'Motor Impairments',
      types: ['Hand Tremor', 'Limited Mobility', 'One-handed Use'],
      description: 'Simulate motor and dexterity challenges'
    },
    {
      id: 'cognitive',
      icon: Volume2,
      title: 'Cognitive',
      types: ['Dyslexia', 'ADHD', 'Memory Loss'],
      description: 'Understand cognitive accessibility needs'
    }
  ];

  const toggleSimulation = (id: string) => {
    const isActive = simulationService.toggleSimulation(id as SimulationType);
    
    if (isActive) {
      setActiveSimulations(prev => [...prev, id]);
    } else {
      setActiveSimulations(prev => prev.filter(s => s !== id));
    }
  };

  const clearAllSimulations = () => {
    simulationService.clearAllSimulations();
    setActiveSimulations([]);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      // Automatically analyze the uploaded file
      await analyzeUploadedContent(file);
    }
  };

  const analyzeUploadedContent = async (file: File) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    
    try {
      const openAIService = OpenAIService.getInstance();
      
      if (file.type.startsWith('image/')) {
        // Analyze image for accessibility
        const result = await openAIService.analyzeContentAccessibility({
          content: `Image file: ${file.name}, Type: ${file.type}, Size: ${file.size} bytes`,
          contentType: 'image',
          context: 'Accessibility simulation testing - analyze this image for potential accessibility issues when viewed with different visual impairments'
        });
        
        setAnalysisResult({
          type: 'image',
          fileName: file.name,
          fileType: file.type,
          analysis: result,
          recommendations: generateImageRecommendations(result)
        });
      } else if (file.type === 'text/html' || file.name.endsWith('.html')) {
        // Read and analyze HTML content
        const content = await file.text();
        const result = await openAIService.analyzeContentAccessibility({
          content: content.substring(0, 5000), // Limit content length
          contentType: 'html',
          context: 'Accessibility simulation testing - analyze this HTML for accessibility issues'
        });
        
        setAnalysisResult({
          type: 'html',
          fileName: file.name,
          content: content.substring(0, 500) + '...',
          analysis: result,
          recommendations: generateHTMLRecommendations(result)
        });
      } else {
        // Generic file analysis
        setAnalysisResult({
          type: 'file',
          fileName: file.name,
          fileType: file.type,
          analysis: {
            issues: [
              {
                type: 'file-format',
                severity: 'medium',
                description: 'File format may not be accessible to all users',
                recommendation: 'Consider providing alternative formats or descriptions'
              }
            ],
            suggestions: ['Provide text alternatives', 'Ensure file is downloadable', 'Add descriptive filename'],
            score: 70
          },
          recommendations: ['Provide alternative text descriptions', 'Ensure file accessibility', 'Test with screen readers']
        });
      }
    } catch (error) {
      console.error('Analysis error:', error);
      setAnalysisResult({
        type: 'error',
        fileName: file.name,
        analysis: {
          issues: [
            {
              type: 'analysis-error',
              severity: 'low',
              description: 'Unable to perform automated analysis',
              recommendation: 'Manual accessibility review recommended'
            }
          ],
          suggestions: ['Perform manual accessibility testing', 'Use accessibility checkers', 'Test with assistive technologies'],
          score: 50
        },
        recommendations: ['Manual testing recommended', 'Check with accessibility tools', 'Validate with real users']
      });
    }
    
    setIsAnalyzing(false);
  };

  const generateImageRecommendations = (analysis: any) => {
    const recommendations = [];
    
    if (analysis.score < 80) {
      recommendations.push('Consider adding descriptive alt text');
      recommendations.push('Ensure sufficient color contrast');
      recommendations.push('Test image visibility with color blindness simulations');
    }
    
    if (analysis.issues.some((issue: any) => issue.type.includes('contrast'))) {
      recommendations.push('Increase color contrast ratios');
      recommendations.push('Avoid using color alone to convey information');
    }
    
    recommendations.push('Test image with screen readers');
    recommendations.push('Provide text alternatives for complex images');
    
    return recommendations;
  };

  const generateHTMLRecommendations = (analysis: any) => {
    const recommendations = [];
    
    analysis.issues.forEach((issue: any) => {
      switch (issue.type) {
        case 'heading':
          recommendations.push('Fix heading structure and hierarchy');
          break;
        case 'contrast':
          recommendations.push('Improve color contrast ratios');
          break;
        case 'alt-text':
          recommendations.push('Add alt text to all images');
          break;
        case 'form':
          recommendations.push('Associate form labels with inputs');
          break;
        default:
          recommendations.push(issue.recommendation);
      }
    });
    
    return [...new Set(recommendations)]; // Remove duplicates
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim() || isChatting) return;
    
    const userMessage = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsChatting(true);
    
    try {
      const openAIService = OpenAIService.getInstance();
      
      // Create context from current analysis and simulations
      const context = `
        Current accessibility simulation context:
        - Active simulations: ${activeSimulations.join(', ') || 'None'}
        - Uploaded file: ${uploadedFile ? `${uploadedFile.name} (${uploadedFile.type})` : 'None'}
        - Analysis result: ${analysisResult ? JSON.stringify(analysisResult.analysis) : 'None'}
        
        User question: ${userMessage}
        
        Please provide specific, actionable advice for improving accessibility based on the current context.
      `;
      
      const response = await openAIService.analyzeContentAccessibility({
        content: context,
        contentType: 'text',
        context: 'Accessibility consultation chat'
      });
      
      let assistantMessage = '';
      if (response.suggestions && response.suggestions.length > 0) {
        assistantMessage = response.suggestions.join('\n\n');
      } else {
        assistantMessage = 'I can help you improve accessibility! Please share more details about your specific needs or upload a file for analysis.';
      }
      
      setChatMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);
    } catch (error) {
      console.error('Chat error:', error);
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I apologize, but I\'m having trouble processing your request right now. Here are some general accessibility tips:\n\n• Ensure sufficient color contrast (4.5:1 for normal text)\n• Add alt text to all images\n• Use proper heading hierarchy\n• Make sure all interactive elements are keyboard accessible\n• Test with screen readers and other assistive technologies'
      }]);
    }
    
    setIsChatting(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-6 gradient-text animated-gradient">
            Simulation Mode
          </h1>
          <p className="text-xl text-white/80">
            Test your content with accessibility simulations and get personalized recommendations
          </p>
        </div>

        {/* File Upload Section */}
        <div className="bg-gray-900/50 rounded-xl p-8 border border-white/10 mb-8">
          <h3 className="text-2xl font-bold text-white mb-6">Upload Content for Testing</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="upload-zone">
                <div className="text-center py-12">
                  <Upload className="w-16 h-16 mx-auto mb-6 text-white/60" />
                  <h4 className="text-xl font-bold mb-4 text-white">
                    Upload Image, HTML, or Design File
                  </h4>
                  <p className="text-white/60 mb-6">
                    Test how your content performs with different accessibility simulations
                  </p>
                  <input
                    type="file"
                    accept="image/*,.html,.htm,.pdf,.doc,.docx"
                    className="hidden"
                    id="simulation-file-upload"
                    onChange={handleFileUpload}
                  />
                  <label
                    htmlFor="simulation-file-upload"
                    className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg transition-all cursor-pointer inline-block"
                  >
                    Choose File to Test
                  </label>
                </div>
              </div>
              
              {uploadedFile && (
                <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-white/10">
                  <h5 className="text-white font-medium mb-2">Uploaded File</h5>
                  <div className="text-sm text-white/70">
                    <p><strong>Name:</strong> {uploadedFile.name}</p>
                    <p><strong>Type:</strong> {uploadedFile.type}</p>
                    <p><strong>Size:</strong> {(uploadedFile.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
              )}
            </div>
            
            <div>
              {previewUrl && uploadedFile?.type.startsWith('image/') && (
                <div>
                  <h5 className="text-white font-medium mb-4">Preview</h5>
                  <div className="relative rounded-lg overflow-hidden">
                    <img
                      src={previewUrl}
                      alt="Uploaded content preview"
                      className="w-full h-64 object-cover"
                    />
                  </div>
                </div>
              )}
              
              {isAnalyzing && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 relative">
                    <div className="absolute inset-0 border-4 border-purple-500/30 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-purple-500 rounded-full animate-spin border-t-transparent"></div>
                  </div>
                  <p className="text-white/60">Analyzing content for accessibility...</p>
                </div>
              )}
              
              {analysisResult && !isAnalyzing && (
                <div className="space-y-4">
                  <h5 className="text-white font-medium">AI Analysis Results</h5>
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-white font-medium">Accessibility Score</span>
                      <span className={`text-2xl font-bold ${
                        analysisResult.analysis.score >= 80 ? 'text-green-400' :
                        analysisResult.analysis.score >= 60 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {analysisResult.analysis.score}/100
                      </span>
                    </div>
                    
                    {analysisResult.analysis.issues.length > 0 && (
                      <div className="mb-4">
                        <h6 className="text-white/80 font-medium mb-2">Issues Found:</h6>
                        <div className="space-y-2">
                          {analysisResult.analysis.issues.slice(0, 3).map((issue: any, index: number) => (
                            <div key={index} className="text-sm">
                              <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                                issue.severity === 'critical' ? 'bg-red-400' :
                                issue.severity === 'high' ? 'bg-orange-400' :
                                issue.severity === 'medium' ? 'bg-yellow-400' : 'bg-blue-400'
                              }`}></span>
                              <span className="text-white/80">{issue.description}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <h6 className="text-white/80 font-medium mb-2">Recommendations:</h6>
                      <div className="space-y-1">
                        {analysisResult.recommendations.slice(0, 3).map((rec: string, index: number) => (
                          <div key={index} className="text-sm text-white/70">
                            • {rec}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Simulation Controls */}
        <div className="bg-gray-900/50 rounded-xl p-8 border border-white/10 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-white mb-4 md:mb-0">Accessibility Simulations</h3>
            
            <div className="flex items-center space-x-4">
              <span className="text-white/60">View Mode:</span>
              <select
                value={previewMode}
                onChange={(e) => setPreviewMode(e.target.value)}
                className="bg-gray-800/50 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-blue-400 focus:outline-none"
              >
                <option value="side-by-side">Side by Side</option>
                <option value="overlay">Overlay</option>
                <option value="toggle">Toggle</option>
              </select>
              
              {activeSimulations.length > 0 && (
                <button
                  onClick={clearAllSimulations}
                  className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-2 rounded-lg font-medium hover:bg-red-500/30 transition-all"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {simulations.map((simulation) => {
              const IconComponent = simulation.icon;
              const isActive = activeSimulations.includes(simulation.id);
              
              return (
                <div
                  key={simulation.id}
                  className={`simulation-card ${isActive ? 'active' : ''}`}
                  onClick={() => toggleSimulation(simulation.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      toggleSimulation(simulation.id);
                    }
                  }}
                >
                  <div className="p-6">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-all ${
                      isActive 
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500' 
                        : 'bg-gray-700'
                    }`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    
                    <h4 className="text-lg font-semibold text-white mb-2">{simulation.title}</h4>
                    <p className="text-white/60 text-sm mb-4">{simulation.description}</p>
                    
                    {isActive && (
                      <div className="space-y-2">
                        {simulation.types.map((type, index) => (
                          <button
                            key={index}
                            className="block w-full text-left px-3 py-2 bg-gray-800/50 rounded border border-white/10 text-white/80 hover:bg-gray-800 transition-colors text-sm"
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Chat Assistant */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-900/50 rounded-xl p-8 border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <MessageCircle className="w-6 h-6 mr-2" />
              Accessibility Assistant
            </h3>
            
            <div className="bg-gray-800/50 rounded-lg p-4 h-64 overflow-y-auto mb-4 border border-white/10">
              {chatMessages.length === 0 ? (
                <div className="text-center text-white/60 py-8">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Ask me about accessibility improvements for your content!</p>
                  <p className="text-sm mt-2">Try: "How can I improve color contrast?" or "What's wrong with my image?"</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {chatMessages.map((message, index) => (
                    <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-3 rounded-lg ${
                        message.role === 'user' 
                          ? 'bg-purple-500 text-white' 
                          : 'bg-gray-700 text-white/90'
                      }`}>
                        <div className="whitespace-pre-wrap">{message.content}</div>
                      </div>
                    </div>
                  ))}
                  {isChatting && (
                    <div className="flex justify-start">
                      <div className="bg-gray-700 text-white/90 p-3 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex space-x-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                placeholder="Ask about accessibility improvements..."
                className="flex-1 bg-gray-800/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-blue-400 focus:outline-none"
                disabled={isChatting}
              />
              <button
                onClick={sendChatMessage}
                disabled={!chatInput.trim() || isChatting}
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Preview Area */}
          <div className="bg-gray-900/50 rounded-xl p-8 border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-6">Simulation Preview</h3>
            
            {uploadedFile && uploadedFile.type.startsWith('image/') ? (
              <div className={`grid gap-4 ${previewMode === 'side-by-side' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
                {/* Original */}
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold text-white">Original</h4>
                  <div className="bg-white rounded-lg p-4">
                    <img
                      src={previewUrl}
                      alt="Original uploaded content"
                      className="w-full h-48 object-cover rounded"
                    />
                  </div>
                </div>

                {/* Simulated */}
                {activeSimulations.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-white">
                      Simulated View 
                      <span className="text-purple-400 ml-2">
                        ({activeSimulations.length} filter{activeSimulations.length > 1 ? 's' : ''})
                      </span>
                    </h4>
                    <div className={`bg-white rounded-lg p-4 ${
                      activeSimulations.includes('color-blind') ? 'filter grayscale' : ''
                    } ${
                      activeSimulations.includes('low-vision') ? 'filter blur-sm' : ''
                    }`}>
                      <img
                        src={previewUrl}
                        alt="Simulated view of uploaded content"
                        className="w-full h-48 object-cover rounded"
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-8 min-h-[300px]">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Sample Website</h2>
                  <p className="text-gray-600 mb-4">
                    This is a sample website to demonstrate accessibility simulations. 
                    Upload your own content to see how it performs with different visual impairments.
                  </p>
                  <button className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium">
                    Call to Action
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-red-100 p-4 rounded">
                    <div className="w-8 h-8 bg-red-500 rounded mb-2"></div>
                    <p className="text-red-800 text-sm">Error message</p>
                  </div>
                  <div className="bg-green-100 p-4 rounded">
                    <div className="w-8 h-8 bg-green-500 rounded mb-2"></div>
                    <p className="text-green-800 text-sm">Success message</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            )}

            {activeSimulations.length === 0 && !uploadedFile && (
              <div className="text-center py-16">
                <EyeOff className="w-16 h-16 mx-auto mb-4 text-white/40" />
                <p className="text-white/60 mb-2">Upload content and select simulations to see the preview</p>
                <p className="text-white/40 text-sm">Test how your content appears to users with different accessibility needs</p>
              </div>
            )}
          </div>
        </div>

        {/* Impact Information */}
        {activeSimulations.length > 0 && (
          <div className="bg-gray-900/50 rounded-xl p-8 border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-6">Accessibility Impact</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">15%</div>
                <div className="text-white/60">of population affected</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">1.3B</div>
                <div className="text-white/60">people worldwide</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-400 mb-2">$13T</div>
                <div className="text-white/60">annual disposable income</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimulationMode;