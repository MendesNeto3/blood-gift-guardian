import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Droplet, Heart, ShieldCheck, ClipboardCheck, Coffee, GlassWater, IdCard, Users, Scale, HeartPulse, Moon, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import hero from "@/assets/donation-hero.jpg";
import care from "@/assets/donation-care.jpg";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Doação de sangue — Bloodlink" },
    { name: "description", content: "Conheça a importância de doar sangue, prepare-se para a doação e acesse o seu hemocentro no Bloodlink." },
    { property: "og:title", content: "Doação de sangue — Bloodlink" },
    { property: "og:description", content: "Um gesto de cuidado que conecta vidas. Orientações sobre doação de sangue e acesso ao hemocentro." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: DonationPage,
});

function DonationPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-5 md:px-10">
          <Link to="/" aria-label="Bloodlink — início" className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-full border border-border bg-card"><Droplet className="size-6 fill-primary text-primary" /></span>
            <span className="font-display text-2xl">BLOODLINK<span className="mt-0.5 block font-mono text-[9px] text-muted-foreground">CONECTANDO VIDAS</span></span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden text-right text-xs text-muted-foreground sm:block">Área do hemocentro<br /><span className="font-medium text-foreground">Acesse sua instituição</span></span>
            <Button asChild className="h-11 px-5"><Link to="/login">Entre aqui <ArrowRight /></Link></Button>
          </div>
        </div>
      </header>

      <main>
        <section className="donation-hero relative isolate overflow-hidden">
          <img src={hero} alt="Doador sendo acompanhado por uma profissional de saúde durante uma doação de sangue" width={1536} height={1024} fetchPriority="high" className="absolute inset-0 -z-20 size-full object-cover object-right" />
          <div className="donation-hero-shade absolute inset-0 -z-10" />
          <div className="mx-auto flex h-full max-w-7xl items-center px-5 py-12 md:px-10">
            <div className="max-w-md">
              <p className="mb-5 flex items-center gap-2 font-mono text-xs text-primary"><span className="size-2 rounded-full bg-primary" /> UM GESTO QUE CONECTA VIDAS</p>
              <h1 className="font-display text-5xl leading-[1.12] text-primary md:text-6xl">Doação de sangue</h1>
              <p className="mt-5 text-xl font-semibold">O seu cuidado pode mudar uma história.</p>
              <p className="mt-4 max-w-sm text-sm leading-7">Para quem precisa de uma transfusão, cada doação importa. Faça parte dessa corrente de solidariedade.</p>
              <Button asChild className="mt-7 h-12 px-6"><Link to="/encontrar">Encontre um hemocentro <ArrowRight /></Link></Button>
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-card">
          <div className="mx-auto grid max-w-7xl gap-7 px-5 py-8 md:grid-cols-3 md:px-10">
            {[
              { icon: Heart, title: "Vidas que continuam", text: "Doações ajudam pessoas em cirurgias, emergências e tratamentos de saúde." },
              { icon: Droplet, title: "Cada tipo importa", text: "Todos os tipos sanguíneos são necessários para manter os estoques dos hemocentros." },
              { icon: ShieldCheck, title: "Cuidado em cada etapa", text: "A equipe de saúde acompanha você, da triagem até o final da doação." },
            ].map(({ icon: Icon, title, text }) => <div key={title} className="flex items-start gap-4"><Icon className="mt-1 size-6 shrink-0 text-primary" /><div><h2 className="text-sm font-semibold">{title}</h2><p className="mt-2 text-xs leading-6 text-muted-foreground">{text}</p></div></div>)}
          </div>
        </section>

        <section className="border-b border-border bg-card">
          <div className="mx-auto max-w-7xl px-5 py-14 md:px-10">
            <p className="font-mono text-xs text-primary">QUEM PODE DOAR</p>
            <h2 className="mt-3 font-display text-3xl">Confira se você pode fazer parte</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">Para doar, basta estar saudável e atender aos requisitos básicos abaixo. A confirmação final é feita pela equipe de saúde na triagem clínica.</p>
            <div className="mt-9 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: Users, title: "Idade de 16 a 69 anos", text: "Menores de 18 anos precisam de autorização e da presença do responsável legal." },
                { icon: Scale, title: "A partir de 50 kg", text: "O peso mínimo ajuda a garantir que a doação seja segura para você." },
                { icon: HeartPulse, title: "Estar bem de saúde", text: "Sem febre, feridas abertas ou sintomas de infecção no dia da doação." },
                { icon: Moon, title: "Ter descansado", text: "Dormir pelo menos 6 horas na noite anterior e evitar esforço físico intenso." },
              ].map(({ icon: Icon, title, text }) => <div key={title} className="border-t border-border pt-5"><Icon className="mb-4 size-7 text-primary" /><h3 className="font-semibold">{title}</h3><p className="mt-3 text-sm leading-7 text-muted-foreground">{text}</p></div>)}
            </div>
            <div className="mt-10 grid gap-7 md:grid-cols-2">
              <div className="rounded-lg border border-border p-6">
                <p className="flex items-center gap-2 font-semibold"><Ban className="size-5 text-primary" /> Impedimentos temporários</p>
                <ul className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground">
                  <li>· Gripe, febre ou infecção recente.</li>
                  <li>· Tatuagem, piercing ou procedimento estético nos últimos meses.</li>
                  <li>· Gestação ou amamentação.</li>
                  <li>· Doação recente: o intervalo é orientado pelo hemocentro.</li>
                </ul>
              </div>
              <div className="rounded-lg border border-border p-6">
                <p className="flex items-center gap-2 font-semibold"><ClipboardCheck className="size-5 text-primary" /> Na dúvida, fale com o hemocentro</p>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">Cada hemocentro confirma documentos, horários e condições específicas, inclusive para quem toma medicamentos ou tem histórico de saúde.</p>
                <Button asChild variant="outline" className="mt-5 h-11 px-5"><Link to="/encontrar">Ver hemocentros próximos <ArrowRight /></Link></Button>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 md:grid-cols-2 md:px-10 md:py-20">
          <div className="relative">
            <img src={care} alt="Doadora e profissional de saúde em uma sala de coleta" width={1024} height={1024} loading="lazy" className="aspect-[6/5] w-full rounded-lg object-cover" />
            <p className="mt-3 font-mono text-[9px] text-muted-foreground">IMAGENS ILUSTRATIVAS GERADAS POR IA</p>
          </div>
          <div>
            <p className="font-mono text-xs text-primary">POR QUE DOAR?</p>
            <h2 className="mt-3 font-display text-3xl leading-tight md:text-4xl">Sangue não se fabrica.<br />Solidariedade se compartilha.</h2>
            <p className="mt-6 text-sm leading-7 text-muted-foreground">Os hemocentros dependem de doações voluntárias para atender quem precisa. Pessoas em tratamento de câncer, pacientes com doenças do sangue e vítimas de acidentes podem necessitar de transfusões.</p>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">Doar regularmente, respeitando os intervalos e a orientação da equipe de saúde, ajuda a manter essa rede de cuidado disponível.</p>
            <div className="mt-6 border-l-2 border-primary pl-4 text-sm font-medium text-primary">Uma atitude sua. Uma nova chance para alguém.</div>
          </div>
        </section>

        <section className="border-y border-border bg-card">
          <div className="mx-auto max-w-7xl px-5 py-14 md:px-10">
            <p className="font-mono text-xs text-primary">ANTES DE DOAR</p>
            <h2 className="mt-3 font-display text-3xl">Prepare-se para esse gesto</h2>
            <div className="mt-8 grid gap-7 sm:grid-cols-3">
              {[
                { icon: Coffee, title: "Alimente-se bem", text: "Não vá em jejum. Prefira alimentos leves e evite alimentos gordurosos antes da doação." },
                { icon: GlassWater, title: "Hidrate-se", text: "Beba água e cuide do seu descanso antes de ir ao hemocentro." },
                { icon: IdCard, title: "Leve seu documento", text: "Apresente um documento oficial com foto. Confirme com o hemocentro os requisitos para menores de idade." },
              ].map(({ icon: Icon, title, text }) => <div key={title} className="border-t border-border pt-5"><Icon className="mb-4 size-7 text-primary" /><h3 className="font-semibold">{title}</h3><p className="mt-3 text-sm leading-7 text-muted-foreground">{text}</p></div>)}
            </div>
            <p className="mt-8 text-xs leading-6 text-muted-foreground">As condições para doar e os impedimentos temporários devem ser confirmados com o hemocentro. A elegibilidade é avaliada na triagem clínica.</p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-14 md:px-10">
          <p className="font-mono text-xs text-primary">ETAPAS DA DOAÇÃO</p>
          <h2 className="mt-3 font-display text-3xl">Você não está sozinho nesse caminho</h2>
          <div className="mt-9 grid gap-8 md:grid-cols-3">
            {[
              { title: "Recepção e cadastro", text: "A equipe confere seus documentos e registra as informações necessárias para a doação." },
              { title: "Triagem clínica", text: "Uma entrevista individual e confidencial avalia suas condições de saúde para proteger você e quem receberá o sangue." },
              { title: "Coleta e recuperação", text: "A coleta utiliza material estéril e descartável. Ao finalizar, siga as orientações da equipe sobre repouso, hidratação e alimentação." },
            ].map((step, index) => <div key={step.title}><span className="font-display text-4xl text-primary/40">0{index + 1}</span><h3 className="mt-4 font-semibold">{step.title}</h3><p className="mt-3 text-sm leading-7 text-muted-foreground">{step.text}</p></div>)}
          </div>
        </section>

        <section className="bg-primary text-primary-foreground">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-5 py-10 md:px-10">
            <div><p className="mb-2 flex items-center gap-2 text-xs"><ClipboardCheck className="size-4" /> ÁREA DO HEMOCENTRO</p><h2 className="font-display text-3xl">Sua instituição faz parte dessa conexão.</h2><p className="mt-3 text-sm text-primary-foreground/80">Entre no Bloodlink para acessar a gestão do seu hemocentro.</p></div>
            <Button asChild variant="outline" className="h-12 border-primary-foreground/30 bg-card px-6 text-primary"><Link to="/login">Entre aqui <ArrowRight /></Link></Button>
          </div>
        </section>
      </main>
      <footer className="mx-auto flex max-w-7xl flex-wrap justify-between gap-3 px-5 py-7 text-xs text-muted-foreground md:px-10"><span className="font-display text-lg text-primary">BLOODLINK</span><span>Conectando doadores, hemocentros e vidas.</span></footer>
    </div>
  );
}