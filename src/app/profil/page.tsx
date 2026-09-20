import { PageShell } from '@/components/page-shell'
import { ProfilePanel } from '@/components/profile/profile-panel'

export const metadata = { title: 'Profil — Fodium' }

export default function ProfilPage() {
  return (
    <PageShell title="Profil" lead="Vos billets, vos habitudes de trajet et vos préférences d'affichage.">
      <ProfilePanel />
    </PageShell>
  )
}
