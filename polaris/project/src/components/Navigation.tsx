import React from 'react';
import { ArrowLeft, Home } from 'lucide-react';

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeSection, onSectionChange }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {activeSection !== 'home' && (
            <button
              onClick={() => onSectionChange('home')}
              className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors"
              aria-label="Go back to home"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
          )}
          
          <button
            onClick={() => onSectionChange('home')}
            className="flex items-center space-x-2"
            aria-label="Polaris home"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 via-green-400 via-blue-400 via-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-white">
                <path fill="currentColor" d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"/>
              </svg>
            </div>
            <span className="font-bold gradient-text text-xl">Polaris</span>
          </button>
        </div>

        <div className="flex items-center space-x-6">
          <button className="text-white/70 hover:text-white transition-colors">
            Documentation
          </button>
          <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all">
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;