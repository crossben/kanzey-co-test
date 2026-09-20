import { PageShell } from '@/components/page-shell'
import { WalletList } from '@/components/wallet/wallet-list'

export const metadata = { title: 'Mes billets — Fodium' }

export default function MesBilletsPage() {
  return (
    <PageShell
      title="Mes billets"
      lead="Vos billets et vos navettes, prêts à être scannés. Conservés sur cet appareil, accessibles hors connexion."
    >
      <WalletList />
    </PageShell>
  )
}
