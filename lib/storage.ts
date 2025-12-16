import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "documents.json");

export type Document = {
    id: string;
    title: string;
    content: string;
    date: string;
};

async function ensureDataDir() {
    try {
        await fs.access(DATA_DIR);
    } catch {
        await fs.mkdir(DATA_DIR, { recursive: true });
    }
}

export async function getDocuments(): Promise<Document[]> {
    await ensureDataDir();
    try {
        const data = await fs.readFile(DB_FILE, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

export async function saveDocuments(docs: Document[]) {
    await ensureDataDir();
    await fs.writeFile(DB_FILE, JSON.stringify(docs, null, 2));
}

export async function addDocument(doc: Document) {
    const docs = await getDocuments();
    const newDocs = [...docs, doc];
    await saveDocuments(newDocs);
    return newDocs;
}

export async function updateDocument(doc: Document) {
    const docs = await getDocuments();
    const newDocs = docs.map((d) => (d.id === doc.id ? doc : d));
    await saveDocuments(newDocs);
    return newDocs;
}

export async function deleteDocument(id: string) {
    const docs = await getDocuments();
    const newDocs = docs.filter((d) => d.id !== id);
    await saveDocuments(newDocs);
    return newDocs;
}
