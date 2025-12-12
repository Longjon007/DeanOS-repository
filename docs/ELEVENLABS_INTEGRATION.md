# ElevenLabs API Integration Guide

## Overview

Hyperion AI now features text-to-speech capabilities powered by ElevenLabs API. Users can issue commands through the interface and receive spoken responses with high-quality, natural-sounding voice synthesis.

## Features

- **Voice Responses**: Commands typed into the Hyperion AI interface are processed and spoken back using ElevenLabs text-to-speech
- **Real-time Processing**: Visual feedback shows when the AI is generating and playing voice responses
- **Error Handling**: Clear error messages and visual indicators for API or playback issues
- **Smart Response System**: Contextual responses based on command keywords

## Setup Instructions

### ⚠️ Security Warning

**IMPORTANT**: The current implementation stores the API key in client-side JavaScript, which means it will be visible to anyone who views the page source. This is suitable for:
- Local development and testing
- Personal use on localhost
- Demonstrations and prototypes

**For production environments**, you should:
1. Move API calls to a backend server
2. Use environment variables on the server
3. Implement proper API key rotation
4. Add rate limiting and usage monitoring

See the [Security Best Practices](#security-best-practices) section for more details.

### 1. Get Your ElevenLabs API Key

1. Visit [ElevenLabs](https://elevenlabs.io/)
2. Sign up for an account or log in
3. Navigate to your profile settings
4. Copy your API key from the API section

### 2. Configure the API Key

#### For the Web Interface (docs/hyperion-prompt.html):

Open `docs/hyperion-prompt.html` and locate the configuration section in the script:

```javascript
const ELEVENLABS_API_KEY = 'YOUR_API_KEY_HERE'; // Replace with your actual API key
```

Replace `'YOUR_API_KEY_HERE'` with your actual ElevenLabs API key.

#### For Environment Variables:

Add your API key to the `.env` file:

**For Web Application (Next.js):**
```bash
NEXT_PUBLIC_ELEVENLABS_API_KEY=your_actual_api_key_here
```

**For Mobile Application (React Native):**
```bash
EXPO_PUBLIC_ELEVENLABS_API_KEY=your_actual_api_key_here
```

### 3. Customize Voice Settings (Optional)

You can customize the voice by changing the `ELEVENLABS_VOICE_ID`:

```javascript
const ELEVENLABS_VOICE_ID = 'EXAVITQu4vr4xnSDxMaL'; // Default: Rachel
```

Available voice IDs can be found in your ElevenLabs dashboard.

You can also adjust voice settings in the API request:

```javascript
voice_settings: {
    stability: 0.5,        // Range: 0.0 to 1.0 (higher = more consistent)
    similarity_boost: 0.5  // Range: 0.0 to 1.0 (higher = closer to original voice)
}
```

## Usage

1. Open the Hyperion AI interface in your browser
2. Type a command in the input field
3. Press **Enter** to submit
4. The AI will generate a contextual response and speak it aloud
5. A status indicator shows the processing and playback status

### Example Commands

- **"hello"** - Greeting from Hyperion AI
- **"help"** - Information about Hyperion AI capabilities
- **"status"** - System status check
- **"build an app"** - Initiates application build sequence
- **Any custom command** - Receives a generic acknowledgment response

## Status Indicators

- 🎯 **Ready** - System is ready to receive commands
- ⚙️ **Processing** - Generating voice response from ElevenLabs
- 🔊 **Playing** - Voice response is being played
- ✓ **Success** - Command processed successfully
- ⚠️ **Warning** - API key not configured
- ✗ **Error** - API error or playback failure

## Troubleshooting

### API Key Not Configured
**Error**: "⚠️ ElevenLabs API key not configured"

**Solution**: Make sure you've replaced `YOUR_API_KEY_HERE` with your actual API key.

### API Request Failed
**Error**: "✗ Error: API request failed: 401 Unauthorized"

**Solution**: Verify your API key is valid and has not expired.

### No Audio Playback
**Error**: "✗ Audio playback error"

**Solution**: 
- Check your browser's audio permissions
- Ensure your device's volume is not muted
- Try a different browser if the issue persists

### CORS Errors
If you encounter CORS errors, make sure you're accessing the HTML file through a web server (not file://). You can use:

```bash
# Python
python -m http.server 8000

# Node.js
npx http-server
```

Then access: `http://localhost:8000/docs/hyperion-prompt.html`

## API Rate Limits

ElevenLabs has rate limits based on your subscription tier:
- **Free Tier**: 10,000 characters/month
- **Starter**: 30,000 characters/month
- **Creator**: 100,000 characters/month
- **Pro**: 500,000 characters/month

Monitor your usage in the ElevenLabs dashboard to avoid exceeding limits.

## Security Best Practices

1. **Never commit API keys to version control**
   - Use environment variables
   - Keep `.env` files in `.gitignore`

2. **Use environment-specific keys**
   - Development key for local testing
   - Production key for deployed applications

3. **Implement rate limiting**
   - Add client-side throttling to prevent excessive API calls
   - Cache responses when possible

4. **Secure your endpoints**
   - For production, move API calls to backend
   - Never expose API keys in client-side code

## Future Enhancements

Potential improvements for the integration:

- [ ] Backend proxy for API calls (hide API key from client)
- [ ] Voice selection UI
- [ ] Audio caching for common responses
- [ ] Real-time streaming for longer responses
- [ ] Multiple language support
- [ ] Voice customization controls
- [ ] Integration with actual AI language model for smarter responses

## Resources

- [ElevenLabs API Documentation](https://docs.elevenlabs.io/)
- [ElevenLabs Voice Library](https://elevenlabs.io/voice-library)
- [ElevenLabs Pricing](https://elevenlabs.io/pricing)

## Support

For issues related to:
- **ElevenLabs API**: Contact ElevenLabs support
- **Hyperion AI Integration**: Open an issue in this repository

---

**Note**: This integration currently uses a client-side implementation. For production use, consider implementing a backend proxy to secure your API key.
