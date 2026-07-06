'use client';

export default function CategoryCards() {
  const categories = [
    {
      icon: 'fa-umbrella-beach',
      title: 'Plages de rêve',
      description: 'Eaux cristallines et sable fin pour une détente absolue.',
      color: 'orange',
      bgColor: 'bg-orange-100',
      hoverBg: 'group-hover:bg-orange-500',
      iconColor: 'text-orange-500',
    },
    {
      icon: 'fa-mountain-sun',
      title: 'Aventure pure',
      description: 'Explorez les sommets et les sentiers inexplorés.',
      color: 'sky',
      bgColor: 'bg-sky-100',
      hoverBg: 'group-hover:bg-sky-500',
      iconColor: 'text-sky-500',
    },
    {
      icon: 'fa-city',
      title: 'City Breaks',
      description: "L'énergie des capitales mondiales à portée de main.",
      color: 'emerald',
      bgColor: 'bg-emerald-100',
      hoverBg: 'group-hover:bg-emerald-500',
      iconColor: 'text-emerald-500',
    },
    {
      icon: 'fa-spa',
      title: 'Bien-être',
      description: "Retrouvez votre sérénité dans des cadres d'exception.",
      color: 'purple',
      bgColor: 'bg-purple-100',
      hoverBg: 'group-hover:bg-purple-500',
      iconColor: 'text-purple-500',
    },
  ];

  return (
    <section className="py-12 max-w-7xl mx-auto px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 text-slate-900">
            Parcourez par envie
          </h2>
          <p className="text-slate-500 font-medium">Quel type de voyageur êtes-vous ?</p>
        </div>
        <div className="flex gap-3">
          <button className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors">
            <i className="fa-solid fa-arrow-left text-slate-600"></i>
          </button>
          <button className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors">
            <i className="fa-solid fa-arrow-right text-slate-600"></i>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <div
            key={index}
            className="category-card group bg-white p-6 sm:p-8 rounded-[32px] border border-slate-100 cursor-pointer"
          >
            <div className={`w-14 h-14 sm:w-16 sm:h-16 ${category.bgColor} rounded-2xl flex items-center justify-center mb-5 ${category.hoverBg} transition-colors`}>
              <i className={`fa-solid ${category.icon} text-xl sm:text-2xl ${category.iconColor} group-hover:text-white transition-colors`}></i>
            </div>
            <h3 className="text-lg sm:text-xl font-bold mb-2 text-slate-900">{category.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{category.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
