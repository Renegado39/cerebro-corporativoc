import { NextResponse } from "next/server";
import { getDocuments, addDocument, updateDocument, deleteDocument } from "@/lib/storage";

export async function GET() {
    const docs = await getDocuments();
    return NextResponse.json(docs);
}

export async function POST(req: Request) {
    const body = await req.json();
    const { action, document, id } = body;

    try {
        if (action === "create") {
            const docs = await addDocument(document);
            return NextResponse.json(docs);
        }
        else if (action === "update") {
            const docs = await updateDocument(document);
            return NextResponse.json(docs);
        }
        else if (action === "delete") {
            const docs = await deleteDocument(id);
            return NextResponse.json(docs);
        }
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    } catch (e) {
        return NextResponse.json({ error: "Failed to process" }, { status: 500 });
    }
}
