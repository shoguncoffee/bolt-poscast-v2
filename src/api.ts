import { SpeakerResponse  } from './types.js'
import Supabase from './supabase/client.js';

export async function generatePodcastWithAudio(
  topic: string,
  role: string,
  speaker: string,
  speed: number,
  language: string,
) {
  const script_res = await fetch(
    '/api/script', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, role }),
    }
  );

  if (!script_res.ok) {
    const msg = await script_res.text();
    throw new Error('Gemini API error: ' + script_res.status + ' ' + msg);
  }

  const script = await script_res.text();

  const voice_res = await fetch(
    '/api/voice', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: script,
        speaker,
        speed,
        language,
      }),
    }
  );

  const voiceData = await voice_res.text();

  if (!voice_res.ok) {
    throw new Error('Botnoi API error: ' + voice_res.status + ' ' + voiceData);
  }

  return { script, audioUrl: voiceData };
}

export async function get_speaker_voices() {
  const res = await fetch('https://api-voice.botnoi.ai/api/marketplace/get_all_marketplace_demo');
  const content: SpeakerResponse = await res.json()
  const speakers = content.data;

  return speakers.map(item => ({
    id: item.speaker_id,
    name: item.thai_name,
    accent: item.voice_style[0] || 'N/A',
  }));
}