// src/api.ts
// ฟังก์ชันสำหรับสร้าง Podcast: รับ topic, ขอ script จาก Gemini, ส่ง script ไป Botnoi เพื่อสร้างเสียง

export async function generatePodcastWithAudio({
  topic,
  speaker = '1',
  volume = 1,
  speed = 1,
  type_media = 'm4a',
  save_file = true,
  language = 'th',
}: {
  topic: string;
  speaker?: string;
  volume?: number;
  speed?: number;
  type_media?: string;
  save_file?: boolean;
  language?: string;
}) {
  // 1. ขอ script จาก Gemini
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY;
  if (!geminiApiKey) throw new Error('Missing GEMINI_API_KEY');
  const prompt = `ช่วยเขียนสคริปต์ podcast ภาษาไทย หัวข้อ "${topic}" กรุณาสร้างสคริปต์พอดแคสต์สำหรับผู้พูดคนเดียว โดยเริ่มต้นด้วยประโยค "วันนี้เราจะมาพูดถึงเรื่อง..." จากนั้นให้เขียนเนื้อหาในลักษณะคำพูดต่อเนื่อง อธิบายเนื้อหาให้ชัดเจน ครอบคลุมหัวข้อที่กำหนด โดยไม่ต้องมีเสียงประกอบ คำแนะนำ หรือรูปแบบพิเศษ เช่น ##, *, หรือ [] เน้นให้เป็นประโยคที่สามารถนำไปสร้างเสียงพูดต่อเนื่องด้วย voice bot ได้ทันที`;
  const geminiRes = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + geminiApiKey,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    }
  );
  if (!geminiRes.ok) {
    const msg = await geminiRes.text();
    throw new Error('Gemini API error: ' + geminiRes.status + ' ' + msg);
  }
  const geminiData = await geminiRes.json();
  const script = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || 'ไม่สามารถสร้างสคริปต์ได้';

  // 2. ส่ง script ไป Botnoi เพื่อสร้างเสียงผ่าน proxy backend (เช่น /api/voice)
  const botnoiRes = await fetch('/api/voice', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: script,
      speaker,
      volume,
      speed,
      type_media,
      save_file,
      language,
    }),
  });
  if (!botnoiRes.ok) {
    const msg = await botnoiRes.text();
    throw new Error('Botnoi API error: ' + botnoiRes.status + ' ' + msg);
  }
  const botnoiData = await botnoiRes.json();
  const audioUrl = botnoiData.result?.url || botnoiData.result?.file || botnoiData.audio_url || '';

  return { script, audioUrl };
}

export async function fetchBotnoiRoles() {
  // สมมติว่า API มี endpoint สำหรับ roles (ถ้าไม่มีให้ return static)
  // ตัวอย่าง: return [{ id: 'host', name: 'Host', description: 'Main presenter' }, ...]
  return [
    { id: 'host', name: 'Host', description: 'Main presenter' },
    { id: 'guest', name: 'Guest Expert', description: 'Subject matter expert' },
    { id: 'interviewer', name: 'Interviewer', description: 'Question asker' },
    { id: 'narrator', name: 'Narrator', description: 'Story teller' },
    { id: 'analyst', name: 'Analyst', description: 'Data interpreter' },
  ];
}
