import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6 bg-[#f0f2f5]">
      <div className="w-full max-w-md bg-white border-2 border-black rounded-2xl p-8 flex flex-col relative shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
        <h1 className="text-6xl font-black uppercase mb-4 text-black">404</h1>
        <h2 className="text-xl font-bold uppercase tracking-tight mb-4">Page Not Found</h2>
        <p className="text-slate-500 font-medium text-sm mb-8">
          The module you are looking for does not exist in this workspace.
        </p>
        <Link 
          href="/"
          className="w-full bg-[#d1ff00] text-black border-2 border-black rounded-xl py-4 font-black uppercase tracking-widest hover:bg-[#b8e600] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all inline-block no-underline"
        >
          Return to Hub
        </Link>
      </div>
    </main>
  );
}
