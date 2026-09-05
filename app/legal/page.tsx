export default function LegalInformation() {
  return (
    <div className="min-h-screen bg-[#f0f2f5] p-6 text-slate-900 font-sans flex flex-col items-center">
      <header className="h-16 w-full max-w-6xl border-2 border-black bg-white flex items-center px-6 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8">
        <a href="/dashboard" className="font-black text-xl tracking-tight uppercase hover:underline">← Back to Dashboard</a>
      </header>

      <main className="w-full max-w-6xl bg-white border-2 border-black rounded-2xl p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <h1 className="text-3xl font-black uppercase mb-6 border-b-2 border-black pb-4 tracking-tight">Legal Information</h1>
        
        <div className="space-y-6 font-medium text-slate-700 leading-relaxed">
          <p>This page serves as a central hub for all legal information regarding III Nexus.</p>
          
          <ul className="list-disc pl-5 space-y-4 text-black">
            <li>
              <a href="/privacy" className="font-bold underline hover:text-indigo-600 transition-colors">Privacy Policy</a>
              <p className="text-slate-600 font-medium mt-1">Information on how we handle your data.</p>
            </li>
            <li>
              <a href="/terms" className="font-bold underline hover:text-indigo-600 transition-colors">Terms of Service</a>
              <p className="text-slate-600 font-medium mt-1">Rules and guidelines for using the Nexus platform.</p>
            </li>
          </ul>

          <div className="mt-8 pt-6 border-t-2 border-black">
            <h2 className="text-xl font-bold uppercase text-black mb-2">Copyright & Trademarks</h2>
            <p>All content included on this site, such as text, graphics, logos, button icons, images, and software, is the property of III Nexus or its content suppliers and protected by international copyright laws. The compilation of all content on this site is the exclusive property of III Nexus.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
