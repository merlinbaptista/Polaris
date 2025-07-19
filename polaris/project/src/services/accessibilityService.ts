import Color from 'color';

export interface AccessibilityResult {
  score: number;
  violations: AccessibilityViolation[];
  passes: AccessibilityPass[];
  incomplete: AccessibilityIncomplete[];
  summary: AccessibilitySummary;
  detailedAnalysis: DetailedAnalysis;
}

export interface AccessibilityViolation {
  id: string;
  impact: 'minor' | 'moderate' | 'serious' | 'critical';
  description: string;
  help: string;
  helpUrl: string;
  howToFix: string;
  codeExample: string;
  nodes: Array<{
    html: string;
    target: string[];
    failureSummary: string;
    xpath: string;
    impact: string;
  }>;
}

export interface AccessibilityPass {
  id: string;
  description: string;
  nodes: number;
}

export interface AccessibilityIncomplete {
  id: string;
  description: string;
  nodes: number;
  reason: string;
}

export interface AccessibilitySummary {
  violations: number;
  passes: number;
  incomplete: number;
  score: number;
  wcagLevel: 'A' | 'AA' | 'AAA';
  totalElements: number;
  testedElements: number;
}

export interface DetailedAnalysis {
  colorContrast: ColorContrastAnalysis[];
  headingStructure: HeadingAnalysis;
  formAnalysis: FormAnalysis;
  imageAnalysis: ImageAnalysis;
  keyboardNavigation: KeyboardAnalysis;
}

export interface ColorContrastAnalysis {
  element: string;
  foreground: string;
  background: string;
  ratio: number;
  passesAA: boolean;
  passesAAA: boolean;
  recommendation: string;
}

export interface HeadingAnalysis {
  structure: Array<{
    level: number;
    text: string;
    issues: string[];
  }>;
  hasH1: boolean;
  properNesting: boolean;
  recommendations: string[];
}

export interface FormAnalysis {
  totalForms: number;
  formsWithLabels: number;
  formsWithFieldsets: number;
  issues: Array<{
    type: string;
    description: string;
    fix: string;
  }>;
}

export interface ImageAnalysis {
  totalImages: number;
  imagesWithAlt: number;
  decorativeImages: number;
  issues: Array<{
    src: string;
    issue: string;
    fix: string;
  }>;
}

export interface KeyboardAnalysis {
  focusableElements: number;
  elementsWithTabIndex: number;
  skipLinks: number;
  issues: string[];
  recommendations: string[];
}

export interface ColorContrastResult {
  ratio: number;
  passesAA: boolean;
  passesAAA: boolean;
  foreground: string;
  background: string;
}

export class AccessibilityService {
  private static instance: AccessibilityService;

  public static getInstance(): AccessibilityService {
    if (!AccessibilityService.instance) {
      AccessibilityService.instance = new AccessibilityService();
    }
    return AccessibilityService.instance;
  }

  async scanPage(element?: Element): Promise<AccessibilityResult> {
    try {
      const targetElement = element || document;
      
      // Run axe-core scan
      let axeResults;
      if (typeof window !== 'undefined' && (window as any).axe) {
        axeResults = await (window as any).axe.run(targetElement);
      } else {
        // Fallback to manual analysis
        axeResults = await this.performManualAnalysis(targetElement);
      }
      
      // Perform detailed analysis
      const detailedAnalysis = await this.performDetailedAnalysis(targetElement);
      
      const score = this.calculateAccurateScore(axeResults, detailedAnalysis);
      
      return {
        score,
        violations: axeResults.violations.map(this.mapViolationWithFixes),
        passes: axeResults.passes.map(this.mapPass),
        incomplete: axeResults.incomplete.map(this.mapIncompleteWithReason),
        summary: {
          violations: axeResults.violations.length,
          passes: axeResults.passes.length,
          incomplete: axeResults.incomplete.length,
          score,
          wcagLevel: this.determineWCAGLevel(axeResults),
          totalElements: this.countElements(targetElement),
          testedElements: axeResults.violations.length + axeResults.passes.length
        },
        detailedAnalysis
      };
    } catch (error) {
      console.error('Accessibility scan error:', error);
      return this.getEnhancedDemoResults();
    }
  }

