import Link from "next/link";
import { ArrowRight, Lock, MessagesSquare } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-black">
      <div className="max-w-3xl w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-500">
            Cerebro Corporativo
          </h1>
          <p className="text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Centraliza el conocimiento de tu empresa. Tus empleados obtienen respuestas instantáneas, tú mantienes el control.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto pt-8">
          <Link
            href="/chat"
            className="group relative flex flex-col items-center justify-center gap-4 p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all hover:border-primary/50"
          >
            <div className="p-4 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
              <MessagesSquare size={32} />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">Soy Empleado</h3>
              <p className="text-sm text-zinc-500">Tengo una pregunta</p>
            </div>
          </Link>

          <Link
            href="/admin"
            className="group relative flex flex-col items-center justify-center gap-4 p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all hover:border-primary/50"
          >
            <div className="p-4 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
              <Lock size={32} />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">Administración</h3>
              <p className="text-sm text-zinc-500">Gestionar contenido</p>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
