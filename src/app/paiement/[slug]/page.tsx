import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { PaymentFlow } from '@/components/payment/payment-flow'
import { parseOrder, ticketReference } from '@/lib/order'
import { qrMatrix } from '@/lib/qr'
import { formatEventDate } from '@/lib/format'

export const metadata = { title: 'Paiement — Fodium' }

export default async function PaiementPage({
  params,
  searchParams,
}: PageProps<'/paiement/[slug]'>) {
  const { slug } = await params
  const query = await searchParams

  const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)
  const order = parseOrder(slug, {
    navette: first(query.navette),
    creneau: first(query.creneau),
  })
  if (!order) notFound()

  // Le QR est calculé ici, côté serveur : la librairie d'encodage ne part pas
  // dans le bundle client, seule la matrice de booléens est transmise.
  const reference = ticketReference(order)
  const qr = qrMatrix(reference)

  return (
    <main
      className="mx-auto w-full max-w-6xl px-5 pb-32 pt-6 lg:px-6 lg:pb-24 lg:pt-10"
      style={{ ['--event-accent' as string]: order.event.accent }}
    >
      <Link
        href={`/evenements/${order.event.slug}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Modifier ma commande
      </Link>

      <header className="mt-6 max-w-2xl">
        <h1 className="font-display text-[clamp(1.9rem,5vw,3rem)] font-semibold leading-[1.05] tracking-tight">
          Finaliser
        </h1>
        <p className="mt-3 text-muted-foreground">
          {order.event.title} · {formatEventDate(order.event.date)}
        </p>
      </header>

      <div className="mt-10 lg:mt-14">
        <PaymentFlow order={order} qr={qr} reference={reference} />
      </div>
    </main>
  )
}