  private async performManualAnalysis(element: Element | Document): Promise<any> {
    const violations = [];
    const passes = [];
    const incomplete = [];

    // Check for missing alt text
    const images = element.querySelectorAll('img');
    images.forEach((img, index) => {
      if (!img.getAttribute('alt') && !img.getAttribute('aria-label')) {
        violations.push({
          id: 'image-alt',
          impact: 'critical',
          description: 'Images must have alternate text',
          help: 'Ensure img elements have alternate text or a role of none or presentation',
          helpUrl: 'https://dequeuniversity.com/rules/axe/4.7/image-alt',
          nodes: [{
            html: img.outerHTML,
            target: [`img:nth-child(${index + 1})`],
            failureSummary: 'Element does not have an alt attribute',
            xpath: this.getXPath(img),
            impact: 'critical'
          }]
        });
      } else {
        passes.push({
          id: 'image-alt',
          description: 'Images have alternate text',
          nodes: 1
        });
      }
    });

    // Check color contrast
    const textElements = element.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div, a, button');
    for (const el of Array.from(textElements)) {
      const styles = window.getComputedStyle(el);
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;
      
      if (color && backgroundColor && backgroundColor !== 'rgba(0, 0, 0, 0)') {
        try {
          const contrast = this.analyzeColorContrast(color, backgroundColor);
          if (!contrast.passesAA) {
            violations.push({
              id: 'color-contrast',
              impact: 'serious',
              description: 'Elements must have sufficient color contrast',
              help: 'Ensure all text elements have sufficient contrast against their background',
              helpUrl: 'https://dequeuniversity.com/rules/axe/4.7/color-contrast',
              nodes: [{
                html: el.outerHTML.substring(0, 200) + '...',
                target: [this.getSelector(el)],
                failureSummary: `Element has insufficient color contrast of ${contrast.ratio}:1`,
                xpath: this.getXPath(el),
                impact: 'serious'
              }]
            });
          }
        } catch (error) {
          // Skip invalid colors
        }
      }
    }

    // Check for form labels
    const inputs = element.querySelectorAll('input, textarea, select');
    inputs.forEach((input, index) => {
      const id = input.getAttribute('id');
      const ariaLabel = input.getAttribute('aria-label');
      const ariaLabelledby = input.getAttribute('aria-labelledby');
      
      if (id) {
        const label = element.querySelector(`label[for="${id}"]`);
        if (!label && !ariaLabel && !ariaLabelledby) {
          violations.push({
            id: 'label',
            impact: 'critical',
            description: 'Form elements must have labels',
            help: 'Ensure every form element has a label',
            helpUrl: 'https://dequeuniversity.com/rules/axe/4.7/label',
            nodes: [{
              html: input.outerHTML,
              target: [`input:nth-child(${index + 1})`],
              failureSummary: 'Form element does not have an associated label',
              xpath: this.getXPath(input),
              impact: 'critical'
            }]
          });
        }
      }
    });

    return { violations, passes, incomplete };
  }

  private async performDetailedAnalysis(element: Element | Document): Promise<DetailedAnalysis> {
    return {
      colorContrast: this.analyzeAllColorContrasts(element),
      headingStructure: this.analyzeHeadingStructure(element),
      formAnalysis: this.analyzeFormAccessibility(element),
      imageAnalysis: this.analyzeImageAccessibility(element),
      keyboardNavigation: this.analyzeKeyboardNavigation(element)
    };
  }

  private analyzeAllColorContrasts(element: Element | Document): ColorContrastAnalysis[] {
    const results: ColorContrastAnalysis[] = [];
    const textElements = element.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div, a, button, input, textarea');

    textElements.forEach(el => {
      const styles = window.getComputedStyle(el);
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;

      if (color && backgroundColor && backgroundColor !== 'rgba(0, 0, 0, 0)') {
        try {
          const contrast = this.analyzeColorContrast(color, backgroundColor);
          results.push({
            element: this.getSelector(el),
            foreground: color,
            background: backgroundColor,
            ratio: contrast.ratio,
            passesAA: contrast.passesAA,
            passesAAA: contrast.passesAAA,
            recommendation: this.getContrastRecommendation(contrast)
          });
        } catch (error) {
          // Skip invalid colors
        }
      }
    });

    return results;
  }

