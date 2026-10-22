import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';

export const donorSchema = z.object({
  full_name: z.string().trim().min(3).max(150), phone: z.string().trim().min(8).max(30),
  birth_date: z.string().min(1).refine(v => !Number.isNaN(Date.parse(v)) && new Date(v) < new Date(), 'Informe uma data de nascimento válida.'),
  city: z.string().trim().min(2).max(100), blood_type: z.enum(['Não sei','A+','A-','B+','B-','AB+','AB-','O+','O-']),
  weight_kg: z.coerce.number().min(1).max(500), last_donation: z.string(), preferred_center: z.string().trim().max(200),
  screening: z.record(z.string().max(2000)),
});
export type DonorFormData = z.infer<typeof donorSchema>;
export const screeningQuestions = [
  ['health', 'Está bem de saúde, sem febre ou sinais de infecção?'],
  ['rest', 'Dormiu pelo menos 6 horas na última noite?'],
  ['food', 'Está alimentado e hidratado?'],
  ['alcohol', 'Consumiu bebida alcoólica nas últimas 12 horas?'],
  ['procedure', 'Fez tatuagem, piercing, cirurgia ou procedimento recente?'],
  ['pregnancy', 'Está gestante ou amamentando?'],
  ['illness', 'Tem alguma doença, infecção ou condição de saúde relevante?'],
  ['medication', 'Usa medicamentos ou recebeu alguma vacina recentemente?'],
] as const;
export async function readDonorArea() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error('Entre novamente para acessar sua ficha.');
  const [profile, appointments] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
    supabase.from('donor_appointment_requests').select('*').eq('user_id', user.id).order('requested_at'),
  ]);
  if (profile.error || appointments.error) throw new Error('Não foi possível carregar seus dados. Tente novamente.');
  return { user, profile: profile.data, appointments: appointments.data ?? [] };
}
export async function saveDonorProfile(input: DonorFormData) {
  const data = donorSchema.parse(input);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Entre novamente para salvar sua ficha.');
  const { error } = await supabase.from('profiles').upsert({ ...data, last_donation: data.last_donation || null, id: user.id, updated_at: new Date().toISOString() });
  if (error) throw new Error('Não foi possível salvar sua ficha. Tente novamente.');
}