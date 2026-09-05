export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#f0f2f5] p-6 text-slate-900 font-sans flex flex-col items-center">
      <header className="h-16 w-full max-w-6xl border-2 border-black bg-white flex items-center px-6 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8">
        <a href="/dashboard" className="font-black text-xl tracking-tight uppercase hover:underline">← Back to Dashboard</a>
      </header>

      <main className="w-full max-w-6xl bg-white border-2 border-black rounded-2xl p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <h1 className="text-3xl font-black uppercase mb-6 border-b-2 border-black pb-4 tracking-tight">Privacy Policy</h1>

        <div className="space-y-6 font-medium text-slate-700 leading-relaxed">
          <p>Last updated: {new Date().toLocaleDateString()}</p>

          <section>
            <h2 className="text-xl font-bold uppercase text-black mb-2">1. Information We Collect</h2>
            <p>At III Nexus, we collect information that you provide directly to us, such as when you create an account, update your profile, use the interactive features of our Services, or communicate with us. This may include your name, email address, member ID, and any other information you choose to provide.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold uppercase text-black mb-2">2. How We Use Your Information</h2>
            <p>We use the information we collect to provide, maintain, and improve our services, including III applications. We also use the information to communicate with you, monitor and analyze trends, and personalize your experience.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold uppercase text-black mb-2">3. Information Sharing</h2>
            <p>We do not share or sell your personal information to third parties. We may share information with vendors, consultants, and other service providers who need access to such information to carry out work on our behalf for the III ecosystem.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold uppercase text-black mb-2">4. Data Security</h2>
            <p>We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
