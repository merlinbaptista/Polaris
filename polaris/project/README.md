# Polaris - AI-Powered Accessibility Auditor

A comprehensive accessibility auditing tool that combines cutting-edge AI with WCAG compliance to ensure digital experiences are inclusive for everyone.

## Features

- 🔍 **Upload & Scan**: Comprehensive accessibility analysis with detailed reports
- 🤖 **AI Alt-Text Generator**: OpenAI Vision-powered image analysis and alt-text generation
- 🎮 **Simulation Mode**: Experience your content through different accessibility needs
- 🗣️ **Voice Interface**: Control Polaris with natural voice commands
- 📊 **Accessibility Dashboard**: Real-time metrics and compliance tracking
- 🛡️ **Compliance Center**: WCAG 2.1, Section 508, and ADA compliance monitoring

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the root directory and add your API keys:

```env
# OpenAI API Configuration
VITE_OPENAI_API_KEY=your_actual_openai_api_key_here

# Google Vision API Configuration  
VITE_GOOGLE_VISION_API_KEY=your_actual_google_vision_api_key_here

# Application Configuration
VITE_APP_NAME=Polaris
VITE_APP_VERSION=1.0.0
```

### 2. Getting API Keys

#### OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and add it to your `.env` file

#### Google Vision API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Vision API
4. Create credentials (API Key)
5. Copy the key and add it to your `.env` file

### 3. Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## API Integration

### OpenAI Vision API
- Used for intelligent image analysis and alt-text generation
- Provides detailed scene understanding, object detection, and accessibility insights
- Supports multiple alt-text styles (descriptive, concise, emotional)

### Google Vision API
- Backup service for image analysis
- Provides label detection, text recognition, and object localization
- Used for enhanced image understanding capabilities

## Security Notes

- Never commit API keys to version control
- Use environment variables for all sensitive configuration
- Rotate API keys regularly
- Monitor API usage and set appropriate limits

## Development

The application is built with:
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Vite** for build tooling
- **Axe-core** for accessibility testing
- **OpenAI GPT-4 Vision** for AI analysis
- **Web Speech API** for voice interface

## Deployment

The application can be deployed to any static hosting service:

1. Build the application: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Ensure environment variables are configured in your hosting platform

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For support and questions, please open an issue on GitHub or contact the development team.