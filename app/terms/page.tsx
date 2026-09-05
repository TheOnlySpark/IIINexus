export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#f0f2f5] p-6 text-slate-900 font-sans flex flex-col items-center">
      <header className="h-16 w-full max-w-6xl border-2 border-black bg-white flex items-center px-6 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8">
        <a href="/dashboard" className="font-black text-xl tracking-tight uppercase hover:underline">← Back to Dashboard</a>
      </header>

      <main className="w-full max-w-6xl bg-white border-2 border-black rounded-2xl p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <h1 className="text-3xl font-black uppercase mb-6 border-b-2 border-black pb-4 tracking-tight">Terms of Service</h1>

        <div className="space-y-6 font-medium text-slate-700 leading-relaxed">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <section>
            <h2 className="text-xl font-bold uppercase text-black mb-2">1. Acceptance of Terms</h2>
            <p>By accessing and using III Nexus, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this service.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold uppercase text-black mb-2">2. Authorized Use</h2>
            <p>III Nexus is intended solely for the use of community members. You agree to use the platform only for its intended community-related purposes.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold uppercase text-black mb-2">3. User Conduct</h2>
            <p>You agree not to use the service for any unlawful purpose or in any way that interrupts, damages, or impairs the service. Attempting to bypass security measures, share credentials, or access unauthorized data is strictly prohibited and may result in revocation of access.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold uppercase text-black mb-2">4. Account Security</h2>
            <p>You are responsible for maintaining the confidentiality of your account credentials. You must notify community administration immediately of any unauthorized use of your account or any other breach of security.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold uppercase text-black mb-2">5. Modifications to Service</h2>
            <p>We reserve the right to modify or discontinue, temporarily or permanently, the service (or any part thereof) with or without notice at any time.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
