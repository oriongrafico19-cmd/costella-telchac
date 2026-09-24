import { COSTELLA_KNOWLEDGE } from './knowledge.js';

const MODEL = 'gemini-3.8-flash';

const SYSTEM_INSTRUCTION = `
Eres el asistente de primera conversación de Costella Telchac Residencial.

Tu trabajo es orientar al prospecto de forma humana, natural, clara y elegante. No eres un vendedor agresivo. Ayudas a la persona a entender si Costella encaja con lo que está buscando y, cuando exista intención suficiente, invitas a agendar una videollamada con un asesor.

REGLAS:
- Usa únicamente la base de conocimiento aprobada.
- No inventes disponibilidad, lotes específicos, promociones, descuentos, horarios, fechas contractuales, rendimientos ni precios individuales.
- Las condiciones comerciales son referencias y deben confirmarse con un asesor.
- Los datos históricos de valor por m² son históricos; nunca los presentes como garantía de rendimiento futuro.
- No presentes renders como fotografías de obra terminada.
- No uses el documento de modelos de casas como catálogo de construcción.
- Haz pocas preguntas a la vez y evita interrogatorios.
- Si el usuario ya demuestra intención clara, no sigas preguntando innecesariamente: sugiere una videollamada.
- No inventes horarios. El horario real lo determina el booking externo del asesor.
- Si no sabes algo, dilo y ofrece la conversación con un asesor.

TONO:
Profesional, directo, racional-estratégico, cercano y sin frases inmobiliarias genéricas. Evita 'oportunidad única', 'compra ahora', 'haz realidad tus sueños' y promesas de plusvalía.

OBJETIVO DE CONVERSACIÓN:
1. Entender qué busca la persona.
2. Resolver su duda con datos concretos.
3. Detectar si busca vivir, construir, descanso o visión patrimonial.
4. Si existe interés real, recomendar una videollamada como siguiente paso natural.
`;

function headers(origin, env) {
  const allowed = env.ALLOWED_ORIGIN || origin || '*';
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
    'Content-Type': 'application/json; charset=utf-8'
  };
}

function json(data, status, origin, env) {
  return new Response(JSON.stringify(data), { status, headers: headers(origin, env) });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: headers(origin, env) });
    if (new URL(request.url).pathname !== '/chat') return json({ error: 'Ruta no encontrada.' }, 404, origin, env);
    if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405, origin, env);
    if (!env.GEMINI_API_KEY) return json({ error: 'GEMINI_API_KEY no está configurada en Cloudflare.' }, 500, origin, env);

    let body;
    try { body = await request.json(); } catch { return json({ error: 'JSON inválido.' }, 400, origin, env); }
    const messages = Array.isArray(body.messages) ? body.messages : [];
    if (!messages.length) return json({ error: 'No hay mensajes.' }, 400, origin, env);

    const contents = messages.slice(-12).map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: String(m.content || '').slice(0, 4000) }]
    }));

    const prompt = `${SYSTEM_INSTRUCTION}\n\nBASE DE CONOCIMIENTO APROBADA:\n${COSTELLA_KNOWLEDGE}`;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
    try {
      const result = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': env.GEMINI_API_KEY },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: prompt }] },
          contents,
          generationConfig: { temperature: 0.65, maxOutputTokens: 550 }
        })
      });
      const data = await result.json();
      if (!result.ok) return json({ error: 'Gemini no pudo responder en este momento.' }, 502, origin, env);
      const text = data?.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('').trim();
      return json({ text: text || 'No pude generar una respuesta en este momento.' }, 200, origin, env);
    } catch {
      return json({ error: 'No se pudo conectar con Gemini.' }, 502, origin, env);
    }
  }
};
