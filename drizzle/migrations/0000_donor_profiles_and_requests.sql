CREATE TABLE public.profiles (
 id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
 full_name text NOT NULL DEFAULT '',
 phone text NOT NULL DEFAULT '',
 birth_date date,
 city text NOT NULL DEFAULT '',
 blood_type text NOT NULL DEFAULT 'Não sei',
 weight_kg numeric,
 last_donation date,
 preferred_center text NOT NULL DEFAULT '',
 screening jsonb NOT NULL DEFAULT '{}'::jsonb,
 updated_at timestamptz NOT NULL DEFAULT now(),
 CONSTRAINT profile_weight CHECK (weight_kg IS NULL OR weight_kg BETWEEN 1 AND 500)
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read own donor profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Insert own donor profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Update own donor profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE FUNCTION public.create_donor_profile() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$ BEGIN INSERT INTO public.profiles (id, full_name) VALUES (NEW.id, left(COALESCE(NEW.raw_user_meta_data->>'full_name', ''), 150)) ON CONFLICT (id) DO NOTHING; RETURN NEW; END; $$;
CREATE TRIGGER create_donor_profile_on_signup AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.create_donor_profile();
CREATE TABLE public.donor_appointment_requests (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id uuid NOT NULL,
 center_name text NOT NULL,
 requested_at timestamptz NOT NULL,
 status text NOT NULL DEFAULT 'solicitado' CHECK (status IN ('solicitado','cancelado')),
 created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.donor_appointment_requests TO authenticated;
GRANT ALL ON public.donor_appointment_requests TO service_role;
ALTER TABLE public.donor_appointment_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read own appointment requests" ON public.donor_appointment_requests FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Insert own appointment requests" ON public.donor_appointment_requests FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND status = 'solicitado');
CREATE POLICY "Cancel own appointment requests" ON public.donor_appointment_requests FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id AND status = 'cancelado');
CREATE FUNCTION public.validate_donor_appointment_request() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$ BEGIN IF TG_OP = 'INSERT' THEN IF NEW.requested_at <= now() THEN RAISE EXCEPTION 'Escolha uma data e um horário futuros.'; END IF; IF length(trim(NEW.center_name)) < 3 OR length(NEW.center_name) > 200 THEN RAISE EXCEPTION 'Informe o nome do hemocentro.'; END IF; ELSIF NEW.user_id IS DISTINCT FROM OLD.user_id OR NEW.center_name IS DISTINCT FROM OLD.center_name OR NEW.requested_at IS DISTINCT FROM OLD.requested_at OR NEW.id IS DISTINCT FROM OLD.id OR NEW.created_at IS DISTINCT FROM OLD.created_at THEN RAISE EXCEPTION 'Somente o cancelamento é permitido.'; END IF; RETURN NEW; END; $$;
CREATE TRIGGER validate_donor_request BEFORE INSERT OR UPDATE ON public.donor_appointment_requests FOR EACH ROW EXECUTE FUNCTION public.validate_donor_appointment_request();