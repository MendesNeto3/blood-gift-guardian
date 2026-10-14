import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { screeningQuestions, type DonorFormData } from '@/lib/donor';

export const fieldClass = 'w-full min-w-0 rounded-md border border-input bg-card px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-ring/30';
export function extractDonorForm(form: HTMLFormElement): DonorFormData {
  const fields = new FormData(form);
  const text = (name: string) => String(fields.get(name) ?? '');
  return { full_name: text('full_name'), phone: text('phone'), birth_date: text('birth_date'), city: text('city'), blood_type: text('blood_type') as DonorFormData['blood_type'], weight_kg: Number(text('weight_kg')), last_donation: text('last_donation'), preferred_center: text('preferred_center'), screening: Object.fromEntries([...screeningQuestions.map(([key]) => [key, text(key)]), ['details', text('details')]]) };
}
export function DonorForm({ initial, onSubmit, busy, registration = false }: { initial?: Partial<DonorFormData>; onSubmit: (event: FormEvent<HTMLFormElement>) => void; busy: boolean; registration?: boolean }) {
  return <form onSubmit={onSubmit} className="space-y-8">
    <section><h2 className="mb-5 font-display text-xl">Seus dados</h2><div className="grid gap-4 sm:grid-cols-2">
      {([['full_name','Nome completo','text'],['phone','Telefone','tel'],['birth_date','Data de nascimento','date'],['city','Cidade / UF','text']] as const).map(([name,label,type]) => <label key={name} className="space-y-2 text-sm"><span className="block font-medium">{label}</span><input className={fieldClass} name={name} type={type} required defaultValue={initial?.[name]} maxLength={150} /></label>)}
      {registration && <><label className="space-y-2 text-sm"><span className="block font-medium">E-mail</span><input name="email" type="email" autoComplete="email" required className={fieldClass} /></label><label className="space-y-2 text-sm"><span className="block font-medium">Senha</span><input name="password" type="password" autoComplete="new-password" minLength={8} required className={fieldClass} /><span className="text-xs text-muted-foreground">Mínimo de 8 caracteres</span></label></>}
    </div></section>
    <section className="border-t border-border pt-7"><h2 className="mb-5 font-display text-xl">Ficha de pré-doação</h2><div className="grid gap-4 sm:grid-cols-2">
      <label className="space-y-2 text-sm"><span className="block font-medium">Tipo sanguíneo</span><select name="blood_type" className={fieldClass} defaultValue={initial?.blood_type ?? 'Não sei'}>{['Não sei','A+','A-','B+','B-','AB+','AB-','O+','O-'].map(v => <option key={v}>{v}</option>)}</select></label>
      <label className="space-y-2 text-sm"><span className="block font-medium">Peso (kg)</span><input name="weight_kg" type="number" min={1} max={500} step="0.1" required defaultValue={initial?.weight_kg} className={fieldClass} /></label>
      <label className="space-y-2 text-sm"><span className="block font-medium">Última doação (se houver)</span><input name="last_donation" type="date" defaultValue={initial?.last_donation} className={fieldClass} /></label>
      <label className="space-y-2 text-sm"><span className="block font-medium">Hemocentro de preferência</span><input name="preferred_center" maxLength={200} defaultValue={initial?.preferred_center} className={fieldClass} placeholder="Nome do hemocentro" /></label>
    </div><div className="mt-5 divide-y divide-border">{screeningQuestions.map(([key,label]) => <label key={key} className="grid gap-3 py-4 text-sm sm:grid-cols-[1fr_150px]"><span>{label}</span><select name={key} required defaultValue={initial?.screening?.[key] ?? ''} className={fieldClass}><option value="" disabled>Selecione</option><option>Sim</option><option>Não</option><option>Não sei / não se aplica</option></select></label>)}</div>
    <label className="mt-4 block space-y-2 text-sm"><span className="block font-medium">Medicamentos, condições de saúde e outras observações</span><textarea name="details" maxLength={2000} defaultValue={initial?.screening?.['details']} rows={3} className={fieldClass} /></label>
    <p className="mt-5 border-l-2 border-primary pl-4 text-sm leading-6 text-muted-foreground">Esta ficha não substitui a triagem clínica. A equipe do hemocentro confirma a aptidão, os intervalos e os requisitos para doar. Menores de 18 anos precisam de autorização; a primeira doação deve ocorrer antes dos 60 anos.</p></section>
    <label className="flex items-start gap-3 text-sm leading-6"><input type="checkbox" required className="mt-1 size-4 accent-primary" />Autorizo o armazenamento privado da minha ficha e declaro que as informações estão corretas.</label>
    <Button type="submit" disabled={busy} className="h-12 px-7">{busy ? 'Salvando…' : registration ? 'Criar minha conta de doador' : 'Salvar minha ficha'}</Button>
  </form>;
}