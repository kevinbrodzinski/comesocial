
export const getStopTypeColor = (type: string | undefined) => {
  if (!type) return { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' };
  
  switch (type.toLowerCase()) {
    case 'restaurant': return { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' };
    case 'bar': return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };
    case 'club': return { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' };
    case 'lounge': return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' };
    default: return { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' };
  }
};

export const getStopTypeAccent = (type: string | undefined) => {
  if (!type) return 'border-l-slate-300';
  
  switch (type.toLowerCase()) {
    case 'restaurant': return 'border-l-orange-400';
    case 'bar': return 'border-l-blue-400';
    case 'club': return 'border-l-purple-400';
    case 'lounge': return 'border-l-green-400';
    default: return 'border-l-slate-400';
  }
};