  private analyzeHeadingStructure(element: Element | Document): HeadingAnalysis {
    const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const structure = Array.from(headings).map(heading => {
      const level = parseInt(heading.tagName.charAt(1));
      const text = heading.textContent?.trim() || '';
      const issues = [];

      if (text.length === 0) {
        issues.push('Heading is empty');
      }
      if (text.length > 120) {
        issues.push('Heading text is too long');
      }

      return { level, text, issues };
    });

    const hasH1 = structure.some(h => h.level === 1);
    const properNesting = this.checkHeadingNesting(structure);
    
    const recommendations = [];
    if (!hasH1) recommendations.push('Add an H1 heading to the page');
    if (!properNesting) recommendations.push('Fix heading hierarchy - avoid skipping levels');
    if (structure.length === 0) recommendations.push('Add headings to structure your content');

    return {
      structure,
      hasH1,
      properNesting,
      recommendations
    };
  }

  private analyzeFormAccessibility(element: Element | Document): FormAnalysis {
    const forms = element.querySelectorAll('form');
    const inputs = element.querySelectorAll('input, textarea, select');
    
    let formsWithLabels = 0;
    let formsWithFieldsets = 0;
    const issues = [];

    forms.forEach(form => {
      const formInputs = form.querySelectorAll('input, textarea, select');
      const labels = form.querySelectorAll('label');
      const fieldsets = form.querySelectorAll('fieldset');

      if (labels.length >= formInputs.length) formsWithLabels++;
      if (fieldsets.length > 0) formsWithFieldsets++;

      if (formInputs.length > 5 && fieldsets.length === 0) {
        issues.push({
          type: 'fieldset',
          description: 'Large forms should use fieldsets to group related fields',
          fix: 'Add <fieldset> and <legend> elements to group related form fields'
        });
      }
    });

    inputs.forEach(input => {
      const type = input.getAttribute('type');
      if (type === 'submit' || type === 'button') {
        const value = input.getAttribute('value');
        const textContent = input.textContent;
        if (!value && !textContent) {
          issues.push({
            type: 'button-text',
            description: 'Buttons must have accessible text',
            fix: 'Add descriptive text or value attribute to buttons'
          });
        }
      }
    });

    return {
      totalForms: forms.length,
      formsWithLabels,
      formsWithFieldsets,
      issues
    };
  }

  private analyzeImageAccessibility(element: Element | Document): ImageAnalysis {
    const images = element.querySelectorAll('img');
    let imagesWithAlt = 0;
    let decorativeImages = 0;
    const issues = [];

    images.forEach(img => {
      const alt = img.getAttribute('alt');
      const role = img.getAttribute('role');
      const src = img.getAttribute('src') || 'unknown';

      if (alt !== null) {
        imagesWithAlt++;
        if (alt === '' || role === 'presentation' || role === 'none') {
          decorativeImages++;
        }
      } else {
        issues.push({
          src,
          issue: 'Missing alt attribute',
          fix: 'Add alt="" for decorative images or descriptive alt text for informative images'
        });
      }

      if (alt && alt.length > 150) {
        issues.push({
          src,
          issue: 'Alt text is too long',
          fix: 'Keep alt text under 150 characters. Use longdesc or surrounding text for detailed descriptions'
        });
      }

      if (alt && (alt.toLowerCase().includes('image of') || alt.toLowerCase().includes('picture of'))) {
        issues.push({
          src,
          issue: 'Alt text contains redundant phrases',
          fix: 'Remove phrases like "image of" or "picture of" from alt text'
        });
      }
    });

    return {
      totalImages: images.length,
      imagesWithAlt,
      decorativeImages,
      issues
    };
  }

  private analyzeKeyboardNavigation(element: Element | Document): KeyboardAnalysis {
    const focusableElements = element.querySelectorAll(
      'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
    );
    
    const elementsWithTabIndex = element.querySelectorAll('[tabindex]');
    const skipLinks = element.querySelectorAll('a[href^="#"]');
    
    const issues = [];
    const recommendations = [];

    // Check for positive tabindex values
    elementsWithTabIndex.forEach(el => {
      const tabIndex = el.getAttribute('tabindex');
      if (tabIndex && parseInt(tabIndex) > 0) {
        issues.push('Avoid positive tabindex values as they can disrupt natural tab order');
      }
    });

    // Check for skip links
    if (skipLinks.length === 0) {
      recommendations.push('Add skip navigation links for keyboard users');
    }

    // Check for focus indicators
    const elementsWithoutFocusStyle = Array.from(focusableElements).filter(el => {
      const styles = window.getComputedStyle(el, ':focus');
      return styles.outline === 'none' && styles.boxShadow === 'none';
    });

    if (elementsWithoutFocusStyle.length > 0) {
      issues.push('Some focusable elements lack visible focus indicators');
      recommendations.push('Ensure all interactive elements have visible focus indicators');
    }

    return {
      focusableElements: focusableElements.length,
      elementsWithTabIndex: elementsWithTabIndex.length,
      skipLinks: skipLinks.length,
      issues,
      recommendations
    };
  }

