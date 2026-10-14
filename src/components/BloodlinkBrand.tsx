import { Link } from '@tanstack/react-router';
import { Droplet } from 'lucide-react';
export function BloodlinkBrand() {
  return <Link to="/" className="flex items-center gap-3" aria-label="Bloodlink — início"><span className="grid size-11 place-items-center rounded-full border border-border bg-card"><Droplet className="size-6 fill-primary text-primary" /></span><span className="font-display text-2xl">BLOODLINK</span></Link>;
}