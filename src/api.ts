// src/api.ts
// ฟังก์ชันสำหรับสร้าง Podcast: รับ topic, ขอ script จาก Gemini, ส่ง script ไป Botnoi เพื่อสร้างเสียง

import { ROLES } from './constants/roles.js';

export async function generatePodcastWithAudio({
  topic,
  speaker = '1',
  volume = 1,
  speed = 1,
  type_media = 'm4a',
  save_file = true,
  language = 'th',
  role,
}: {
  topic: string;
  speaker?: string;
  volume?: number;
  speed?: number;
  type_media?: string;
  save_file?: boolean;
  language?: string;
  role?: string;
}) {
  // 1. ขอ script จาก Gemini
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY;
  if (!geminiApiKey) throw new Error('Missing GEMINI_API_KEY');

  // ดึงรายละเอียด role ที่เลือก (ถ้ามี)
  let rolePrompt = '';
  if (role) {
    const roleObj = ROLES.find(r => r.id === role || r.name === role);
    if (roleObj) {
      rolePrompt = `\n\n**หมายเหตุ:** ให้ผู้พูดมีลักษณะเป็น${roleObj.style}`;
    }
  }

  // ปรับ prompt: ห้ามใส่เสียงประกอบ/คำอธิบายฉาก/ข้อความในวงเล็บ
  let prompt = `ช่วยเขียนสคริปต์ podcast ภาษาไทย หัวข้อ "${topic}" กรุณาสร้างสคริปต์พอดแคสต์สำหรับผู้พูดคนเดียว จากนั้นให้เขียนเนื้อหาในลักษณะคำพูดต่อเนื่อง อธิบายเนื้อหาให้ชัดเจนและเน้นเนื้อหาให้มีรายละเอียดที่มีการเล่าเรื่องจากหัวข้อและประเด็นสำคัญ ครอบคลุมหัวข้อที่กำหนด โดยห้ามใส่เสียงประกอบ คำอธิบายฉาก หรือข้อความในวงเล็บ เช่น (เสียง...) หรือ [เสียง...] หรือคำอธิบายฉากใดๆ ห้ามใช้ ##, *, ,/n หรือ [] เน้นให้เป็นประโยคที่สามารถนำไปสร้างเสียงพูดต่อเนื่องด้วย voice bot ได้ทันที${rolePrompt}`;
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
  let script = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || 'ไม่สามารถสร้างสคริปต์ได้';

  // Post-process: ตัดบรรทัดที่เป็นเสียงประกอบ/คำอธิบายฉาก (เช่น (เสียง...), [เสียง...])
  script = script
    .split('\n')
    .filter((line: string) => !/^\s*[\[(（][^\])）]{0,30}[\])）]\s*$/u.test(line.trim())) // ตัดบรรทัดที่เป็น () หรือ [] อย่างเดียว
    .filter((line: string) => !/^\s*[\[(（].*[\])）]\s*$/u.test(line.trim())) // ตัดบรรทัดที่เป็น () หรือ [] ทั้งบรรทัด
    .filter((line: string) => !/(เสียง|ซาวด์|sound|SFX|หัวเราะ)/i.test(line)) // ตัดบรรทัดที่มีคำว่าเสียง/ซาวด์
    .join('\n');

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
      role, // เพิ่ม role ใน body
      // ไม่ส่ง title ไป backend (Botnoi API ไม่รองรับ)
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
  // ใช้ roles จาก constants
  return ROLES;
}

// ฟังก์ชันสำหรับดึงภาษา (language) ที่รองรับ (เหลือแค่ภาษาไทย)
export async function fetchSupportedLanguages() {
  // คืนค่าแค่ภาษาไทยอย่างเดียว
  return ['th'];
}
