import { NextResponse } from "next/server";
import { getDocuments } from "@/lib/storage";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const { message } = await req.json();
        const docs = await getDocuments();

        // 1. Search relevant context (Simple Token-based)
        const lowerMessage = message.toLowerCase().replace(/[^\w\s]/g, "");
        const tokens = lowerMessage.split(/\s+/).filter((t: string) => t.length > 3);

        const scoredDocs = docs.map(doc => {
            let score = 0;
            const text = (doc.title + " " + doc.content).toLowerCase();
            tokens.forEach((token: string) => {
                if (text.includes(token)) score++;
            });
            return { doc, score };
        });

        // Get top 3 most relevant documents
        const relevantDocs = scoredDocs
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 3)
            .map(item => item.doc);

        // 2. Prepare Context for AI (Context might be empty if no matches)
        const contextText = relevantDocs.length > 0
            ? relevantDocs.map(d => `--- ${d.title} ---\n${d.content}`).join("\n\n")
            : "No hay documentos relevantes encontrados para esta consulta.";

        const systemPrompt = `Eres el Asistente de Conocimiento Corporativo oficial.
Tus respuestas deben basarse PRINCIPALMENTE en la "Información Corporativa" proporcionada.

Reglas:
1. Si el usuario saluda o conversa casualmente, sé amable y profesional (ej: "Hola, ¿en qué puedo ayudarte con los manuales?").
2. Si hace una pregunta específica sobre la empresa y NO tienes la información en el contexto abajo, di claramente que no está en tus manuales.
3. No inventes reglas o políticas que no estén en el texto.

Información Corporativa Disponible:
${contextText}`;

        // 3. Call OpenAI
        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message }
            ],
            model: "gpt-4o-mini",
        });

        const aiResponse = completion.choices[0].message.content;

        return NextResponse.json({
            role: "assistant",
            content: aiResponse
        });

    } catch (error) {
        console.error("OpenAI Error:", error);
        return NextResponse.json({
            role: "assistant",
            content: "Lo siento, hubo un error técnico procesando tu respuesta inteligente."
        }, { status: 500 });
    }
}