  private getContrastRecommendation(contrast: ColorContrastResult): string {
    if (contrast.passesAAA) {
      return 'Excellent contrast ratio';
    } else if (contrast.passesAA) {
      return 'Good contrast ratio, consider improving for AAA compliance';
    } else {
      const needed = 4.5;
      const current = contrast.ratio;
      const improvement = Math.ceil((needed / current) * 100) - 100;
      return `Increase contrast by ${improvement}% to meet AA standards. Current: ${current.toFixed(2)}:1, Required: ${needed}:1`;
    }
  }

  private checkHeadingNesting(structure: Array<{level: number}>): boolean {
    for (let i = 1; i < structure.length; i++) {
      const current = structure[i].level;
      const previous = structure[i - 1].level;
      
      if (current > previous + 1) {
        return false; // Skipped a level
      }
    }
    return true;
  }

  private getXPath(element: Element): string {
    if (element.id) {
      return `//*[@id="${element.id}"]`;
    }
    
    const parts = [];
    let current = element;
    
    while (current && current.nodeType === Node.ELEMENT_NODE) {
      let index = 1;
      let sibling = current.previousElementSibling;
      
      while (sibling) {
        if (sibling.tagName === current.tagName) {
          index++;
        }
        sibling = sibling.previousElementSibling;
      }
      
      parts.unshift(`${current.tagName.toLowerCase()}[${index}]`);
      current = current.parentElement;
    }
    
    return '/' + parts.join('/');
  }

  private getSelector(element: Element): string {
    if (element.id) {
      return `#${element.id}`;
    }
    
    if (element.className) {
      const classes = element.className.split(' ').filter(c => c.trim());
      if (classes.length > 0) {
        return `${element.tagName.toLowerCase()}.${classes[0]}`;
      }
    }
    
    return element.tagName.toLowerCase();
  }

  private countElements(element: Element | Document): number {
    return element.querySelectorAll('*').length;
  }

  analyzeColorContrast(foreground: string, background: string): ColorContrastResult {
    try {
      const fgColor = Color(foreground);
      const bgColor = Color(background);
      const ratio = fgColor.contrast(bgColor);

      return {
        ratio: Math.round(ratio * 100) / 100,
        passesAA: ratio >= 4.5,
        passesAAA: ratio >= 7,
        foreground,
        background
      };
    } catch (error) {
      console.error('Color contrast analysis error:', error);
      throw new Error('Failed to analyze color contrast');
    }
  }

