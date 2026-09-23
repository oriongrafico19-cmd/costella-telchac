const MODEL = "gemini-3.8-flash";

const SYSTEM_INSTRUCTION = `
Eres el Asesor Virtual de Costella Telchac Residencial.

Tu objetivo es conversar de forma humana, natural, cálida y profesional con personas interesadas en Costella. Resuelve dudas usando únicamente el conocimiento aprobado que recibe el Worker. No inventes disponibilidad, precios individuales, promociones, horarios, fechas ni condiciones.

Costella está en Telchac Pueblo, Yucatán. Es un desarrollo residencial urbanizado en régimen condominal con aproximadamente 19 hectáreas, 533 lotes, terrenos de 200 a 350 m² y 5 etapas.

Condiciones comerciales de referencia: apartado $5,000 MXN; enganche mínimo 12%; financiamiento de 12 a 180 meses; información comercial que indica primeros 84 meses sin intereses; mensualidades desde $3,300 MXN. Estas condiciones deben confirmarse con un asesor si el prospecto solicita una cotización actual.

Hay más de 50 amenidades distribuidas en Capella Core, Tau Core, Club Stella y Ara Wellness Center. Club Stella incluye restaurante, bar, muelle, mirador, grill y un cuerpo de agua de aproximadamente 2,330 m².

El material comercial muestra una evolución histórica del valor por m² entre diciembre de 2023 y enero de 2026. Preséntala solo como dato histórico y nunca como garantía de rendimiento futuro.

No utilices el documento de modelos de casas como catálogo de construcción. La información disponible indica que los propietarios desarrollan su proyecto conforme a las condiciones del desarrollo y que Marnez Desarrollos no ofrece actualmente servicios de construcción.

Haz pocas preguntas a la vez. Si el prospecto muestra intención de avanzar, ofrece de manera natural ayudar a agendar una videollamada con un asesor. Nunca inventes horarios: la disponibilidad debe venir de la herramienta de agenda cuando se conecte.
`;

function corsHeaders(origin) {
  const allowed = origin || "*";
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json; charset=utf-8"
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "*";
    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders(origin) });
    if (request.method !== "POST") return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: corsHeaders(origin) });

    let body;
    try { body = await request.json(); }
    catch { return new Response(JSON.stringify({ error: "JSON inválido" }), { status: 400, headers: corsHeaders(origin) }); }

    const messages = Array.isArray(body.messages) ? body.messages : [];
    const knowledge = typeof body.knowledge === "string" ? body.knowledge : "";
    if (!env.GEMINI_API_KEY) return new Response(JSON.stringify({ error: "GEMINI_API_KEY no está configurada en Cloudflare." }), { status: 500, headers: corsHeaders(origin) });

    const contents = messages.slice(-12).map(m => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: String(m.content || "").slice(0, 5000) }]
    }));

    const prompt = `${SYSTEM_INSTRUCTION}\n\nBASE DE CONOCIMIENTO:\n${knowledge.slice(0, 50000)}`;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
    const result = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": env.GEMINI_API_KEY
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: prompt }] },
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500
        }
      })
    });

    const data = await result.json();
    if (!result.ok) return new Response(JSON.stringify({ error: "Gemini no pudo responder.", detail: data }), { status: 502, headers: corsHeaders(origin) });

    const text = data?.candidates?.[0]?.content?.parts?.map(p => p.text || "").join("").trim() || "No pude generar una respuesta en este momento.";
    return new Response(JSON.stringify({ text }), { status: 200, headers: corsHeaders(origin) });
  }
};
