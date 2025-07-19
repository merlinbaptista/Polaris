import React from 'react';
import { ChevronDown } from 'lucide-react';

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-20">
      <div className="max-w-6xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 gradient-text animated-gradient">
            Design for everyone.<br />
            Include everyone.
          </h1>
          <h2 className="text-2xl md:text-3xl mb-6 gradient-text-secondary">
            Polaris - AI-Powered Accessibility Auditor
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Transform your digital experiences with intelligent accessibility insights. 
            Polaris combines cutting-edge AI with comprehensive WCAG compliance to ensure 
            every user can access and enjoy your products.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 justify-center mb-16">
          <button 
            onClick={() => {
              const event = new CustomEvent('navigate', { detail: 'upload' });
              window.dispatchEvent(event);
            }}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-xl font-medium text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            Start Your Audit
          </button>
          <button 
            onClick={() => {
              const event = new CustomEvent('navigate', { detail: 'about' });
              window.dispatchEvent(event);
            }}
            className="border border-white/20 text-white px-8 py-4 rounded-xl font-medium text-lg hover:bg-white/5 hover:border-white/40 transition-all duration-300"
          >
            Watch Demo
          </button>
        </div>

        <div className="relative mx-auto max-w-4xl">
          <div className="floating-mockup">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 shadow-2xl border border-white/10">
              <div className="bg-black rounded-xl p-6 mb-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                    <span className="text-white font-bold">92</span>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-white">Accessibility Score</div>
                    <div className="text-sm text-gray-400">WCAG 2.1 AA Compliant</div>
                  </div>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full w-[92%] bg-gradient-to-r from-green-400 to-blue-500 rounded-full progress-bar"></div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">98%</div>
                  <div className="text-sm text-gray-400">Contrast</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400">94%</div>
                  <div className="text-sm text-gray-400">Navigation</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-400">89%</div>
                  <div className="text-sm text-gray-400">Forms</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-white/50" />
        </div>
      </div>
    </section>
  );
};

export default Hero;