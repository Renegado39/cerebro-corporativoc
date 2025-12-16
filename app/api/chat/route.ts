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

        // 2. If no context found, return clean message
        if (relevantDocs.length === 0) {
            return NextResponse.json({
                role: "assistant",
                content: "No encontré información específica en los manuales sobre este tema. Por favor, reformula tu pregunta o contacta a un administrador."
            });
        }

        // 3. Prepare Context for AI
        const contextText = relevantDocs.map(d => `--- ${d.title} ---\n${d.content}`).join("\n\n");
        const systemPrompt = `Eres el Asistente de Conocimiento Corporativo oficial.
Tus respuestas deben basarse ESTRICTAMENTE en la "Información Corporativa" proporcionada abajo.
Si la respuesta no está en el texto, di que no tienes esa información.
Sé amable, profesional y conciso.

Información Corporativa:
${contextText}`;

        // 4. Call OpenAI
        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message }
            ],
            model: "gpt-4o-mini", // Cost-effective and fast
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
