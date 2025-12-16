import { NextResponse } from "next/server";
import { getDocuments } from "@/lib/storage";

export async function POST(req: Request) {
    try {
        const { message } = await req.json();
        const docs = await getDocuments();

        // Simple keyword search (Token-based)
        const lowerMessage = message.toLowerCase().replace(/[^\w\s]/g, "");
        const tokens = lowerMessage.split(/\s+/).filter((t: string) => t.length > 3);

        // Score documents based on token matches
        const scoredDocs = docs.map(doc => {
            let score = 0;
            const text = (doc.title + " " + doc.content).toLowerCase();

            tokens.forEach((token: string) => {
                if (text.includes(token)) score++;
            });

            return { doc, score };
        });

        // Filter documents with at least one match and sort by score
        const relevantDocs = scoredDocs
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .map(item => item.doc);

        if (relevantDocs.length === 0) {
            return NextResponse.json({
                role: "assistant",
                content: "Lo siento, no tengo información sobre ese tema en mis manuales actuales. Por favor consulta con un administrador."
            });
        }

        // Construct a response based on the top match
        const topDoc = relevantDocs[0];

        // In a real app, we would send 'topDoc.content' + 'message' to OpenAI/Gemini here.
        // For now, we return a direct excerpt.
        const responseText = `Basado en el documento "${topDoc.title}", aquí tienes la información relevante:\n\n${topDoc.content.substring(0, 300)}${topDoc.content.length > 300 ? "..." : ""}`;

        return NextResponse.json({
            role: "assistant",
            content: responseText
        });

    } catch (e) {
        return NextResponse.json({ role: "assistant", content: "Ocurrió un error procesando tu pregunta." }, { status: 500 });
    }
}
