import React, { useState } from 'react';
import Hero from './components/Hero';
import FeatureGrid from './components/FeatureGrid';
import UploadScan from './components/UploadScan';
import AccessibilityDashboard from './components/AccessibilityDashboard';
import AltTextGenerator from './components/AltTextGenerator';
import VoiceInterface from './components/VoiceInterface';
import ComplianceCenter from './components/ComplianceCenter';
import SimulationMode from './components/SimulationMode';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import Navigation from './components/Navigation';

function App() {
  const [activeSection, setActiveSection] = useState('home');

  // Handle URL hash changes for direct navigation
  React.useEffect(() => {
    // Custom navigation event listener
    const handleCustomNavigation = (event: any) => {
      setActiveSection(event.detail);
      window.location.hash = event.detail;
    };
    
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash) {
        setActiveSection(hash);
      }
    };

    // Check initial hash
    handleHashChange();
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('navigate', handleCustomNavigation);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('navigate', handleCustomNavigation);
    };
  }, []);

  // Update URL when section changes
  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    if (section !== 'home') {
      window.location.hash = section;
    } else {
      window.location.hash = '';
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'upload':
        return <UploadScan />;
      case 'dashboard':
        return <AccessibilityDashboard />;
      case 'alttext':
        return <AltTextGenerator />;
      case 'voice':
        return <VoiceInterface />;
      case 'compliance':
        return <ComplianceCenter />;
      case 'simulation':
        return <SimulationMode />;
      case 'about':
        return <AboutSection />;
      case 'contact':
        return <ContactSection />;
      default:
        return (
          <>
            <Hero />
            <FeatureGrid onSectionChange={setActiveSection} />
            <AboutSection />
            <ContactSection />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-teal-900/20 pointer-events-none" />
      <div className="geometric-pattern" />
      
      <Navigation activeSection={activeSection} onSectionChange={handleSectionChange} />
      
      <main className="relative z-10">
        <div key={activeSection}>
          {renderSection()}
        </div>
      </main>
    </div>
  );
}

export default App;