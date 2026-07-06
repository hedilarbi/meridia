'use client';

export default function InspirationSection() {
  const inspirations = [
    {
      icon: 'fa-wine-glass',
      title: 'Gastronomie',
      description: "Les meilleures tables de France et d'ailleurs.",
    },
    {
      icon: 'fa-sailboat',
      title: 'Croisières',
      description: 'Naviguez sur la Méditerranée en yacht privé.',
    },
    {
      icon: 'fa-leaf',
      title: 'Éco-Luxe',
      description: 'Le respect de la nature allié au confort ultime.',
    },
    {
      icon: 'fa-gem',
      title: 'Héritage',
      description: "Séjournez dans des lieux chargés d'histoire.",
    },
  ];

  return (
    <section className="py-20 sm:py-32 max-w-7xl mx-auto px-6">
      <h2 className="text-4xl sm:text-5xl font-black mb-4 text-slate-900">Inspirations</h2>
      <div className="w-24 h-1 bg-sky-500 rounded-full mb-12"></div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
        {inspirations.map((item, index) => (
          <div
            key={index}
            className="inspiration-card bg-white p-8 sm:p-10 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group"
          >
            <i className={`fa-solid ${item.icon} text-3xl sm:text-4xl text-sky-500 mb-6 block group-hover:scale-110 transition-transform`}></i>
            <h3 className="text-lg sm:text-xl font-bold mb-2 text-slate-900">{item.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
