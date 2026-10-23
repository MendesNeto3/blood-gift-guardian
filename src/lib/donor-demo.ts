export const demoHours = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];
export type DemoRequest = { id: string; center: string; date: string; time: string; status: 'solicitado' | 'cancelado' };
export function isDemoSlotAvailable(center: string, date: string, time: string, requests: DemoRequest[]) {
  if (!date || !demoHours.includes(time)) return false;
  const value = new Date(`${date}T${time}`);
  if (Number.isNaN(value.getTime()) || value <= new Date()) return false;
  // Fixed fictional schedule, not a claim about a real center's availability.
  if (time === '10:00' || time === '14:00') return false;
  return !requests.some(r => r.center === center && r.date === date && r.time === time && r.status !== 'cancelado');
}
export function isDemoDocumentAllowed(file: { type: string; size: number }) {
  return ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type) && file.size <= 10 * 1024 * 1024;
}