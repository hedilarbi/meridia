'use client';
import { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale/fr';
import 'react-datepicker/dist/react-datepicker.css';

interface Props {
  startDate: Date | null;
  endDate: Date | null;
  onChange: (range: { start: Date | null; end: Date | null; tolerance?: number }) => void;
}

export default function DateRangeSelector({ startDate, endDate, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [localStart, setLocalStart] = useState<Date | null>(startDate);
  const [localEnd, setLocalEnd] = useState<Date | null>(endDate);
  const [tolerance, setTolerance] = useState<number>(0);
  const ref = useRef<HTMLDivElement | null>(null);

  // --- CORRECTION : SYNC SANS USEEFFECT ---
  // On stocke les props précédentes pour détecter un changement externe
  const [prevProps, setPrevProps] = useState({ startDate, endDate });

  if (startDate !== prevProps.startDate || endDate !== prevProps.endDate) {
    // Si les props changent, on met à jour l'état local immédiatement durant le rendu
    setLocalStart(startDate);
    setLocalEnd(endDate);
    setPrevProps({ startDate, endDate });
  }
  // ---------------------------------------

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const formatLabel = (s: Date | null, e: Date | null) => {
    if (!s || !e) return 'Ajouter des dates';
    try {
      const sStr = format(s, "eee d MMM", { locale: fr });
      const eStr = format(e, "eee d MMM", { locale: fr });
      return `${sStr} → ${eStr}`;
    } catch {
      return 'Ajouter des dates';
    }
  };

  const apply = () => {
    onChange({ start: localStart, end: localEnd, tolerance });
    setOpen(false);
  };

  const clear = () => {
    setLocalStart(null);
    setLocalEnd(null);
  };

  return (
    <div className="relative" ref={ref}>
      <button 
        type="button" 
        onClick={() => { 
          if (!open) { 
            setOpen(true); 
            setClosing(false); 
          } else { 
            setClosing(true); 
          } 
        }} 
        className="bg-gray-50 rounded-lg px-3 py-2 w-full text-left text-sm text-gray-700 flex items-center justify-between"
      >
        <span className="text-sm">{formatLabel(localStart, localEnd)}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.584l3.71-4.353a.75.75 0 111.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>

     {open && (
  <div 
    className={`absolute z-50 mt-2 w-170 md:w-190 bg-white rounded-2xl shadow-lg p-4 ${closing ? 'popover-exit' : 'popover-animate'} origin-top-center`} 
    onAnimationEnd={() => { if (closing) { setOpen(false); setClosing(false); } }}
  >
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm text-gray-500">Dates</div>
              <div className="font-semibold text-lg">{formatLabel(localStart, localEnd)}</div>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-2 text-sm rounded-lg border" onClick={clear}>Effacer</button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm" onClick={apply}>Valider</button>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex-1">
              <DatePicker
                selected={localStart}
                onChange={(dates: [Date | null, Date | null]) => {
                  const [s, e] = dates; 
                  setLocalStart(s); 
                  setLocalEnd(e); 
                }}
                startDate={localStart}
                endDate={localEnd}
                selectsRange
                monthsShown={2}
                inline
                locale={fr}
                calendarClassName="rounded-2xl"
              />
            </div>
            <div className="w-64">
              <div className="mb-3 text-sm text-gray-700 font-medium">Préférences</div>
              <div className="flex flex-wrap gap-2">
                {[0, 1, 2, 3, 7].map((d) => (
                  <button 
                    key={d} 
                    onClick={() => setTolerance(d)} 
                    className={`px-3 py-2 rounded-full border text-sm ${tolerance === d ? 'bg-blue-600 text-white border-blue-600' : 'text-gray-600 bg-white'}`}
                  >
                    {d === 0 ? 'Dates exactes' : `± ${d} jour${d > 1 ? 's' : ''}`}
                  </button>
                ))}
              </div>

              <div className="mt-6 text-sm text-gray-600">Sélection rapide</div>
              <div className="grid grid-cols-1 gap-2 mt-3">
                <button onClick={() => { const s = new Date(); const e = new Date(); e.setDate(s.getDate() + 3); setLocalStart(s); setLocalEnd(e); }} className="text-left px-3 py-2 rounded-lg border">Prochain week-end</button>
                <button onClick={() => { const s = new Date(); const e = new Date(); e.setMonth(s.getMonth() + 1); setLocalStart(s); setLocalEnd(e); }} className="text-left px-3 py-2 rounded-lg border">+1 mois</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}