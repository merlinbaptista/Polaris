# Polaris - AI-Powered Accessibility & Inclusivity Auditor

**Making design accessible to everyone, one project at a time.**

## Table of Contents

- [Overview](#overview)
- [Inspiration](#inspiration)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Usage](#usage)
- [API Configuration](#api-configuration)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Overview

Polaris is an AI-powered accessibility and inclusivity auditor designed as an Adobe Express add-on. It transforms the design workflow by providing real-time accessibility scanning, AI-generated alt-text, disability simulation modes, and comprehensive compliance reporting. Our mission is to make digital design inclusive for the 1.3 billion people worldwide living with disabilities.

## Inspiration

The inspiration for Polaris stems from a deeply personal experience with my brother, who lives with partial blindness. While he can perceive bright colors clearly, dull and muted tones remain invisible to him, creating daily challenges in accessing visual information. When I wanted to create a simple greeting card that he could fully read and appreciate, I realized how many design elements we take for granted exclude millions of people like him. This moment sparked the vision for Polaris - ensuring every design decision considers the diverse ways people experience visual content.

## Features

### Core Functionality

- **Real-time Accessibility Scanning**: Instant detection of color contrast issues, typography problems, and layout barriers
- **AI Alt-Text Generation**: Automatic creation of meaningful image descriptions using ChatGPT API
- **Disability Simulation Modes**: Experience your designs through different visual impairments including color blindness and low vision
- **Voice-to-Design Interface**: Create and modify designs using voice commands for users with motor impairments
- **WCAG 2.1 Compliance Dashboard**: Comprehensive reporting for ADA and accessibility law requirements
- **Community Impact Tracker**: Visualize how many people with disabilities can access your improved designs

### Advanced Features

- **Color Contrast Analysis**: Real-time checking against WCAG AA and AAA standards
- **Haptic Feedback Integration**: Support for users with visual impairments
- **One-Click Adaptive Templates**: AI-powered layout restructuring for optimal accessibility
- **Multi-language Support**: Accessibility guidance in multiple languages
- **Export Compliance Reports**: Download detailed accessibility audits for legal documentation

## Technology Stack

### Frontend
- **HTML5/CSS3**: Modern web standards with responsive design
- **JavaScript (ES6+)**: Core application logic and DOM manipulation
- **Bolt AI**: AI-powered interface adaptation

### APIs and Services
- **ChatGPT API**: AI-powered alt-text generation and content analysis
- **Google Cloud Vision API**: Image analysis and object detection
- **Web Speech API**: Voice recognition and text-to-speech functionality
- **axe-core API**: Accessibility rule engine and compliance checking

### Libraries and Tools
- **Color.js**: Advanced color manipulation and contrast analysis
- **Custom JavaScript**: Disability simulation filters and visual effects
- **WCAG Guidelines**: Accessibility standards implementation

## Installation

### Prerequisites
- Node.js (version 14 or higher)
- Modern web browser with Web Speech API support
- API keys for external services

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/polaris-accessibility-auditor.git
   cd polaris-accessibility-auditor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env file with your API keys
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   Navigate to http://localhost:3000
   ```

## Usage

### Basic Workflow

1. **Upload Design**: Drag and drop your design file or image into the scanning area
2. **Automatic Analysis**: Polaris immediately scans for accessibility issues
3. **Review Results**: View detailed feedback on contrast, readability, and compliance
4. **Apply Fixes**: Use AI suggestions and one-click improvements
5. **Test Simulations**: Experience your design through different disability perspectives
6. **Generate Reports**: Export compliance documentation for legal requirements

### Voice Commands

- "Analyze accessibility" - Start scanning current design
- "Generate alt text" - Create image descriptions
- "Check color contrast" - Analyze color combinations
- "Show simulation mode" - Enable disability filters
- "Export report" - Generate compliance documentation

### Keyboard Navigation

- `Tab`: Navigate through interface elements
- `Space`: Activate buttons and controls
- `Enter`: Confirm selections
- `Escape`: Close dialogs and modals
- `Arrow Keys`: Navigate within components

## API Configuration

### Required API Keys

Create a `.env` file in the root directory with the following variables:

```env
# OpenAI ChatGPT API
OPENAI_API_KEY=your_chatgpt_api_key_here

# Google Cloud Vision API
GOOGLE_VISION_API_KEY=your_google_vision_api_key_here

# Optional: Additional service configurations
NODE_ENV=development
PORT=3000
```

### API Setup Instructions

#### ChatGPT API
1. Visit [OpenAI API Platform](https://platform.openai.com)
2. Create an account and navigate to API keys
3. Generate a new secret key
4. Add to your `.env` file

#### Google Cloud Vision API
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable the Cloud Vision API
4. Create credentials and generate an API key
5. Add to your `.env` file

#### Web Speech API
No configuration required - built into modern browsers.

#### axe-core API
No configuration required - included via CDN.

## Contributing

We welcome contributions from developers, designers, and accessibility advocates. Here's how you can help:

### Development Guidelines

1. **Fork the repository** and create a feature branch
2. **Follow accessibility best practices** in all code contributions
3. **Test thoroughly** including screen reader compatibility
4. **Document your changes** with clear commit messages
5. **Submit a pull request** with detailed description

### Code Standards

- Use semantic HTML elements
- Implement proper ARIA labels
- Maintain keyboard navigation support
- Ensure color contrast compliance
- Test with assistive technologies

### Bug Reports

When reporting bugs, please include:
- Browser and version information
- Steps to reproduce the issue
- Expected vs actual behavior
- Screenshots or screen recordings
- Accessibility tool being used (if applicable)

## Project Structure

```
polaris-accessibility-auditor/
├── src/
│   ├── components/
│   │   ├── scanner/
│   │   ├── simulation/
│   │   └── dashboard/
│   ├── apis/
│   │   ├── chatgpt.js
│   │   ├── vision.js
│   │   └── speech.js
│   ├── utils/
│   │   ├── contrast.js
│   │   ├── accessibility.js
│   │   └── simulation.js
│   └── styles/
├── public/
├── docs/
├── tests/
└── README.md
```

## Testing

### Accessibility Testing
- Screen reader compatibility (NVDA, JAWS, VoiceOver)
- Keyboard navigation testing
- Color contrast verification
- Focus management validation

### Browser Testing
- Chrome/Chromium browsers
- Firefox
- Safari
- Edge
- Mobile browsers

### API Testing
Run the test suite to verify all APIs are functioning:
```bash
npm run test
```

## Deployment

### Adobe Express Add-on Deployment
1. Follow Adobe Express Add-on SDK guidelines
2. Package the application according to Adobe requirements
3. Submit for review through Adobe Developer Console

### Web Application Deployment
1. Build the production version: `npm run build`
2. Deploy to your preferred hosting service
3. Configure environment variables in production
4. Set up SSL certificate for HTTPS

## Performance Considerations

- **Image Processing**: Optimized for real-time analysis without blocking UI
- **API Rate Limits**: Implemented caching and request queuing
- **Memory Management**: Efficient handling of large design files
- **Loading States**: Smooth user experience during API calls

## Security

- **API Key Protection**: Environment variables and secure storage
- **Input Validation**: Sanitization of user uploads and inputs
- **HTTPS Only**: Secure communication for all API calls
- **Privacy First**: No user data stored or transmitted unnecessarily

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Mobile browsers with Web Speech API support

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- **Web Content Accessibility Guidelines (WCAG)** for accessibility standards
- **axe-core team** for the accessibility testing engine
- **OpenAI** for ChatGPT API capabilities
- **Google Cloud** for Vision API services
- **Adobe Express team** for the extensible platform
- **Disability rights advocates** who continue to push for digital inclusion
- **My brother** whose experience inspired this project and countless others living with disabilities who deserve equal access to digital content

## Contact

- **Developer**: Merlin Baptista
- **Email**: merlinbaptista.b@gmail.com
- **Project Link**: https://github.com/yourusername/polaris-accessibility-auditor
- **Demo**: https://fastidious-haupia-b919e8.netlify.app/

---

**"Design for everyone. Include everyone."**

*Polaris - Guiding design toward universal accessibility.*
