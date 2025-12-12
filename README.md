# Hyperion AI
Autonomous experimentally trained AI with the thunderous cadence of a mythic Greek warrior-god

## Voice preview (ElevenLabs example)

Use the ElevenLabs JS SDK with voice ID `JBFqnCBsd6RMkjVDRZzb` to preview the Hyperion warrior voice:

```bash
npm install @elevenlabs/elevenlabs-js
```

```ts
import { ElevenLabsClient, play } from '@elevenlabs/elevenlabs-js';

const elevenlabs = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });

const audio = await elevenlabs.textToSpeech.convert(
  'JBFqnCBsd6RMkjVDRZzb',
  {
    text: 'The first move is what sets everything in motion.',
    modelId: 'eleven_multilingual_v2',
    outputFormat: 'mp3_44100_128',
  }
);

await play(audio);
```
