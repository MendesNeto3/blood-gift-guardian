import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState, type FormEvent } from 'react';
import { CalendarDays, LogOut, Heart, MapPin, History, FileUp, Check, Clock, Trash2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BloodlinkBrand } from '@/components/BloodlinkBrand';
import { DonorForm, extractDonorForm, fieldClass } from '@/components/DonorForm';
import { readDonorArea, saveDonorProfile, type DonorFormData } from '@/lib/donor';
import { supabase } from '@/integrations/supabase/client';
import { centers } from '@/lib/mock-data';

export const Route = createFileRoute('/area-doador')({ ssr: false, head: () => ({ meta: [
  { title: 'Minha área de doador — Bloodlink' }, { name: 'description', content: 'Agende sua doação, encontre hemocentros, veja seu histórico e envie documentos.' },
  { property: 'og:title', content: 'Minha área de doador — Bloodlink' }, { property: 'og:description', content: 'Seu cuidado e seus horários em um só lugar.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' }, { name: 'robots', content: 'noindex' },
] }), component: DonorArea });

type Tab = 'agendar' | 'centros' | 'historico' | 'documentos' | 'ficha';
const tabs: { id: Tab; label: string; icon: typeof CalendarDays }[] = [
  { id: 'agendar', label: 'Agendar doação', icon: CalendarDays },
  { id: 'centros', label: 'Hemocentros próximos', icon: MapPin },
  { id: 'historico', label: 'Histórico', icon: History },
  { id: 'documentos', label: 'Documentos', icon: FileUp },
  { id: 'ficha', label: 'Minha ficha', icon: Heart },
];
const hours = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];
// Disponibilidade de demonstração até o serviço de agendamento ser conectado
function demoBusy(center: string, date: string, time: string) {
  let h = 0; for (const c of center + date + time) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h % 3 === 0;
}
const demoHistory = [
  { date: '2026-06-14', center: 'Hemocentro Central', type: 'Sangue total', volume: '450 ml' },
  { date: '2026-02-03', center: 'Posto Sul', type: 'Sangue total', volume: '450 ml' },
];
type Doc = { id: string; name: string; size: string; date: string };

