import React, { useState } from 'react';
import { Mic, MicOff, Volume2, Square } from 'lucide-react';
import { SpeechService, SpeechRecognitionResult, VoiceCommand } from '../services/speechService';

const VoiceInterface = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [speechService] = useState(() => new SpeechService());
  const [isSupported, setIsSupported] = useState(true);
  const [confidence, setConfidence] = useState(0);
  const [commands, setCommands] = useState([
    'Scan website for accessibility issues',
    'Generate alt text for images',
    'Show compliance report',
    'Enable high contrast mode'
  ]);

  React.useEffect(() => {
    setIsSupported(speechService.isSupported());
    
    // Register voice commands
    const voiceCommands: VoiceCommand[] = [
      {
        command: 'scan website',
        action: () => {
          setTranscript('Scanning website for accessibility issues...');
          speechService.speak('Starting accessibility scan');
        },
        description: 'Scan website for accessibility issues'
      },
      {
        command: 'generate alt text',
        action: () => {
          setTranscript('Opening alt text generator...');
          speechService.speak('Opening alt text generator');
        },
        description: 'Generate alt text for images'
      },
      {
        command: 'show report',
        action: () => {
          setTranscript('Displaying compliance report...');
          speechService.speak('Showing compliance report');
        },
        description: 'Show compliance report'
      },
      {
        command: 'high contrast',
        action: () => {
          setTranscript('Enabling high contrast mode...');
          speechService.speak('High contrast mode enabled');
          document.body.classList.toggle('high-contrast');
        },
        description: 'Toggle high contrast mode'
      }
    ];
    
    speechService.registerCommands(voiceCommands);
    
    return () => {
      speechService.clearCommands();
    };
  }, [speechService]);
  const toggleListening = () => {
    if (!isSupported) {
      speechService.speak('Speech recognition not supported in this browser. Please use Chrome, Edge, or Safari.');
      setTranscript('Speech recognition not supported. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
      setTranscript('Stopped listening');
      speechService.speak('Stopped listening');
    } else {
      try {
        speechService.startListening(
          (result: SpeechRecognitionResult) => {
            setTranscript(result.transcript);
            setConfidence(result.confidence);
            
            if (result.isFinal) {
              // Provide audio feedback for recognized commands
              const recognizedCommand = speechService.getRegisteredCommands().find(cmd => 
                result.transcript.toLowerCase().includes(cmd.command.toLowerCase())
              );
              
              if (recognizedCommand) {
                speechService.speak(`Executing ${recognizedCommand.description}`);
              }
              
              setTimeout(() => {
                setTranscript('');
                setConfidence(0);
              }, 3000);
            }
          },
          (error: string) => {
            setTranscript(`Error: ${error}`);
            setIsListening(false);
            speechService.speak(`Speech recognition error: ${error}`);
          }
        );
        setIsListening(true);
        setTranscript('Listening for commands...');
        speechService.speak('Listening for voice commands');
      } catch (error) {
        setTranscript('Failed to start speech recognition');
        setIsListening(false);
        speechService.speak('Failed to start speech recognition');
      }
    }
  };

  const testTextToSpeech = () => {
    try {
      speechService.speak('Hello, this is Polaris accessibility auditor. Voice interface is working correctly. You can now use voice commands to control the application.');
    } catch (error) {
      setTranscript('Text-to-speech failed. Please check your browser settings.');
    }
  };
  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-6 gradient-text animated-gradient">
            Voice Interface
          </h1>
          <p className="text-xl text-white/80">
            Control Polaris with natural voice commands for hands-free accessibility testing
          </p>
          {!isSupported && (
            <div className="mt-4 p-4 bg-red-900/50 rounded-lg border border-red-500/50">
              <p className="text-red-300">Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.</p>
            </div>
          )}
        </div>

        {/* Voice Control Center */}
        <div className="bg-gray-900/50 rounded-xl p-8 border border-white/10 mb-8">
          <div className="text-center mb-8">
            <button
              onClick={toggleListening}
              disabled={!isSupported}
              className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
                !isSupported 
                  ? 'bg-gray-600 cursor-not-allowed opacity-50' :
                isListening 
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 animate-pulse shadow-2xl shadow-red-500/50' 
                  : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:shadow-2xl hover:shadow-blue-500/50'
              }`}
              aria-label={isListening ? 'Stop listening' : 'Start listening'}
            >
              {isListening ? (
                <Square className="w-12 h-12 text-white" />
              ) : (
                <Mic className="w-12 h-12 text-white" />
              )}
            </button>
            
            <div className="mt-6">
              <h3 className="text-xl font-bold text-white mb-2">
                {!isSupported ? 'Not supported' : isListening ? 'Listening...' : 'Tap to start'}
              </h3>
              <p className="text-white/60">
                {isSupported ? 'Speak clearly and naturally. Try commands like "scan website" or "generate alt text".' : 'Speech recognition requires a supported browser.'}
              </p>
              {confidence > 0 && (
                <div className="mt-2">
                  <div className="text-sm text-white/60">Confidence: {Math.round(confidence * 100)}%</div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${confidence * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Audio Visualization */}
          {isListening && (
            <div className="flex items-center justify-center space-x-2 mb-6">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-gradient-to-t from-purple-500 to-blue-500 rounded-full animate-pulse"
                  style={{
                    height: `${Math.random() * 40 + 10}px`,
                    animationDelay: `${i * 0.1}s`
                  }}
                ></div>
              ))}
            </div>
          )}

          {/* Transcript */}
          <div className="bg-gray-800/50 rounded-lg p-6 border border-white/10 min-h-[100px] flex items-center justify-center">
            {transcript ? (
              <div className="text-center">
                <p className="text-white text-lg mb-2">{transcript}</p>
                {isListening && (
                  <div className="text-sm text-white/60">
                    {confidence > 0.8 ? '🟢 High confidence' : 
                     confidence > 0.5 ? '🟡 Medium confidence' : 
                     confidence > 0 ? '🔴 Low confidence' : ''}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-white/40">Voice commands will appear here...</p>
            )}
          </div>
        </div>

        {/* Voice Commands */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-900/50 rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-6">Available Commands</h3>
            <div className="space-y-3">
              {speechService.getRegisteredCommands().map((command, index) => (
                <div
                  key={index}
                  onClick={() => command.action()}
                  className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-white/5 hover:bg-gray-800/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-4">
                    <Volume2 className="w-5 h-5 text-blue-400" />
                    <div>
                      <div className="text-white font-medium">"{command.command}"</div>
                      <div className="text-white/60 text-sm">{command.description}</div>
                    </div>
                  </div>
                  <button className="text-purple-400 hover:text-purple-300 text-sm">
                    Try it
                  </button>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <button
                onClick={testTextToSpeech}
                className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-3 rounded-lg font-medium hover:shadow-lg transition-all"
              >
                Test Text-to-Speech
              </button>
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-6">Voice Settings</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-white/80 mb-3">Voice Sensitivity</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  defaultValue="70"
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
              
              <div>
                <label className="block text-white/80 mb-3">Language</label>
                <select className="w-full bg-gray-800/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-blue-400 focus:outline-none">
                  <option>English (US)</option>
                  <option>English (UK)</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-white/80">Wake Word Detection</span>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-colors">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6"></span>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-white/80">Voice Feedback</span>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-colors">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6"></span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Voice Commands */}
        <div className="mt-8 bg-gray-900/50 rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-6">Recent Commands</h3>
          <div className="space-y-3">
            {[
              { command: 'Scan homepage for accessibility issues', time: '2 minutes ago', status: 'completed' },
              { command: 'Generate alt text for product images', time: '5 minutes ago', status: 'completed' },
              { command: 'Show WCAG compliance report', time: '10 minutes ago', status: 'completed' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-white/5">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${
                    item.status === 'completed' ? 'bg-green-400' : 'bg-yellow-400'
                  }`}></div>
                  <span className="text-white">{item.command}</span>
                </div>
                <span className="text-white/60 text-sm">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceInterface;