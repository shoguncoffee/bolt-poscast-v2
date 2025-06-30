import { Router } from 'express';
import { ROLES } from '../../constants/roles.js';

export default Router()
  .post('/script', async (req, res) => {
    const { topic, role } = req.body;

    const roleObj = ROLES.find(r => r.id == role);
    const rolePrompt = roleObj ? `\n\n**หมายเหตุ:** ให้ผู้พูดมีลักษณะเป็น${roleObj.style}` : '';

    let prompt = `ช่วยเขียนสคริปต์ podcast ภาษาไทย ความยาวไม่เกิน 1600 ตัวอักษร หัวข้อ "${topic}" กรุณาสร้างสคริปต์พอดแคสต์สำหรับผู้พูดคนเดียว จากนั้นให้เขียนเนื้อหาในลักษณะคำพูดต่อเนื่อง อธิบายเนื้อหาให้ชัดเจนและเน้นเนื้อหาให้มีรายละเอียดที่มีการเล่าเรื่องจากหัวข้อและประเด็นสำคัญ ครอบคลุมหัวข้อที่กำหนด แต่มีความยาวไม่เกิน 1600 ตัวอักษร โดยห้ามใส่เสียงประกอบ คำอธิบายฉาก หรือข้อความในวงเล็บ เช่น (เสียง...) หรือ [เสียง...] หรือคำอธิบายฉากใดๆ ห้ามใช้ ##, *, ,/n หรือ [] เน้นให้เป็นประโยคที่สามารถนำไปสร้างเสียงพูดต่อเนื่องด้วย voice bot ได้ทันที${rolePrompt}`;

    const geminiRes = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + process.env.GEMINI_API_KEY,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        }),
      }
    );

    if (!geminiRes.ok) {
      const msg = await geminiRes.text();
      console.error('Gemini API error:', geminiRes.status, msg);

      res.status(geminiRes.status).end();
      return;
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

    res.send(script);
  });