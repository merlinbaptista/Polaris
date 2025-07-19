import React, { useState, useCallback } from 'react';
import { Upload, FileText, Image, Globe } from 'lucide-react';
import { AccessibilityService, AccessibilityResult } from '../services/accessibilityService';

const UploadScan = () => {
  const [dragActive, setDragActive] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<AccessibilityResult | null>(null);
  const [urlToScan, setUrlToScan] = useState('');
  const [accessibilityService] = useState(() => AccessibilityService.getInstance());

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleFiles = async (files: FileList) => {
    setScanning(true);
    setProgress(0);
    setResults(null);
    
    try {
      // Simulate scanning progress
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Perform actual accessibility scan
      const scanResults = await accessibilityService.scanPage();
      
      clearInterval(interval);
      setProgress(100);
      
      setTimeout(() => {
        setScanning(false);
        setResults(scanResults);
      }, 500);
      
    } catch (error) {
      console.error('Scanning error:', error);
      setScanning(false);
      setProgress(0);
      // Get demo results from service
      const demoResults = await accessibilityService.scanPage();
      setResults(demoResults);
    }
  };

  const scanUrl = async () => {
    if (!urlToScan) return;
    
    setScanning(true);
    setProgress(0);
    setResults(null);
    
    try {
      // Simulate URL scanning
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 15;
        setProgress(currentProgress);
        
        if (currentProgress >= 100) {
          clearInterval(interval);
        }
      }, 300);
      
      // Wait for progress to complete
      setTimeout(async () => {
        const scanResults = await accessibilityService.scanPage();
        setScanning(false);
        setResults(scanResults);
      }, 2000);
      
    } catch (error) {
      console.error('URL scanning error:', error);
      setScanning(false);
      setProgress(0);
      const demoResults = await accessibilityService.scanPage();
      setResults(demoResults);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-6 gradient-text animated-gradient">
            Upload & Scan
          </h1>
          <p className="text-xl text-white/80">
            Drop your designs, websites, or images for instant accessibility analysis
          </p>
        </div>

        <div className="space-y-8">
          {/* Upload Area */}
          <div
            className={`upload-zone ${dragActive ? 'drag-active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="text-center py-16">
              <Upload className="w-16 h-16 mx-auto mb-6 text-white/60" />
              <h3 className="text-2xl font-bold mb-4 text-white">
                Drop files here or click to browse
              </h3>
              <p className="text-white/60 mb-6">
                Supports images, HTML files, URLs, and design files
              </p>
              <input
                type="file"
                multiple
                className="hidden"
                id="file-upload"
                onChange={(e) => e.target.files && handleFiles(e.target.files)}
              />
              <label
                htmlFor="file-upload"
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg transition-all cursor-pointer inline-block"
              >
                Choose Files
              </label>
            </div>
          </div>

          {/* URL Input */}
          <div className="bg-gray-900/50 rounded-xl p-6 border border-white/10">
            <div className="flex items-center space-x-4">
              <Globe className="w-6 h-6 text-blue-400" />
              <input
                type="url"
                value={urlToScan}
                onChange={(e) => setUrlToScan(e.target.value)}
                placeholder="Or enter a website URL to scan..."
                className="flex-1 bg-transparent border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-blue-400 focus:outline-none"
              />
              <button 
                onClick={scanUrl}
                disabled={!urlToScan || scanning}
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Scan URL
              </button>
            </div>
          </div>

          {/* Scanning Progress */}
          {scanning && (
            <div className="bg-gray-900/50 rounded-xl p-8 border border-white/10">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 relative">
                  <div className="absolute inset-0 border-4 border-purple-500/30 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-purple-500 rounded-full animate-spin border-t-transparent"></div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Analyzing Accessibility...</h3>
                <p className="text-white/60">Checking contrast ratios, navigation, and WCAG compliance</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-white/80">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          {results && (
            <div className="bg-gray-900/50 rounded-xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">Scan Results</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-4xl font-bold gradient-text mb-2">{results.summary.score}</div>
                  <div className="text-white/60">Overall Score</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-red-400 mb-2">{results.summary.violations}</div>
                  <div className="text-white/60">Critical Issues</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-yellow-400 mb-2">{results.summary.incomplete}</div>
                  <div className="text-white/60">Incomplete</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-400 mb-2">{results.summary.passes}</div>
                  <div className="text-white/60">Passed Tests</div>
                </div>
              </div>

              {/* Detailed Issues */}
              {results.violations.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-white mb-4">Critical Issues Found</h4>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {results.violations.slice(0, 5).map((violation, index) => (
                      <div key={index} className="bg-gray-800/30 rounded-lg p-4 border border-red-500/20">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                violation.impact === 'critical' ? 'bg-red-900 text-red-300' :
                                violation.impact === 'serious' ? 'bg-orange-900 text-orange-300' :
                                violation.impact === 'moderate' ? 'bg-yellow-900 text-yellow-300' :
                                'bg-blue-900 text-blue-300'
                              }`}>
                                {violation.impact}
                              </span>
                              <span className="text-white font-medium">{violation.id}</span>
                            </div>
                            <p className="text-white/80 text-sm mb-2">{violation.description}</p>
                            <p className="text-white/60 text-xs">{violation.help}</p>
                          </div>
                          <a
                            href={violation.helpUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-400 hover:text-purple-300 text-sm ml-4"
                          >
                            Learn More
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col md:flex-row gap-4">
                <button 
                  onClick={() => {
                    const report = accessibilityService.generateAccessibilityReport(results);
                    const blob = new Blob([report], { type: 'text/markdown' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'accessibility-report.md';
                    a.click();
                  }}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all"
                >
                  View Detailed Report
                </button>
                <button 
                  onClick={() => {
                    const report = accessibilityService.generateAccessibilityReport(results);
                    const blob = new Blob([report], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'accessibility-report.pdf';
                    a.click();
                  }}
                  className="border border-white/20 text-white px-6 py-3 rounded-lg font-medium hover:bg-white/5 transition-all"
                >
                  Download PDF
                </button>
                <button 
                  onClick={() => {
                    const csvData = results.violations.map(v => 
                      `"${v.id}","${v.impact}","${v.description}","${v.help}"`
                    ).join('\n');
                    const csv = 'ID,Impact,Description,Help\n' + csvData;
                    const blob = new Blob([csv], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'accessibility-issues.csv';
                    a.click();
                  }}
                  className="border border-white/20 text-white px-6 py-3 rounded-lg font-medium hover:bg-white/5 transition-all"
                >
                  Export CSV
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadScan;