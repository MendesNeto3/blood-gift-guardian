import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState, type FormEvent } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { BloodlinkBrand } from '@/components/BloodlinkBrand';
import { fieldClass } from '@/components/DonorForm';
export const Route = createFileRoute('/reset-password')({ head: () => ({ meta: [
  { title: 'Redefinir senha — Bloodlink' }, { name: 'description', content: 'Defina uma nova senha para sua conta Bloodlink.' }, { property: 'og:title', content: 'Redefinir senha — Bloodlink' }, { property: 'og:description', content: 'Recupere o acesso à sua conta.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' }, { name: 'robots', content: 'noindex' },
] }), component: ResetPage });
function ResetPage() {
  const [valid, setValid] = useState(false); const [message, setMessage] = useState(''); const [busy, setBusy] = useState(false);
  useEffect(() => { const recovery = new URLSearchParams(window.location.hash.slice(1)).get('type') === 'recovery'; if (recovery) supabase.auth.getUser().then(({ data }) => setValid(Boolean(data.user))); }, []);
  async function submit(e: FormEvent<HTMLFormElement>) { e.preventDefault(); setBusy(true); const fields = new FormData(e.currentTarget); const password = String(fields.get('password')); if (password !== fields.get('confirm')) { setMessage('As senhas precisam ser iguais.'); setBusy(false); return; } const { error } = await supabase.auth.updateUser({ password }); setMessage(error ? 'Link inválido ou expirado. Solicite um novo link no login.' : 'Senha atualizada. Você já pode entrar na sua conta.'); setBusy(false); }
  return <main className="mx-auto min-h-screen max-w-md px-6 py-16"><BloodlinkBrand /><h1 className="mb-6 mt-10 font-display text-3xl">Nova senha</h1>{valid ? <form onSubmit={submit} className="space-y-4"><label className="block">Nova senha<input className={fieldClass} name="password" type="password" autoComplete="new-password" minLength={8} required /></label><label className="block">Confirmar senha<input className={fieldClass} name="confirm" type="password" autoComplete="new-password" minLength={8} required /></label><Button disabled={busy} type="submit">{busy ? 'Salvando…' : 'Salvar nova senha'}</Button></form> : <p className="text-sm text-muted-foreground">Abra esta página pelo link de recuperação enviado ao seu e-mail.</p>}{message && <p role="status" className="mt-5 text-sm">{message}</p>}<Button asChild variant="link" className="mt-6 px-0"><Link to="/login">Voltar ao login</Link></Button></main>;
}
