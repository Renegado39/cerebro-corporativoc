import ChatInterface from "@/components/ChatInterface";

export default function ChatPage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
            <div className="w-full max-w-4xl space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        Base de Conocimiento
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400">
                        Resuelve tus dudas sobre reglamentos y procesos internos al instante.
                    </p>
                </div>
                <ChatInterface />
            </div>
        </main>
    );
}
