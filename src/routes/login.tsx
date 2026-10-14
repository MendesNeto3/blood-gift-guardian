import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { ArrowRight, Heart, Eye, EyeOff } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { BloodlinkBrand } from '@/components/BloodlinkBrand';
import { fieldClass } from '@/components/DonorForm';
import { supabase } from '@/integrations/supabase/client';
import { authService } from '@/lib/api/services';
import { isServiceEnabled, setToken } from '@/lib/api/config';
import hero from '@/assets/donation-hero.jpg';

export const Route = createFileRoute('/login')({ head: () => ({ meta: [
  { title: 'Entrar na sua conta — Bloodlink' }, { name: 'description', content: 'Acesse sua área de doador ou seu hemocentro no Bloodlink.' },
  { property: 'og:title', content: 'Entrar na sua conta — Bloodlink' }, { property: 'og:description', content: 'Um acesso para continuar conectando vidas.' },
  { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' }, { name: 'robots', content: 'noindex' },
] }), component: LoginPage });
function LoginPage() {
  const [audience, setAudience] = useState<'doador'|'hemocentro'>('doador');
  const [recovery, setRecovery] = useState(false);
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage('');
    const fields = new FormData(event.currentTarget);
    const email = String(fields.get('email')); const password = String(fields.get('password') ?? '');
    try {
      if (recovery) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
        if (error) throw error;
        setMessage('Se houver uma conta com este e-mail, você receberá um link para redefinir a senha.');
      } else if (audience === 'hemocentro') {
        if (!isServiceEnabled('auth')) throw new Error('O acesso institucional ainda aguarda a conexão com o serviço do seu hemocentro.');
        const session = await authService.login(email, password); setToken(session.token); await navigate({ to: '/painel' });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw new Error('Confira seu e-mail e senha e confirme seu cadastro pelo e-mail recebido.');
        await navigate({ to: '/area-doador' });
      }
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Não foi possível entrar. Tente novamente.'); }
    finally { setBusy(false); }
  }
  return <div className="min-h-screen bg-card text-foreground lg:grid lg:grid-cols-2">
    <div className="flex min-h-screen flex-col px-6 py-7 sm:px-12 lg:px-14">
      <nav className="flex flex-wrap items-center justify-between gap-4"><Button asChild variant="link" className="px-0"><Link to="/cadastro-doador">Quero ser um doador <ArrowRight /></Link></Button><Link to="/" className="text-xs text-muted-foreground hover:text-primary">Voltar ao início</Link></nav>
      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-14">
        <BloodlinkBrand />
        <h1 className="mt-10 font-display text-3xl">Bom ter você aqui.</h1><p className="mt-3 text-sm text-muted-foreground">Entre na sua conta para continuar.</p>
        <div className="mb-7 mt-8 grid grid-cols-2 border-b border-border" role="tablist" aria-label="Tipo de acesso">{(['doador','hemocentro'] as const).map(item => <Button key={item} role="tab" aria-selected={audience === item} variant="ghost" onClick={() => { setAudience(item); setRecovery(false); setMessage(''); }} className={`h-12 rounded-none border-b-2 ${audience === item ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}>{item === 'doador' ? 'Sou doador' : 'Sou hemocentro'}</Button>)}</div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block space-y-2 text-sm"><span className="font-medium">E-mail</span><input name="email" type="email" autoComplete="email" required placeholder="Seu e-mail" className={fieldClass} /></label>
          {!recovery && <label className="block space-y-2 text-sm"><span className="font-medium">Senha</span><div className="relative"><input name="password" type={visible ? 'text' : 'password'} autoComplete="current-password" required placeholder="Sua senha" className={`${fieldClass} pr-12`} /><Button type="button" size="icon" variant="ghost" aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'} title={visible ? 'Ocultar senha' : 'Mostrar senha'} onClick={() => setVisible(!visible)} className="absolute right-1 top-1">{visible ? <EyeOff /> : <Eye />}</Button></div></label>}
          {audience === 'doador' && <div className="text-right"><Button type="button" variant="link" className="h-auto px-0 text-xs" onClick={() => { setRecovery(!recovery); setMessage(''); }}>{recovery ? 'Voltar para entrar' : 'Esqueci minha senha'}</Button></div>}
          {message && <p role="status" className="rounded-md bg-accent p-3 text-sm leading-6 text-accent-foreground">{message}</p>}
          <Button type="submit" disabled={busy} className="h-12 w-full">{busy ? 'Aguarde…' : recovery ? 'Enviar link de recuperação' : 'Entrar'}<ArrowRight /></Button>
        </form>
        <p className="mt-7 text-center text-sm text-muted-foreground">Ainda não tem uma conta? <Link to="/cadastro-doador" className="font-semibold text-primary hover:underline">Seja um doador</Link></p>
      </div><p className="text-xs text-muted-foreground">BLOODLINK · Conectando vidas</p>
    </div>
    <aside className="flex min-h-[420px] flex-col bg-background lg:min-h-screen"><img src={hero} alt="Doador acompanhado por uma profissional durante a doação de sangue" className="min-h-0 w-full flex-1 object-cover object-center lg:max-h-[70vh]" /><div className="px-8 py-9 lg:px-12"><Heart className="mb-4 size-7 text-primary" /><h2 className="font-display text-3xl text-primary">Uma doação.<br />Novas histórias.</h2><p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">O seu gesto de cuidado pode fazer toda a diferença para quem espera por uma transfusão.</p><p className="mt-5 font-mono text-[9px] text-muted-foreground">IMAGEM ILUSTRATIVA GERADA POR IA</p></div></aside>
  </div>;
}