function DonorArea() {
  const query = useQuery({ queryKey: ['donor-area'], queryFn: readDonorArea });
  const client = useQueryClient(); const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('agendar'); const [busy, setBusy] = useState(false); const [message, setMessage] = useState('');
  const today = new Date(); today.setDate(today.getDate() + 1);
  const minDate = today.toISOString().slice(0, 10);
  const [date, setDate] = useState(minDate); const [slot, setSlot] = useState('');
  const [docs, setDocs] = useState<Doc[]>([]);
  const p = query.data?.profile;
  const [centerChoice, setCenterChoice] = useState('');
  const center = centerChoice || p?.preferred_center || centers[0]!.name;
  const taken = useMemo(() => new Set((query.data?.appointments ?? []).filter(a => a.status !== 'cancelado').map(a => new Date(a.requested_at).toISOString())), [query.data]);

  function go(t: Tab) { setTab(t); setMessage(''); }
  async function signOut() { await client.cancelQueries(); client.clear(); await supabase.auth.signOut(); await navigate({ to: '/auth', replace: true }); }
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage('');
    try { await saveDonorProfile(extractDonorForm(event.currentTarget)); await query.refetch(); setMessage('Sua ficha foi salva.'); } catch { setMessage('Confira os dados da ficha e tente novamente.'); } finally { setBusy(false); }
  }
  async function chooseCenter(name: string) {
    if (!query.data) return; setBusy(true);
    const { error } = await supabase.from('profiles').update({ preferred_center: name, updated_at: new Date().toISOString() }).eq('id', query.data.user.id);
    setCenterChoice(name); setMessage(error ? 'Não foi possível salvar seu hemocentro.' : `${name} agora é seu hemocentro de escolha.`);
    await query.refetch(); setBusy(false);
  }
  async function book() {
    if (!query.data || !slot) return;
    const requestedAt = new Date(`${date}T${slot}`);
    if (requestedAt <= new Date()) { setMessage('Escolha uma data futura.'); return; }
    setBusy(true); setMessage('');
    const { error } = await supabase.from('donor_appointment_requests').insert({ user_id: query.data.user.id, center_name: center, requested_at: requestedAt.toISOString() });
    if (error) setMessage('Não foi possível solicitar este horário. Tente novamente.');
    else { setSlot(''); await query.refetch(); setMessage('Horário solicitado. Aguarde a confirmação do hemocentro.'); }
    setBusy(false);
  }
  async function cancel(id: string) {
    if (!query.data) return; setBusy(true);
    const { error } = await supabase.from('donor_appointment_requests').update({ status: 'cancelado' }).eq('id', id).eq('user_id', query.data.user.id);
    setMessage(error ? 'Não foi possível cancelar. Tente novamente.' : 'Solicitação cancelada.'); await query.refetch(); setBusy(false);
  }
  function addDocs(files: FileList | null) {
    if (!files) return;
    const ok = Array.from(files).filter(f => f.size <= 10 * 1024 * 1024 && /pdf|jpe?g|png/i.test(f.type));
    if (ok.length < files.length) setMessage('Alguns arquivos foram ignorados: use PDF, JPG ou PNG de até 10 MB.'); else setMessage('');
    setDocs(d => [...ok.map(f => ({ id: crypto.randomUUID(), name: f.name, size: `${(f.size / 1024 / 1024).toFixed(1)} MB`, date: new Date().toLocaleDateString('pt-BR') })), ...d]);
  }

  const initial: Partial<DonorFormData> = p ? { full_name: p.full_name, phone: p.phone, birth_date: p.birth_date ?? '', city: p.city, blood_type: p.blood_type as DonorFormData['blood_type'], ...(p.weight_kg === null ? {} : { weight_kg: p.weight_kg }), last_donation: p.last_donation ?? '', preferred_center: p.preferred_center, screening: p.screening as Record<string, string> } : { full_name: query.data?.user.user_metadata?.['full_name'] ?? '' };
  const nearby = [...centers].sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));

  return <div className="min-h-screen bg-card">
    <header className="border-b border-border"><div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-6"><BloodlinkBrand /><Button variant="ghost" onClick={signOut}><LogOut /> Sair</Button></div></header>
    <main className="mx-auto max-w-6xl px-6 py-10">
      <p className="font-mono text-xs text-primary">MINHA ÁREA DE DOADOR</p>
      <h1 className="mt-3 font-display text-3xl">Olá{p?.full_name ? `, ${p.full_name.split(' ')[0]}` : ''}.</h1>
      <p className="mt-2 text-sm text-muted-foreground">Seu hemocentro: <span className="font-semibold text-foreground">{p?.preferred_center || 'nenhum escolhido'}</span></p>
      <div className="mt-6 flex flex-wrap gap-2 border-b border-border pb-4">{tabs.map(t => <Button key={t.id} variant={tab === t.id ? 'default' : 'ghost'} onClick={() => go(t.id)}><t.icon />{t.label}</Button>)}</div>
      {message && <p role="status" className="my-5 rounded-md bg-accent p-4 text-sm leading-6 text-accent-foreground">{message}</p>}

      {query.isPending ? <p role="status" className="py-12">Carregando sua área…</p>
      : query.isError ? <div className="py-12"><p role="alert">Não foi possível carregar sua área.</p><Button className="mt-4" onClick={() => query.refetch()}>Tentar novamente</Button></div>
      : tab === 'ficha' ? <div className="max-w-3xl py-8"><DonorForm key={p?.updated_at ?? 'new'} initial={initial} busy={busy} onSubmit={save} /></div>

      : tab === 'agendar' ? <div className="grid gap-12 py-8 lg:grid-cols-[1.2fr_1fr]">
        <section>
          <h2 className="font-display text-2xl">Autoagendamento</h2>
          <p className="mb-6 mt-2 text-sm leading-6 text-muted-foreground">Escolha o hemocentro, o dia e um horário livre. A solicitação fica aguardando confirmação do hemocentro.</p>
          {!p?.birth_date && <p className="mb-5 border-l-2 border-primary pl-3 text-sm text-primary">Preencha <button className="underline" onClick={() => go('ficha')}>sua ficha</button> antes de agendar.</p>}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-2 text-sm"><span className="font-medium">Hemocentro</span><select value={center} onChange={e => { setCenterChoice(e.target.value); setSlot(''); }} className={fieldClass}>{centers.map(c => <option key={c.id}>{c.name}</option>)}</select></label>
            <label className="block space-y-2 text-sm"><span className="font-medium">Data</span><input type="date" min={minDate} value={date} onChange={e => { setDate(e.target.value); setSlot(''); }} className={fieldClass} /></label>
          </div>
          <p className="mb-3 mt-6 text-sm font-medium">Horários disponíveis</p>
          <div className="grid grid-cols-4 gap-2">{hours.map(h => {
            const mine = taken.has(new Date(`${date}T${h}`).toISOString());
            const off = !date || demoBusy(center, date, h) || mine;
            return <button key={h} disabled={off} onClick={() => setSlot(h)} className={`rounded-md border px-2 py-3 text-sm transition ${slot === h ? 'border-primary bg-primary text-primary-foreground' : off ? 'cursor-not-allowed border-border bg-muted text-muted-foreground line-through' : 'border-input hover:border-primary hover:text-primary'}`}>{h}</button>;
          })}</div>
          <p className="mt-2 font-mono text-[10px] text-muted-foreground">DISPONIBILIDADE DE DEMONSTRAÇÃO</p>
          <Button disabled={busy || !slot || !p?.birth_date} onClick={book} className="mt-6 h-12 w-full">{busy ? 'Aguarde…' : slot ? `Solicitar ${new Date(`${date}T00:00`).toLocaleDateString('pt-BR')} às ${slot}` : 'Escolha um horário'}</Button>
        </section>
        <section><h2 className="font-display text-2xl">Minhas solicitações</h2><div className="mt-6 divide-y divide-border">{query.data?.appointments.length ? query.data.appointments.map(a => <article key={a.id} className="py-5"><div className="flex items-start justify-between gap-3"><h3 className="font-semibold">{a.center_name}</h3><span className="rounded-md bg-accent px-2 py-1 text-xs text-accent-foreground">{a.status === 'cancelado' ? 'Cancelado' : 'Aguardando confirmação'}</span></div><p className="mt-2 flex items-center gap-1 text-sm text-muted-foreground"><Clock className="size-4" />{new Date(a.requested_at).toLocaleString('pt-BR', { dateStyle: 'medium', timeStyle: 'short' })}</p>{a.status !== 'cancelado' && <Button disabled={busy} onClick={() => cancel(a.id)} variant="link" className="mt-2 px-0">Cancelar solicitação</Button>}</article>) : <div className="border-t border-border py-8"><CalendarDays className="mb-3 size-8 text-muted-foreground" /><p className="text-sm text-muted-foreground">Você ainda não solicitou um horário.</p></div>}</div></section>
      </div>

      : tab === 'centros' ? <section className="py-8">
        <h2 className="font-display text-2xl">Hemocentros próximos a você</h2>
        <p className="mb-6 mt-2 text-sm text-muted-foreground">Ordenados pela distância. Escolha o seu hemocentro de preferência.</p>
        <div className="grid gap-4 md:grid-cols-2">{nearby.map(c => { const mine = p?.preferred_center === c.name; return <article key={c.id} className={`rounded-lg border p-5 ${mine ? 'border-primary' : 'border-border'}`}>
          <div className="flex items-start justify-between gap-3"><div><h3 className="font-semibold">{c.name}</h3><p className="mt-1 text-sm text-muted-foreground">{c.address} · {c.city}</p><p className="mt-1 text-xs text-muted-foreground">{c.hours}</p></div><p className="font-display text-xl text-primary">{c.distanceKm} km</p></div>
          <div className="mt-4 flex flex-wrap gap-2">{mine ? <span className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-2 text-xs text-primary-foreground"><Check className="size-4" />Meu hemocentro</span> : <Button size="sm" variant="outline" disabled={busy} onClick={() => chooseCenter(c.name)}>Escolher este</Button>}<Button size="sm" variant="ghost" onClick={() => { setCenterChoice(c.name); go('agendar'); }}>Agendar aqui</Button></div>
        </article>; })}</div>
      </section>

      : tab === 'historico' ? <section className="py-8">
        <h2 className="font-display text-2xl">Histórico de doações</h2>
        <p className="mb-6 mt-2 text-sm text-muted-foreground">Doações concluídas registradas pelo hemocentro.</p>
        <div className="mb-6 grid gap-4 sm:grid-cols-3">{[['Doações', String(demoHistory.length)], ['Vidas impactadas', `até ${demoHistory.length * 4}`], ['Última doação', new Date(`${demoHistory[0]!.date}T00:00`).toLocaleDateString('pt-BR')]].map(([l, v]) => <div key={l} className="rounded-lg border border-border p-5"><p className="text-xs text-muted-foreground">{l}</p><p className="mt-2 font-display text-2xl text-primary">{v}</p></div>)}</div>
        <div className="divide-y divide-border border-y border-border">{demoHistory.map(h => <div key={h.date} className="flex flex-wrap items-center justify-between gap-3 py-4"><div><p className="font-semibold">{h.center}</p><p className="text-sm text-muted-foreground">{h.type} · {h.volume}</p></div><p className="text-sm">{new Date(`${h.date}T00:00`).toLocaleDateString('pt-BR', { dateStyle: 'long' })}</p></div>)}</div>
        <p className="mt-3 font-mono text-[10px] text-muted-foreground">DADOS DE DEMONSTRAÇÃO</p>
      </section>

      : <section className="max-w-3xl py-8">
        <h2 className="font-display text-2xl">Documentos</h2>
        <p className="mb-6 mt-2 text-sm text-muted-foreground">Envie sua requisição de exame ou outros documentos pedidos pelo hemocentro.</p>
        <label onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); addDocs(e.dataTransfer.files); }} className="flex cursor-pointer flex-col items-center rounded-lg border-2 border-dashed border-input p-10 text-center hover:border-primary">
          <FileUp className="mb-3 size-8 text-primary" /><span className="font-medium">Arraste a requisição de exame ou clique para escolher</span><span className="mt-1 text-xs text-muted-foreground">PDF, JPG ou PNG · até 10 MB</span>
          <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" className="sr-only" onChange={e => { addDocs(e.target.files); e.target.value = ''; }} />
        </label>
        <div className="mt-6 divide-y divide-border">{docs.length ? docs.map(d => <div key={d.id} className="flex items-center gap-3 py-3"><FileText className="size-5 text-primary" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{d.name}</p><p className="text-xs text-muted-foreground">Requisição de exame · {d.size} · {d.date}</p></div><Button size="icon" variant="ghost" aria-label="Remover" onClick={() => setDocs(x => x.filter(y => y.id !== d.id))}><Trash2 /></Button></div>) : <p className="py-6 text-sm text-muted-foreground">Nenhum documento enviado.</p>}</div>
        <p className="mt-3 font-mono text-[10px] text-muted-foreground">OS ARQUIVOS AINDA NÃO FICAM GUARDADOS APÓS RECARREGAR A PÁGINA</p>
      </section>}
      <Link to="/" className="mt-8 inline-block text-xs text-muted-foreground hover:text-primary">Voltar para a página de doação</Link>
    </main>
  </div>;
}
