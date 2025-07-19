import React from 'react';
import { Upload, BarChart3, Image, Mic, Shield, Eye } from 'lucide-react';

interface FeatureGridProps {
  onSectionChange: (section: string) => void;
}

const FeatureGrid: React.FC<FeatureGridProps> = ({ onSectionChange }) => {
  const features = [
    {
      id: 'upload',
      icon: Upload,
      title: 'Upload & Scan',
      description: 'Drag and drop your designs for instant accessibility analysis',
      gradient: 'from-purple-500 to-blue-500'
    },
    {
      id: 'dashboard',
      icon: BarChart3,
      title: 'Accessibility Dashboard',
      description: 'Comprehensive overview of your accessibility metrics',
      gradient: 'from-blue-500 to-teal-500'
    },
    {
      id: 'alttext',
      icon: Image,
      title: 'AI Alt-Text Generator',
      description: 'Generate perfect alt text using advanced AI technology',
      gradient: 'from-teal-500 to-green-500'
    },
    {
      id: 'voice',
      icon: Mic,
      title: 'Voice Interface',
      description: 'Control Polaris with natural voice commands',
      gradient: 'from-green-500 to-yellow-500'
    },
    {
      id: 'compliance',
      icon: Shield,
      title: 'Compliance Center',
      description: 'Track WCAG 2.1, Section 508, and ADA compliance',
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      id: 'simulation',
      icon: Eye,
      title: 'Simulation Mode',
      description: 'Experience your design through different accessibility needs',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 gradient-text animated-gradient">
            Powerful Features
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Everything you need to create inclusive, accessible experiences for all users
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={feature.id}
                onClick={() => onSectionChange(feature.id)}
                className="feature-card group cursor-pointer"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSectionChange(feature.id);
                  }
                }}
                aria-label={`Explore ${feature.title}`}
              >
                <div className="p-8">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4 text-white group-hover:gradient-text transition-all duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-400 mb-6 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  <div className="flex items-center text-purple-400 group-hover:text-white transition-colors">
                    <span className="font-medium">Explore Mode</span>
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;