const json = (statusCode, body) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  body: JSON.stringify(body)
});

export async function handler(event) {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Método no permitido.' });
  const apiKey = process.env.OPENAI_API_KEY;
  const accessCode = process.env.AGROCONTROL_AI_CODE;
  if (!apiKey) return json(503, { error: 'El servicio de IA aún no está configurado. Falta agregar OPENAI_API_KEY en Netlify.' });

  if (!accessCode) return json(503, { error: 'Falta configurar AGROCONTROL_AI_CODE en Netlify.' });

  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch { return json(400, { error: 'La solicitud no tiene un formato válido.' }); }

  if (typeof body.accessCode !== 'string' || body.accessCode !== accessCode) return json(401, { error: 'Código de acceso a IA incorrecto.' });

  const image = body.image;
  if (typeof image !== 'string' || !/^data:image\/(jpeg|png|webp);base64,/.test(image)) {
    return json(400, { error: 'Selecciona una fotografía JPG, PNG o WEBP válida.' });
  }
  if (image.length > 8_500_000) return json(413, { error: 'La fotografía procesada es demasiado grande. Selecciona una imagen más pequeña.' });
  const crop = String(body.crop || '').slice(0, 80);
  if (!crop) return json(400, { error: 'Indica el cultivo antes de analizar la imagen.' });

  const context = [
    `Cultivo: ${crop}`,
    `Etapa: ${String(body.stage || 'No indicada').slice(0, 80)}`,
    `Comunidad o finca: ${String(body.farm || 'No indicada').slice(0, 120)}`,
    `Síntoma descrito por el usuario: ${String(body.symptom || 'No indicado').slice(0, 180)}`,
    `Órgano afectado: ${String(body.part || 'No indicado').slice(0, 100)}`,
    `Observaciones: ${String(body.notes || 'Ninguna').slice(0, 700)}`
  ].join('\n');

  const prompt = `Actúa como asistente de apoyo agronómico para técnicos agrícolas en Nicaragua. Analiza la fotografía y el contexto:\n${context}\n\nResponde en español claro y usa estas secciones: 1) Calidad de imagen y observaciones visibles; 2) Problema más compatible (si no hay evidencia suficiente, dilo); 3) Diagnósticos diferenciales, incluyendo enfermedad, plaga, deficiencia nutricional, fitotoxicidad o estrés hídrico; 4) Confianza orientativa baja/media/alta, aclarando que no es una probabilidad estadística calibrada; 5) Qué revisar y qué muestras/fotos adicionales tomar; 6) Manejo integrado del problema: saneamiento, poda, drenaje, sombra, nutrición equilibrada, monitoreo y alternativas biológicas cuando sean pertinentes; 7) Tratamiento fitosanitario: describe primero medidas culturales y biológicas. Solo menciona opciones químicas a nivel de ingrediente activo o grupo cuando exista base suficiente y sean productos registrados para ese cultivo/problema en Nicaragua; nunca inventes marcas, dosis, mezclas, intervalos, periodos de carencia ni reingreso. Indica que se debe confirmar registro y seguir etiqueta vigente y equipo de protección; si no puedes verificarlo, no prescribas y remite al técnico/MAG/INTA; 8) Manejo nutricional: si sospechas deficiencia, explica qué nutriente podría estar involucrado y qué signos adicionales verificar; solicita análisis de suelo y/o foliar. No inventes dosis de fertilizante ni frecuencias universales: solo da una dosis si está respaldada por una guía técnica aplicable y aclara cultivo, zona, edad y limitaciones; de lo contrario indica que debe calcularse con análisis y técnico local. Distingue fertilización edáfica y foliar y recuerda que la dosis foliar depende de la etiqueta/formulación; 9) Próximo paso recomendado. No inventes síntomas que no se vean ni confirmes un patógeno con una sola foto. Si la imagen no muestra tejido vegetal claramente, solicita otra fotografía.`;

  try {
    const upstream = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: process.env.OPENAI_VISION_MODEL || 'gpt-6-astra',
        input: [{ role: 'user', content: [
          { type: 'input_text', text: prompt },
          { type: 'input_image', image_url: image, detail: 'high' }
        ] }],
        max_output_tokens: 900
      })
    });
    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      const message = data?.error?.message || 'El proveedor de IA no pudo procesar la imagen.';
      return json(upstream.status === 429 ? 429 : 502, { error: message.slice(0, 400) });
    }
    const diagnosis = (data.output || []).flatMap(item => item.content || []).filter(part => part.type === 'output_text').map(part => part.text).join('\n').trim();
    if (!diagnosis) return json(502, { error: 'La IA no devolvió un diagnóstico legible. Intenta nuevamente con otra fotografía.' });
    return json(200, { diagnosis, model: process.env.OPENAI_VISION_MODEL || 'gpt-6-astra' });
  } catch {
    return json(502, { error: 'No fue posible conectar con el servicio de IA. Intenta nuevamente.' });
  }
}
