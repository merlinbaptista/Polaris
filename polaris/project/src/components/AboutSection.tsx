import React from 'react';
import { Zap, Users, Globe, Award, CheckCircle } from 'lucide-react';

const AboutSection = () => {
  return (
    <section className="py-24 px-6" id="about">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-8 gradient-text animated-gradient">
              About Polaris
            </h2>
            
            <div className="space-y-6 text-lg text-white/80 leading-relaxed">
              <p>
                Polaris is a revolutionary accessibility auditing tool designed to make digital experiences 
                inclusive for everyone. Built with cutting-edge AI technology and deep accessibility 
                expertise, we help designers and developers create products that work for all users.
              </p>
              
              <p>
                Our mission is to eliminate accessibility barriers in digital design by providing intelligent, 
                automated tools that integrate seamlessly into existing workflows. From WCAG compliance 
                to real-time accessibility insights, Polaris guides teams toward more inclusive design 
                practices.
              </p>
            </div>

            <div className="mt-8">
              <h3 className="text-2xl font-bold text-white mb-6">Key Features:</h3>
              <div className="space-y-4">
                {[
                  { icon: Zap, text: 'AI-powered accessibility analysis', color: 'from-yellow-400 to-orange-500' },
                  { icon: Users, text: 'Real-time compliance monitoring', color: 'from-blue-400 to-purple-500' },
                  { icon: Globe, text: 'Voice-controlled interface', color: 'from-green-400 to-teal-500' },
                  { icon: Award, text: 'Accessibility simulation modes', color: 'from-purple-400 to-pink-500' }
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center`}>
                      <feature.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white/80">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-white/10">
              <div className="mb-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">Accessibility Certified</div>
                    <div className="text-gray-400 text-sm">WCAG 2.1 AAA Compliant</div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-400 mb-1">500K+</div>
                  <div className="text-gray-400 text-sm">Scans Completed</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-1">99.9%</div>
                  <div className="text-gray-400 text-sm">Accuracy Rate</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Processing Speed</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-sm">Real-time</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">AI Accuracy</span>
                  <span className="text-blue-400">97.8%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Standards Coverage</span>
                  <span className="text-purple-400">Complete</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;