import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, type FormEvent } from 'react';
import { CalendarDays, LogOut, Heart, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BloodlinkBrand } from '@/components/BloodlinkBrand';
import { DonorForm, extractDonorForm, fieldClass } from '@/components/DonorForm';
import { readDonorArea, saveDonorProfile, type DonorFormData } from '@/lib/donor';
import { supabase } from '@/integrations/supabase/client';

export const Route = createFileRoute('/_authenticated/area-doador')({ head: () => ({ meta: [
  { title: 'Minha área de doador — Bloodlink' }, { name: 'description', content: 'Gerencie sua ficha, seu hemocentro e suas solicitações de doação.' },
  { property: 'og:title', content: 'Minha área de doador — Bloodlink' }, { property: 'og:description', content: 'Seu cuidado e seus horários em um só lugar.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' }, { name: 'robots', content: 'noindex' },
] }), component: DonorArea });
function DonorArea() {
  const query = useQuery({ queryKey: ['donor-area'], queryFn: readDonorArea });
  const client = useQueryClient(); const navigate = useNavigate();
  const [tab, setTab] = useState<'agenda'|'ficha'>('agenda'); const [busy, setBusy] = useState(false); const [message, setMessage] = useState('');
  async function signOut() { await client.cancelQueries(); client.clear(); await supabase.auth.signOut(); await navigate({ to: '/auth', replace: true }); }
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage('');
    try { await saveDonorProfile(extractDonorForm(event.currentTarget)); await query.refetch(); setMessage('Sua ficha foi salva.'); } catch { setMessage('Confira os dados da ficha e tente novamente.'); } finally { setBusy(false); }
  }
  async function schedule(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!query.data) return;
    const form = event.currentTarget; const fields = new FormData(form); const center = String(fields.get('center')).trim();
    const requestedAt = new Date(`${fields.get('date')}T${fields.get('time')}`);
    if (!Number.isFinite(requestedAt.getTime()) || requestedAt <= new Date()) { setMessage('Escolha uma data e um horário futuros.'); return; }
    setBusy(true); setMessage('');
    const { error } = await supabase.from('donor_appointment_requests').insert({ user_id: query.data.user.id, center_name: center, requested_at: requestedAt.toISOString() });
    if (error) setMessage('Não foi possível solicitar este horário. Tente novamente.');
    else { form.reset(); await query.refetch(); setMessage('Solicitação salva. Aguarde a confirmação diretamente com o hemocentro.'); }
    setBusy(false);
  }
  async function cancel(id: string) {
    if (!query.data) return; setBusy(true);
    const { error } = await supabase.from('donor_appointment_requests').update({ status: 'cancelado' }).eq('id', id).eq('user_id', query.data.user.id);
    setMessage(error ? 'Não foi possível cancelar. Tente novamente.' : 'Solicitação cancelada.'); await query.refetch(); setBusy(false);
  }
  const p = query.data?.profile;
  const initial: Partial<DonorFormData> = p ? { full_name: p.full_name, phone: p.phone, birth_date: p.birth_date ?? '', city: p.city, blood_type: p.blood_type as DonorFormData['blood_type'], ...(p.weight_kg === null ? {} : { weight_kg: p.weight_kg }), last_donation: p.last_donation ?? '', preferred_center: p.preferred_center, screening: p.screening as Record<string,string> } : { full_name: query.data?.user.user_metadata?.['full_name'] ?? '' };
  return <div className="min-h-screen bg-card"><header className="border-b border-border"><div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-6"><BloodlinkBrand /><Button variant="ghost" onClick={signOut}><LogOut /> Sair</Button></div></header>
    <main className="mx-auto max-w-5xl px-6 py-10"><p className="font-mono text-xs text-primary">MINHA ÁREA DE DOADOR</p><h1 className="mt-3 font-display text-3xl">Olá{p?.full_name ? `, ${p.full_name.split(' ')[0]}` : ''}.</h1>
      <div className="mt-6 flex flex-wrap gap-2 border-b border-border pb-4"><Button variant={tab === 'agenda' ? 'default' : 'ghost'} onClick={() => { setTab('agenda'); setMessage(''); }}><CalendarDays />Meus agendamentos</Button><Button variant={tab === 'ficha' ? 'default' : 'ghost'} onClick={() => { setTab('ficha'); setMessage(''); }}><Heart />Minha ficha e hemocentro</Button></div>
      {message && <p role="status" className="my-5 rounded-md bg-accent p-4 text-sm leading-6 text-accent-foreground">{message}</p>}
      {query.isPending ? <p role="status" className="py-12">Carregando sua área…</p> : query.isError ? <div className="py-12"><p role="alert">Não foi possível carregar sua área.</p><Button className="mt-4" onClick={() => query.refetch()}>Tentar novamente</Button></div> : tab === 'ficha' ? <div className="max-w-3xl py-8"><DonorForm key={p?.updated_at ?? 'new'} initial={initial} busy={busy} onSubmit={save} /></div> : <div className="grid gap-12 py-8 lg:grid-cols-[1fr_1.1fr]">
        <section><h2 className="font-display text-2xl">Sua próxima doação</h2><p className="mb-6 mt-3 text-sm leading-6 text-muted-foreground">Solicite uma data de sua preferência. O horário não está confirmado: disponibilidade e atendimento devem ser combinados com o hemocentro.</p>
          {!p?.birth_date && <p className="mb-5 border-l-2 border-primary pl-3 text-sm text-primary">Preencha sua ficha antes de solicitar um horário.</p>}
          <form onSubmit={schedule} className="space-y-4"><label className="block space-y-2 text-sm"><span className="flex items-center gap-2 font-medium"><MapPin className="size-4" />Hemocentro</span><input key={p?.preferred_center} name="center" required minLength={3} maxLength={200} defaultValue={p?.preferred_center} placeholder="Nome do hemocentro" className={fieldClass} /></label><div className="grid grid-cols-2 gap-4"><label className="block space-y-2 text-sm"><span>Data desejada</span><input name="date" type="date" required className={fieldClass} /></label><label className="block space-y-2 text-sm"><span>Horário desejado</span><input name="time" type="time" required className={fieldClass} /></label></div><Button disabled={busy || !p?.birth_date} type="submit" className="h-12 w-full">{busy ? 'Aguarde…' : 'Solicitar horário'}</Button></form>
          <Button variant="link" className="mt-4 px-0" onClick={() => setTab('ficha')}>Atualizar ficha e hemocentro</Button>
        </section><section><h2 className="font-display text-2xl">Minhas solicitações</h2><div className="mt-6 divide-y divide-border">{query.data?.appointments.length ? query.data.appointments.map(a => <article key={a.id} className="py-5"><div className="flex items-start justify-between gap-3"><h3 className="font-semibold">{a.center_name}</h3><span className="rounded-md bg-accent px-2 py-1 text-xs text-accent-foreground">{a.status === 'cancelado' ? 'Cancelado' : 'Aguardando confirmação'}</span></div><p className="mt-2 text-sm text-muted-foreground">{new Date(a.requested_at).toLocaleString('pt-BR', { dateStyle: 'medium', timeStyle: 'short' })}</p>{a.status !== 'cancelado' && <Button disabled={busy} onClick={() => cancel(a.id)} variant="link" className="mt-2 px-0">Cancelar solicitação</Button>}</article>) : <div className="border-t border-border py-8"><CalendarDays className="mb-3 size-8 text-muted-foreground" /><p className="text-sm text-muted-foreground">Você ainda não solicitou um horário.</p></div>}</div></section>
      </div>}
      <Link to="/" className="mt-8 inline-block text-xs text-muted-foreground hover:text-primary">Voltar para a página de doação</Link>
    </main></div>;
}