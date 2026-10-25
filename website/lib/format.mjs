export const human = (value) => value.replaceAll('_',' ').toLowerCase().replace(/^./,c=>c.toUpperCase());
export function day(value) { return new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'}).format(new Date(value+'T00:00:00Z')); }
export function number(value, style='number') {
  if(value===null || value===undefined) return 'Unavailable';
  if(typeof value!=='number' || !Number.isFinite(value)) throw new Error('INVALID_DISPLAY_NUMBER');
  if(style==='money') return new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP',maximumFractionDigits:0}).format(value);
  if(style==='percent') return new Intl.NumberFormat('en-GB',{style:'percent',minimumFractionDigits:2,maximumFractionDigits:2}).format(value);
  return new Intl.NumberFormat('en-GB',{maximumFractionDigits:2}).format(value);
}
export const valuation = value => value===null ? 'Pending authoritative valuation' : number(value,'money');
export const returnValue = value => value===null ? 'Pending authoritative valuation' : number(value,'percent');
export function observationCorrections(dataset,date) { return dataset.corrections.filter(c=>c.date===date).sort((a,b)=>a.correction_timestamp.localeCompare(b.correction_timestamp)); }

export function metricNote(value,status) { return value!==null ? 'Published statistic' : status==='INSUFFICIENT_FORWARD_HISTORY' ? human(status) : 'Unavailable in the public record'; }
