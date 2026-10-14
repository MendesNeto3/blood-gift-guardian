import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useState, type FormEvent } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BloodlinkBrand } from '@/components/BloodlinkBrand';
import { DonorForm, extractDonorForm } from '@/components/DonorForm';
import { donorSchema } from '@/lib/donor';
import { Button } from '@/components/ui/button';
export const Route = createFileRoute('/cadastro-doador')({ head: () => ({ meta: [
  { title: 'Quero ser um doador — Bloodlink' }, { name: 'description', content: 'Crie sua conta de doador e preencha sua ficha privada de pré-doação.' },
  { property: 'og:title', content: 'Quero ser um doador — Bloodlink' }, { property: 'og:description', content: 'Faça parte da corrente de cuidado do Bloodlink.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' },
] }), component: SignupPage });
function SignupPage() {
  const [busy, setBusy] = useState(false); const [message, setMessage] = useState(''); const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = event.currentTarget; const fields = new FormData(form);
    setBusy(true); setMessage('');
    try {
      const profile = donorSchema.parse(extractDonorForm(form));
      const { data: { user: signedIn } } = await supabase.auth.getUser();
      if (signedIn) { await navigate({ to: '/area-doador' }); return; }
      const { data, error } = await supabase.auth.signUp({ email: String(fields.get('email')), password: String(fields.get('password')), options: { emailRedirectTo: `${window.location.origin}/login`, data: { full_name: profile.full_name } } });
      if (error) throw new Error('Não foi possível criar sua conta. Confira os dados ou tente entrar se já possui cadastro.');
      if (data.session) {
        const { saveDonorProfile } = await import('@/lib/donor'); await saveDonorProfile(profile); await navigate({ to: '/area-doador' });
      } else {
        // Health answers are intentionally not persisted before identity confirmation.
        setSuccess(true);
      }
    } catch (error) { setMessage(error instanceof Error && error.name !== 'ZodError' ? error.message : 'Confira os dados, a data de nascimento e o peso informado.'); }
    finally { setBusy(false); }
  }
  return <div className="min-h-screen bg-card"><header className="border-b border-border"><div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-4 px-6 py-6"><BloodlinkBrand /><Button variant="outline" asChild><Link to="/login">Já tenho conta</Link></Button></div></header><main className="mx-auto max-w-3xl px-6 py-12"><p className="font-mono text-xs text-primary">QUERO SER UM DOADOR</p><h1 className="mt-3 font-display text-4xl">O cuidado começa com você.</h1><p className="mb-9 mt-4 text-sm leading-7 text-muted-foreground">Crie sua conta e prepare sua ficha. As respostas de saúde serão salvas somente após você confirmar seu e-mail e entrar; será necessário preenchê-las novamente na sua área.</p>
    {message && <p role="alert" className="mb-6 rounded-md bg-accent p-4 text-sm text-primary">{message}</p>}
    {success ? <div role="status" className="border-t border-border py-8"><h2 className="font-display text-2xl">Confira seu e-mail</h2><p className="mt-4 text-sm leading-7 text-muted-foreground">Enviamos um link para confirmar seu cadastro. Depois de confirmar, entre na sua conta para salvar sua ficha de saúde com segurança.</p><Button asChild className="mt-6"><Link to="/login">Ir para o login</Link></Button></div> : <DonorForm registration busy={busy} onSubmit={submit} />}
  </main></div>;
}
