'use client';

import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      // Ici vous pouvez ajouter la logique d'inscription à la newsletter
      console.log('Newsletter subscription:', email);
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setEmail('');
      }, 3000);
    }
  };

  return (
    <section className="py-16 sm:py-24 max-w-7xl mx-auto px-6">
      <div className="newsletter-section p-8 sm:p-12 md:p-20 text-center">
        {/* Decorative Glows */}
        <div className="newsletter-glow-1"></div>
        <div className="newsletter-glow-2"></div>

        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-4 sm:mb-6">
            Prêt pour l'aventure ?
          </h2>
          <p className="text-slate-400 text-base sm:text-lg mb-8 sm:mb-10 font-medium">
            Inscrivez-vous pour recevoir nos offres exclusives et nos guides de voyage secrets directement dans votre boîte mail.
          </p>

          {isSubmitted ? (
            <div className="bg-emerald-500/20 backdrop-blur-xl rounded-[24px] sm:rounded-[32px] border border-emerald-500/30 p-6 sm:p-8">
              <i className="fas fa-check-circle text-emerald-400 text-4xl sm:text-5xl mb-4"></i>
              <p className="text-white font-bold text-lg">Merci pour votre inscription !</p>
              <p className="text-slate-400 text-sm mt-2">Vous recevrez bientôt nos meilleures offres.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-2 bg-white/10 backdrop-blur-xl rounded-[24px] sm:rounded-[32px] border border-white/20">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre adresse email"
                className="flex-1 bg-transparent border-none outline-none text-white px-4 sm:px-6 py-3 sm:py-4 placeholder:text-slate-500 font-semibold"
                required
              />
              <button
                type="submit"
                className="bg-sky-500 hover:bg-sky-400 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-[18px] sm:rounded-[24px] font-black transition-all shadow-xl shadow-sky-500/20"
              >
                Rejoindre
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
