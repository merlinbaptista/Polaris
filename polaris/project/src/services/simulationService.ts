export type SimulationType = 'protanopia' | 'deuteranopia' | 'tritanopia' | 'monochromacy' | 
                             'blur' | 'tunnel' | 'cataracts' | 'glaucoma' |
                             'tremor' | 'limited-mobility' | 'one-handed' |
                             'dyslexia' | 'adhd' | 'memory-loss';

export interface SimulationFilter {
  id: SimulationType;
  name: string;
  category: 'vision' | 'motor' | 'cognitive';
  cssFilter: string;
  description: string;
}

export class SimulationService {
  private static instance: SimulationService;
  private activeFilters: Set<SimulationType> = new Set();
  private originalStyles: Map<Element, string> = new Map();

  public static getInstance(): SimulationService {
    if (!SimulationService.instance) {
      SimulationService.instance = new SimulationService();
    }
    return SimulationService.instance;
  }

  private filters: SimulationFilter[] = [
    // Color Vision Deficiencies
    {
      id: 'protanopia',
      name: 'Protanopia (Red-blind)',
      category: 'vision',
      cssFilter: 'sepia(100%) saturate(0%) hue-rotate(90deg)',
      description: 'Difficulty distinguishing red and green colors'
    },
    {
      id: 'deuteranopia',
      name: 'Deuteranopia (Green-blind)',
      category: 'vision',
      cssFilter: 'sepia(100%) saturate(0%) hue-rotate(180deg)',
      description: 'Most common form of color blindness'
    },
    {
      id: 'tritanopia',
      name: 'Tritanopia (Blue-blind)',
      category: 'vision',
      cssFilter: 'sepia(100%) saturate(0%) hue-rotate(270deg)',
      description: 'Difficulty distinguishing blue and yellow colors'
    },
    {
      id: 'monochromacy',
      name: 'Monochromacy (Complete color blindness)',
      category: 'vision',
      cssFilter: 'grayscale(100%)',
      description: 'Complete absence of color vision'
    },
    
    // Low Vision
    {
      id: 'blur',
      name: 'Blurred Vision',
      category: 'vision',
      cssFilter: 'blur(2px)',
      description: 'Simulates various causes of blurred vision'
    },
    {
      id: 'tunnel',
      name: 'Tunnel Vision',
      category: 'vision',
      cssFilter: 'contrast(150%) brightness(150%)',
      description: 'Loss of peripheral vision'
    },
    {
      id: 'cataracts',
      name: 'Cataracts',
      category: 'vision',
      cssFilter: 'blur(1px) opacity(0.8) contrast(1.2)',
      description: 'Clouding of the eye lens'
    },
    {
      id: 'glaucoma',
      name: 'Glaucoma',
      category: 'vision',
      cssFilter: 'contrast(200%) brightness(50%)',
      description: 'Damage to the optic nerve'
    }
  ];

  public getFilters(): SimulationFilter[] {
    return [...this.filters];
  }

  public getFiltersByCategory(category: 'vision' | 'motor' | 'cognitive'): SimulationFilter[] {
    return this.filters.filter(filter => filter.category === category);
  }

  public applySimulation(type: SimulationType, element?: Element): void {
    const filter = this.filters.find(f => f.id === type);
    if (!filter) return;

    const targetElement = element || document.body;
    
    // Store original styles if not already stored
    if (!this.originalStyles.has(targetElement)) {
      this.originalStyles.set(targetElement, targetElement.style.filter || '');
    }

    this.activeFilters.add(type);
    this.updateElementFilters(targetElement);
  }

  public removeSimulation(type: SimulationType, element?: Element): void {
    const targetElement = element || document.body;
    
    this.activeFilters.delete(type);
    
    if (this.activeFilters.size === 0) {
      // Restore original styles
      const originalFilter = this.originalStyles.get(targetElement) || '';
      targetElement.style.filter = originalFilter;
      this.originalStyles.delete(targetElement);
    } else {
      this.updateElementFilters(targetElement);
    }
  }

  public toggleSimulation(type: SimulationType, element?: Element): boolean {
    if (this.activeFilters.has(type)) {
      this.removeSimulation(type, element);
      return false;
    } else {
      this.applySimulation(type, element);
      return true;
    }
  }

  public clearAllSimulations(element?: Element): void {
    const targetElement = element || document.body;
    
    this.activeFilters.clear();
    
    // Restore original styles
    const originalFilter = this.originalStyles.get(targetElement) || '';
    targetElement.style.filter = originalFilter;
    this.originalStyles.delete(targetElement);
  }

  public getActiveSimulations(): SimulationType[] {
    return Array.from(this.activeFilters);
  }

  public isSimulationActive(type: SimulationType): boolean {
    return this.activeFilters.has(type);
  }

  private updateElementFilters(element: Element): void {
    const activeFilterStrings = Array.from(this.activeFilters)
      .map(type => this.filters.find(f => f.id === type)?.cssFilter)
      .filter(Boolean);

    const originalFilter = this.originalStyles.get(element) || '';
    const combinedFilters = originalFilter ? 
      `${originalFilter} ${activeFilterStrings.join(' ')}` : 
      activeFilterStrings.join(' ');

    (element as HTMLElement).style.filter = combinedFilters;
  }

  // Motor impairment simulations
  public simulateHandTremor(element?: Element): void {
    const targetElement = element || document.body;
    
    // Add tremor animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes tremor {
        0%, 100% { transform: translate(0px, 0px); }
        25% { transform: translate(1px, -1px); }
        50% { transform: translate(-1px, 1px); }
        75% { transform: translate(1px, 1px); }
      }
      .tremor-simulation {
        animation: tremor 0.1s infinite;
      }
    `;
    document.head.appendChild(style);
    
    (targetElement as HTMLElement).classList.add('tremor-simulation');
  }

  public removeHandTremor(element?: Element): void {
    const targetElement = element || document.body;
    (targetElement as HTMLElement).classList.remove('tremor-simulation');
  }

  // Cognitive impairment simulations
  public simulateDyslexia(element?: Element): void {
    const targetElement = element || document.body;
    
    // Add dyslexia-friendly styles
    const style = document.createElement('style');
    style.textContent = `
      .dyslexia-simulation * {
        font-family: 'OpenDyslexic', Arial, sans-serif !important;
        letter-spacing: 0.1em !important;
        line-height: 1.6 !important;
      }
    `;
    document.head.appendChild(style);
    
    (targetElement as HTMLElement).classList.add('dyslexia-simulation');
  }

  public removeDyslexia(element?: Element): void {
    const targetElement = element || document.body;
    (targetElement as HTMLElement).classList.remove('dyslexia-simulation');
  }

  public simulateADHD(element?: Element): void {
    const targetElement = element || document.body;
    
    // Reduce animations and distractions
    const style = document.createElement('style');
    style.textContent = `
      .adhd-simulation * {
        animation-duration: 0s !important;
        transition-duration: 0s !important;
      }
      .adhd-simulation .animated-gradient {
        background: linear-gradient(45deg, #8B5CF6, #3B82F6) !important;
        background-clip: text !important;
        -webkit-background-clip: text !important;
        -webkit-text-fill-color: transparent !important;
      }
    `;
    document.head.appendChild(style);
    
    (targetElement as HTMLElement).classList.add('adhd-simulation');
  }

  public removeADHD(element?: Element): void {
    const targetElement = element || document.body;
    (targetElement as HTMLElement).classList.remove('adhd-simulation');
  }
}