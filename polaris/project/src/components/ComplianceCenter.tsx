import React, { useState } from 'react';
import { Shield, Download, CheckCircle, AlertCircle, Clock } from 'lucide-react';

const ComplianceCenter = () => {
  const [selectedStandard, setSelectedStandard] = useState('wcag');

  const complianceData = {
    wcag: {
      name: 'WCAG 2.1 AA',
      score: 94,
      passed: 127,
      failed: 8,
      items: [
        { id: '1.1.1', title: 'Non-text Content', status: 'passed', description: 'All images have appropriate alt text' },
        { id: '1.3.1', title: 'Info and Relationships', status: 'passed', description: 'Content structure is properly marked up' },
        { id: '1.4.3', title: 'Contrast (Minimum)', status: 'failed', description: '3 elements below 4.5:1 contrast ratio' },
        { id: '2.1.1', title: 'Keyboard', status: 'passed', description: 'All functionality available via keyboard' },
        { id: '2.4.1', title: 'Bypass Blocks', status: 'warning', description: 'Skip navigation could be improved' },
        { id: '3.1.1', title: 'Language of Page', status: 'passed', description: 'Page language is properly declared' }
      ]
    },
    section508: {
      name: 'Section 508',
      score: 91,
      passed: 89,
      failed: 9,
      items: [
        { id: 'A', title: 'Text Equivalents', status: 'passed', description: 'Alternative text provided for images' },
        { id: 'B', title: 'Multimedia', status: 'passed', description: 'Captions available for video content' },
        { id: 'C', title: 'Color', status: 'failed', description: 'Some information conveyed by color alone' },
        { id: 'D', title: 'Style Sheets', status: 'passed', description: 'Content readable without stylesheets' }
      ]
    },
    ada: {
      name: 'ADA Compliance',
      score: 88,
      passed: 76,
      failed: 10,
      items: [
        { id: 'Title I', title: 'Employment', status: 'passed', description: 'Job application forms are accessible' },
        { id: 'Title II', title: 'Public Services', status: 'warning', description: 'Some government forms need improvement' },
        { id: 'Title III', title: 'Public Accommodations', status: 'passed', description: 'Website meets public access requirements' }
      ]
    }
  };

  const currentData = complianceData[selectedStandard as keyof typeof complianceData];

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-6 gradient-text animated-gradient">
            Compliance Center
          </h1>
          <p className="text-xl text-white/80">
            Track your compliance with WCAG 2.1, Section 508, and ADA standards
          </p>
        </div>

        {/* Standard Selector */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {Object.entries(complianceData).map(([key, data]) => (
            <button
              key={key}
              onClick={() => setSelectedStandard(key)}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                selectedStandard === key
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                  : 'bg-gray-800/50 text-white/70 hover:bg-gray-800 hover:text-white border border-white/20'
              }`}
            >
              {data.name}
            </button>
          ))}
        </div>

        {/* Compliance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-900/50 rounded-xl p-6 border border-white/10 text-center">
            <div className="w-16 h-16 mx-auto mb-4 relative">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke="#374151"
                  strokeWidth="8"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke="url(#scoreGradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${currentData.score * 1.76} 176`}
                  className="progress-circle"
                />
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">{currentData.score}%</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white">Overall Score</h3>
            <p className="text-white/60">{currentData.name}</p>
          </div>

          <div className="bg-gray-900/50 rounded-xl p-6 border border-white/10 text-center">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-400" />
            <h3 className="text-3xl font-bold text-green-400 mb-2">{currentData.passed}</h3>
            <p className="text-white/60">Tests Passed</p>
          </div>

          <div className="bg-gray-900/50 rounded-xl p-6 border border-white/10 text-center">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
            <h3 className="text-3xl font-bold text-red-400 mb-2">{currentData.failed}</h3>
            <p className="text-white/60">Issues Found</p>
          </div>
        </div>

        {/* Detailed Checklist */}
        <div className="bg-gray-900/50 rounded-xl p-8 border border-white/10 mb-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-white">{currentData.name} Checklist</h3>
            <div className="flex space-x-4">
              <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export Report</span>
              </button>
              <button className="border border-white/20 text-white px-6 py-3 rounded-lg font-medium hover:bg-white/5 transition-all">
                Schedule Audit
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {currentData.items.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-6 bg-gray-800/30 rounded-lg border border-white/5 hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    item.status === 'passed' ? 'bg-green-500' :
                    item.status === 'failed' ? 'bg-red-500' :
                    'bg-yellow-500'
                  }`}>
                    {item.status === 'passed' ? (
                      <CheckCircle className="w-5 h-5 text-white" />
                    ) : item.status === 'failed' ? (
                      <AlertCircle className="w-5 h-5 text-white" />
                    ) : (
                      <Clock className="w-5 h-5 text-white" />
                    )}
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-3">
                      <span className="text-white font-medium">{item.id}</span>
                      <span className="text-white text-lg">{item.title}</span>
                    </div>
                    <p className="text-white/60 mt-1">{item.description}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                    item.status === 'passed' ? 'bg-green-900 text-green-300' :
                    item.status === 'failed' ? 'bg-red-900 text-red-300' :
                    'bg-yellow-900 text-yellow-300'
                  }`}>
                    {item.status}
                  </span>
                  {item.status !== 'passed' && (
                    <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">
                      Fix Issue
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Report Generation */}
        <div className="bg-gray-900/50 rounded-xl p-8 border border-white/10">
          <h3 className="text-2xl font-bold text-white mb-6">Generate Compliance Report</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800/30 rounded-lg p-6 border border-white/5 hover:bg-gray-800/50 transition-colors cursor-pointer">
              <Shield className="w-8 h-8 text-blue-400 mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">Executive Summary</h4>
              <p className="text-white/60 text-sm">High-level overview for stakeholders</p>
            </div>
            
            <div className="bg-gray-800/30 rounded-lg p-6 border border-white/5 hover:bg-gray-800/50 transition-colors cursor-pointer">
              <CheckCircle className="w-8 h-8 text-green-400 mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">Detailed Technical</h4>
              <p className="text-white/60 text-sm">Complete technical findings and fixes</p>
            </div>
            
            <div className="bg-gray-800/30 rounded-lg p-6 border border-white/5 hover:bg-gray-800/50 transition-colors cursor-pointer">
              <Download className="w-8 h-8 text-purple-400 mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">Remediation Plan</h4>
              <p className="text-white/60 text-sm">Step-by-step improvement roadmap</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceCenter;