"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Save, FileText, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Document = {
    id: string;
    title: string;
    content: string;
    date: string;
};

export default function AdminDashboard() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [documents, setDocuments] = useState<Document[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentDoc, setCurrentDoc] = useState<Document>({ id: "", title: "", content: "", date: "" });

    // Load data from API
    useEffect(() => {
        if (isAuthenticated) {
            fetch("/api/documents")
                .then(res => res.json())
                .then(data => setDocuments(data))
                .catch(err => console.error("Failed to load docs", err));
        }
    }, [isAuthenticated]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === "admin123") { // Simple mock auth
            setIsAuthenticated(true);
        } else {
            alert("Contraseña incorrecta (prueba: admin123)");
        }
    };

    const handleSave = async () => {
        if (!currentDoc.title || !currentDoc.content) return;

        let action = "create";
        let docToSave = { ...currentDoc };

        if (currentDoc.id) {
            action = "update";
        } else {
            docToSave = {
                ...currentDoc,
                id: Date.now().toString(),
                date: new Date().toISOString().split('T')[0]
            };
        }

        try {
            const res = await fetch("/api/documents", {
                method: "POST",
                body: JSON.stringify({ action, document: docToSave }),
            });
            if (res.ok) {
                const updatedDocs = await res.json();
                setDocuments(updatedDocs);
                setIsEditing(false);
                setCurrentDoc({ id: "", title: "", content: "", date: "" });
            }
        } catch (err) {
            alert("Error guardando documento");
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("¿Estás seguro de eliminar este documento?")) {
            try {
                const res = await fetch("/api/documents", {
                    method: "POST",
                    body: JSON.stringify({ action: "delete", id }),
                });
                if (res.ok) {
                    const updatedDocs = await res.json();
                    setDocuments(updatedDocs);
                }
            } catch (err) {
                alert("Error eliminando documento");
            }
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] w-full max-w-md mx-auto space-y-6">
                <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-zinc-900 dark:bg-zinc-50 rounded-xl flex items-center justify-center mx-auto text-white dark:text-black">
                        <Lock size={24} />
                    </div>
                    <h2 className="text-2xl font-bold">Acceso Administrativo</h2>
                    <p className="text-sm text-zinc-500">Solo para personal autorizado</p>
                </div>
                <form onSubmit={handleLogin} className="w-full space-y-4">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Contraseña"
                        className="w-full p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:border-primary transition-colors"
                    />
                    <button
                        type="submit"
                        className="w-full p-3 bg-zinc-900 dark:bg-white text-white dark:text-black font-medium rounded-xl hover:opacity-90 transition-opacity"
                    >
                        Ingresar
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto w-full space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Gestión de Conocimiento</h1>
                    <p className="text-zinc-500">Tus documentos activos: {documents.length}</p>
                </div>
                <button
                    onClick={() => {
                        setCurrentDoc({ id: "", title: "", content: "", date: "" });
                        setIsEditing(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                    <Plus size={18} />
                    Nuevo Documento
                </button>
            </div>

            <div className="grid gap-4">
                {documents.map((doc) => (
                    <motion.div
                        key={doc.id}
                        layoutId={doc.id}
                        className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl flex items-start justify-between group hover:border-primary/50 transition-colors"
                    >
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <FileText size={18} className="text-zinc-400" />
                                <h3 className="font-medium text-lg">{doc.title}</h3>
                            </div>
                            <p className="text-sm text-zinc-500 line-clamp-2 max-w-xl">{doc.content}</p>
                            <p className="text-xs text-zinc-400 pt-2">Actualizado: {doc.date}</p>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => {
                                    setCurrentDoc(doc);
                                    setIsEditing(true);
                                }}
                                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-400"
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => handleDelete(doc.id)}
                                className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 rounded-lg"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {isEditing && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-zinc-950 w-full max-w-2xl rounded-2xl p-6 shadow-2xl space-y-6">
                        <h3 className="text-xl font-bold">{currentDoc.id ? "Editar Documento" : "Nuevo Documento"}</h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Título</label>
                                <input
                                    type="text"
                                    value={currentDoc.title}
                                    onChange={(e) => setCurrentDoc(prev => ({ ...prev, title: e.target.value }))}
                                    className="w-full p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:border-primary"
                                    placeholder="Ej: Política de Reembolsos"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Contenido</label>
                                <textarea
                                    value={currentDoc.content}
                                    onChange={(e) => setCurrentDoc(prev => ({ ...prev, content: e.target.value }))}
                                    rows={10}
                                    className="w-full p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:border-primary resize-none"
                                    placeholder="Pega aquí el contenido del reglamento, manual o política..."
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900 rounded-lg"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                            >
                                <Save size={18} />
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