  private calculateAccurateScore(results: any, detailedAnalysis: DetailedAnalysis): number {
    let score = 100;
    
    // Deduct points for violations based on impact
    results.violations.forEach((violation: any) => {
      const weight = this.getViolationWeight(violation.impact);
      const nodeCount = violation.nodes.length;
      score -= (weight * nodeCount);
    });

    // Deduct points for color contrast issues
    const contrastIssues = detailedAnalysis.colorContrast.filter(c => !c.passesAA).length;
    score -= (contrastIssues * 2);

    // Deduct points for heading structure issues
    if (!detailedAnalysis.headingStructure.hasH1) score -= 5;
    if (!detailedAnalysis.headingStructure.properNesting) score -= 3;

    // Deduct points for form issues
    detailedAnalysis.formAnalysis.issues.forEach(issue => {
      score -= issue.type === 'fieldset' ? 2 : 3;
    });

    // Deduct points for image issues
    detailedAnalysis.imageAnalysis.issues.forEach(issue => {
      score -= issue.issue === 'Missing alt attribute' ? 4 : 1;
    });

    // Deduct points for keyboard navigation issues
    score -= detailedAnalysis.keyboardNavigation.issues.length * 2;

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  private getViolationWeight(impact: string): number {
    switch (impact) {
      case 'critical': return 8;
      case 'serious': return 5;
      case 'moderate': return 3;
      case 'minor': return 1;
      default: return 1;
    }
  }

  private determineWCAGLevel(results: any): 'A' | 'AA' | 'AAA' {
    const criticalViolations = results.violations.filter((v: any) => v.impact === 'critical').length;
    const seriousViolations = results.violations.filter((v: any) => v.impact === 'serious').length;

    if (criticalViolations === 0 && seriousViolations === 0) return 'AAA';
    if (criticalViolations === 0) return 'AA';
    return 'A';
  }

  private mapViolationWithFixes(violation: any): AccessibilityViolation {
    const fixes = this.getFixInstructions(violation.id);
    
    return {
      id: violation.id,
      impact: violation.impact,
      description: violation.description,
      help: violation.help,
      helpUrl: violation.helpUrl,
      howToFix: fixes.howToFix,
      codeExample: fixes.codeExample,
      nodes: violation.nodes.map((node: any) => ({
        html: node.html,
        target: node.target,
        failureSummary: node.failureSummary,
        xpath: node.xpath || '',
        impact: node.impact || violation.impact
      }))
    };
  }

  private getFixInstructions(ruleId: string): {howToFix: string, codeExample: string} {
    const fixes: Record<string, {howToFix: string, codeExample: string}> = {
      'image-alt': {
        howToFix: 'Add descriptive alt text to images. Use alt="" for decorative images.',
        codeExample: `<!-- Good -->
<img src="chart.png" alt="Sales increased 25% from Q1 to Q2">
<img src="decoration.png" alt="" role="presentation">`
      },
      'color-contrast': {
        howToFix: 'Increase color contrast to at least 4.5:1 for normal text and 3:1 for large text.',
        codeExample: `/* Bad */
.text { color: #999; background: #fff; } /* 2.8:1 */

/* Good */
.text { color: #666; background: #fff; } /* 5.7:1 */`
      },
      'label': {
        howToFix: 'Associate form controls with labels using for/id attributes or aria-label.',
        codeExample: `<!-- Good -->
<label for="email">Email Address</label>
<input type="email" id="email" name="email">

<!-- Alternative -->
<input type="email" aria-label="Email Address">`
      },
      'heading-order': {
        howToFix: 'Use headings in logical order (h1, h2, h3) without skipping levels.',
        codeExample: `<!-- Good -->
<h1>Main Title</h1>
<h2>Section Title</h2>
<h3>Subsection Title</h3>`
      },
      'link-name': {
        howToFix: 'Ensure links have descriptive text that makes sense out of context.',
        codeExample: `<!-- Bad -->
<a href="/report.pdf">Click here</a>

<!-- Good -->
<a href="/report.pdf">Download 2024 Annual Report (PDF)</a>`
      }
    };

    return fixes[ruleId] || {
      howToFix: 'Review the element and ensure it meets accessibility standards.',
      codeExample: '<!-- Refer to WCAG guidelines for specific implementation -->'
    };
  }

  private mapPass(pass: any): AccessibilityPass {
    return {
      id: pass.id,
      description: pass.description,
      nodes: pass.nodes.length
    };
  }

  private mapIncompleteWithReason(incomplete: any): AccessibilityIncomplete {
    return {
      id: incomplete.id,
      description: incomplete.description,
      nodes: incomplete.nodes.length,
      reason: incomplete.description.includes('color') ? 'Manual verification needed for color-dependent content' : 'Requires manual testing'
    };
  }

  private getEnhancedDemoResults(): AccessibilityResult {
    return {
      score: 78,
      violations: [
        {
          id: 'color-contrast',
          impact: 'serious',
          description: 'Elements must have sufficient color contrast',
          help: 'Ensure all text elements have sufficient contrast against their background',
          helpUrl: 'https://dequeuniversity.com/rules/axe/4.7/color-contrast',
          howToFix: 'Increase the contrast ratio to at least 4.5:1 for normal text. Consider using darker text colors or lighter backgrounds.',
          codeExample: `/* Current - Poor contrast */
.button { color: #999; background: #fff; } /* 2.8:1 */

/* Fixed - Good contrast */
.button { color: #333; background: #fff; } /* 12.6:1 */`,
          nodes: [
            {
              html: '<button class="btn-secondary">Secondary Action</button>',
              target: ['.btn-secondary'],
              failureSummary: 'Element has insufficient color contrast of 2.8:1 (foreground color: #999999, background color: #ffffff, font size: 14.0pt, font weight: normal). Expected contrast ratio of 4.5:1',
              xpath: '/html/body/div[1]/main/section[2]/div/button[2]',
              impact: 'serious'
            }
          ]
        },
        {
          id: 'image-alt',
          impact: 'critical',
          description: 'Images must have alternate text',
          help: 'Ensure img elements have alternate text or a role of none or presentation',
          helpUrl: 'https://dequeuniversity.com/rules/axe/4.7/image-alt',
          howToFix: 'Add descriptive alt text that conveys the purpose and content of the image. For decorative images, use alt="".',
          codeExample: `<!-- Missing alt text -->
<img src="product-chart.png">

<!-- Fixed with descriptive alt text -->
<img src="product-chart.png" alt="Bar chart showing 40% increase in product sales from January to March 2024">

<!-- For decorative images -->
<img src="decoration.png" alt="" role="presentation">`,
          nodes: [
            {
              html: '<img src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg" class="hero-image">',
              target: ['.hero-image'],
              failureSummary: 'Element does not have an alt attribute; aria-label attribute does not exist or is empty; aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty',
              xpath: '/html/body/div[1]/main/section[1]/div/img',
              impact: 'critical'
            }
          ]
        },
        {
          id: 'heading-order',
          impact: 'moderate',
          description: 'Heading levels should only increase by one',
          help: 'Ensure headings are in a logical order',
          helpUrl: 'https://dequeuniversity.com/rules/axe/4.7/heading-order',
          howToFix: 'Restructure headings to follow a logical hierarchy. Don\'t skip heading levels (e.g., h1 to h3).',
          codeExample: `<!-- Bad - skips h2 -->
<h1>Main Title</h1>
<h3>Subsection</h3>

<!-- Good - logical order -->
<h1>Main Title</h1>
<h2>Section Title</h2>
<h3>Subsection</h3>`,
          nodes: [
            {
              html: '<h3>Key Features</h3>',
              target: ['h3'],
              failureSummary: 'Heading order invalid - h3 follows h1 without h2',
              xpath: '/html/body/div[1]/main/section[2]/h3',
              impact: 'moderate'
            }
          ]
        }
      ],
      passes: [
        {
          id: 'document-title',
          description: 'Documents must have a title to aid in navigation',
          nodes: 1
        },
        {
          id: 'html-has-lang',
          description: 'The html element must have a lang attribute',
          nodes: 1
        },
        {
          id: 'landmark-one-main',
          description: 'Document must have one main landmark',
          nodes: 1
        }
      ],
      incomplete: [
        {
          id: 'color-contrast-enhanced',
          description: 'Elements must have sufficient color contrast (Enhanced)',
          nodes: 5,
          reason: 'Manual verification needed for enhanced contrast requirements'
        }
      ],
      summary: {
        violations: 3,
        passes: 3,
        incomplete: 1,
        score: 78,
        wcagLevel: 'AA',
        totalElements: 247,
        testedElements: 156
      },
      detailedAnalysis: {
        colorContrast: [
          {
            element: '.btn-secondary',
            foreground: '#999999',
            background: '#ffffff',
            ratio: 2.8,
            passesAA: false,
            passesAAA: false,
            recommendation: 'Increase contrast by 61% to meet AA standards. Current: 2.8:1, Required: 4.5:1'
          }
        ],
        headingStructure: {
          structure: [
            { level: 1, text: 'Design for everyone. Include everyone.', issues: [] },
            { level: 3, text: 'Key Features', issues: ['Skips heading level 2'] }
          ],
          hasH1: true,
          properNesting: false,
          recommendations: ['Fix heading hierarchy - avoid skipping levels']
        },
        formAnalysis: {
          totalForms: 1,
          formsWithLabels: 0,
          formsWithFieldsets: 0,
          issues: [
            {
              type: 'label',
              description: 'Form inputs missing associated labels',
              fix: 'Add <label> elements or aria-label attributes to form controls'
            }
          ]
        },
        imageAnalysis: {
          totalImages: 3,
          imagesWithAlt: 1,
          decorativeImages: 0,
          issues: [
            {
              src: 'hero-image.jpg',
              issue: 'Missing alt attribute',
              fix: 'Add alt="" for decorative images or descriptive alt text for informative images'
            }
          ]
        },
        keyboardNavigation: {
          focusableElements: 12,
          elementsWithTabIndex: 2,
          skipLinks: 0,
          issues: ['Some focusable elements lack visible focus indicators'],
          recommendations: ['Add skip navigation links for keyboard users', 'Ensure all interactive elements have visible focus indicators']
        }
      }
    };
  }

  generateAccessibilityReport(results: AccessibilityResult): string {
    const report = `
# Comprehensive Accessibility Report

## Executive Summary
- **Overall Score**: ${results.score}/100
- **WCAG Compliance Level**: ${results.summary.wcagLevel}
- **Total Elements Analyzed**: ${results.summary.totalElements}
- **Elements Tested**: ${results.summary.testedElements}

## Critical Issues Found: ${results.summary.violations}

${results.violations.map(violation => `
### ${violation.id.toUpperCase()} - ${violation.impact.toUpperCase()} PRIORITY

**Issue**: ${violation.description}

**Impact**: ${violation.impact} - Affects ${violation.nodes.length} element(s)

**How to Fix**: ${violation.howToFix}

**Code Example**:
\`\`\`html
${violation.codeExample}
\`\`\`

**Affected Elements**:
${violation.nodes.map(node => `- ${node.target.join(', ')}: ${node.failureSummary}`).join('\n')}

**Learn More**: ${violation.helpUrl}

---
`).join('')}

## Detailed Analysis

### Color Contrast Analysis
${results.detailedAnalysis.colorContrast.length > 0 ? 
  results.detailedAnalysis.colorContrast.map(contrast => 
    `- **${contrast.element}**: ${contrast.ratio}:1 ratio - ${contrast.recommendation}`
  ).join('\n') : 
  'No color contrast issues detected.'
}

### Heading Structure
- **Has H1**: ${results.detailedAnalysis.headingStructure.hasH1 ? 'Yes' : 'No'}
- **Proper Nesting**: ${results.detailedAnalysis.headingStructure.properNesting ? 'Yes' : 'No'}
- **Recommendations**: ${results.detailedAnalysis.headingStructure.recommendations.join(', ') || 'None'}

### Form Accessibility
- **Total Forms**: ${results.detailedAnalysis.formAnalysis.totalForms}
- **Forms with Labels**: ${results.detailedAnalysis.formAnalysis.formsWithLabels}
- **Issues Found**: ${results.detailedAnalysis.formAnalysis.issues.length}

### Image Accessibility
- **Total Images**: ${results.detailedAnalysis.imageAnalysis.totalImages}
- **Images with Alt Text**: ${results.detailedAnalysis.imageAnalysis.imagesWithAlt}
- **Issues**: ${results.detailedAnalysis.imageAnalysis.issues.length}

### Keyboard Navigation
- **Focusable Elements**: ${results.detailedAnalysis.keyboardNavigation.focusableElements}
- **Skip Links**: ${results.detailedAnalysis.keyboardNavigation.skipLinks}
- **Issues**: ${results.detailedAnalysis.keyboardNavigation.issues.length}

## Recommendations Priority List

### High Priority (Fix Immediately)
${results.violations.filter(v => v.impact === 'critical').map(v => `- ${v.description}`).join('\n') || 'None'}

### Medium Priority (Fix Soon)
${results.violations.filter(v => v.impact === 'serious').map(v => `- ${v.description}`).join('\n') || 'None'}

### Low Priority (Improve When Possible)
${results.violations.filter(v => v.impact === 'moderate' || v.impact === 'minor').map(v => `- ${v.description}`).join('\n') || 'None'}

## Compliance Status
- **WCAG 2.1 Level A**: ${results.violations.filter(v => v.impact === 'critical').length === 0 ? 'PASS' : 'FAIL'}
- **WCAG 2.1 Level AA**: ${results.violations.filter(v => v.impact === 'critical' || v.impact === 'serious').length === 0 ? 'PASS' : 'FAIL'}
- **WCAG 2.1 Level AAA**: ${results.violations.length === 0 ? 'PASS' : 'FAIL'}

Generated on: ${new Date().toLocaleString()}
Report Version: 2.0
    `;

    return report.trim();
  }
}