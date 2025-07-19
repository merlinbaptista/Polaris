import React from 'react';
import { TrendingUp, AlertTriangle, CheckCircle, Target } from 'lucide-react';

const AccessibilityDashboard = () => {
  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-6 gradient-text animated-gradient">
            Accessibility Dashboard
          </h1>
          <p className="text-xl text-white/80">
            Comprehensive overview of your accessibility metrics and compliance status
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white counter" data-target="92">92</div>
                <div className="text-sm text-gray-400">Overall Score</div>
              </div>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full w-[92%] bg-gradient-to-r from-green-400 to-blue-500 rounded-full progress-bar"></div>
            </div>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white counter" data-target="847">847</div>
                <div className="text-sm text-gray-400">Passed Tests</div>
              </div>
            </div>
            <div className="text-green-400 text-sm">+12% from last week</div>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white counter" data-target="23">23</div>
                <div className="text-sm text-gray-400">Issues Found</div>
              </div>
            </div>
            <div className="text-red-400 text-sm">-5% from last week</div>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white counter" data-target="98">98</div>
                <div className="text-sm text-gray-400">Compliance %</div>
              </div>
            </div>
            <div className="text-green-400 text-sm">+8% from last month</div>
          </div>
        </div>

        {/* Charts and Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-gray-900/50 rounded-xl p-8 border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-6">Accessibility Trends</h3>
            <div className="h-64 relative">
              <svg className="w-full h-full" viewBox="0 0 400 200">
                <defs>
                  <linearGradient id="trendGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="50%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>
                <path
                  d="M 20 180 Q 100 120 200 100 T 380 80"
                  stroke="url(#trendGradient)"
                  strokeWidth="3"
                  fill="none"
                  className="animate-draw"
                />
                <circle cx="20" cy="180" r="4" fill="#8B5CF6" />
                <circle cx="200" cy="100" r="4" fill="#3B82F6" />
                <circle cx="380" cy="80" r="4" fill="#06B6D4" />
              </svg>
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-xl p-8 border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-6">Compliance Breakdown</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-white">WCAG 2.1 AA</span>
                  <span className="text-green-400">98%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full">
                  <div className="h-full w-[98%] bg-gradient-to-r from-green-400 to-blue-500 rounded-full progress-bar"></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-white">Section 508</span>
                  <span className="text-blue-400">94%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full">
                  <div className="h-full w-[94%] bg-gradient-to-r from-blue-400 to-purple-500 rounded-full progress-bar"></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-white">ADA Compliance</span>
                  <span className="text-purple-400">91%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full">
                  <div className="h-full w-[91%] bg-gradient-to-r from-purple-400 to-pink-500 rounded-full progress-bar"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Issues */}
        <div className="bg-gray-900/50 rounded-xl p-8 border border-white/10">
          <h3 className="text-2xl font-bold text-white mb-6">Recent Issues</h3>
          <div className="space-y-4">
            {[
              { type: 'Critical', message: 'Missing alt text on product images', page: 'Product Gallery', priority: 'high' },
              { type: 'Warning', message: 'Low contrast ratio on secondary buttons', page: 'Homepage', priority: 'medium' },
              { type: 'Info', message: 'Consider adding skip navigation links', page: 'All Pages', priority: 'low' }
            ].map((issue, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-white/5">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${
                    issue.priority === 'high' ? 'bg-red-400' : 
                    issue.priority === 'medium' ? 'bg-yellow-400' : 'bg-blue-400'
                  }`}></div>
                  <div>
                    <div className="text-white font-medium">{issue.message}</div>
                    <div className="text-gray-400 text-sm">{issue.page}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    issue.type === 'Critical' ? 'bg-red-900 text-red-300' :
                    issue.type === 'Warning' ? 'bg-yellow-900 text-yellow-300' :
                    'bg-blue-900 text-blue-300'
                  }`}>
                    {issue.type}
                  </span>
                  <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">
                    Fix Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityDashboard;