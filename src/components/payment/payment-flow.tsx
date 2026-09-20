'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'motion/react'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { Ticket } from '@/components/ticket/ticket'
import { QrCode } from '@/components/ticket/qr-code'
import { PaymentMethods } from './payment-methods'
import { HoldToPay } from './hold-to-pay'
import { getPaymentMethod } from '@/lib/data/payment-methods'
import { formatXOF } from '@/lib/format'
import type { QrMatrix } from '@/lib/qr'
import type { ParsedOrder } from '@/lib/order'
import { addToWallet } from '@/lib/wallet'
import type { PaymentMethod } from '@/lib/types'

/**
 * Parcours de paiement en une seule interaction continue (brief §3.4).
 *
 * Aucun enchaînement d'écrans : le billet, le moyen de paiement et la
 * validation coexistent sur une même surface. Le billet reste visible du
 * début à la fin — on voit ce qu'on achète pendant qu'on paie, ce que le
 * parcours classique perd dès la redirection vers l'opérateur.
 *
 * La confirmation n'est pas un message : c'est le billet lui-même qui devient
 * valide, sa souche de validation se détachant avec le QR. Une preuve
 * tangible plutôt qu'un « ✓ Paiement réussi ».
 */
export function PaymentFlow({
  order,
  qr,
  reference,
}: {
  order: ParsedOrder
  qr: QrMatrix
  reference: string
}) {
  const [method, setMethod] = useState<PaymentMethod | undefined>()
  const [paid, setPaid] = useState(false)
  const reduced = usePrefersReducedMotion()

  const { event, departure, slot, total } = order
  const info = method ? getPaymentMethod(method) : undefined

  /**
   * Le billet est déposé dans le portefeuille au moment de la validation.
   *
   * Dans un gestionnaire d'événement, pas dans un effet : l'achat est une
   * action de l'utilisateur, pas une conséquence d'un rendu.
   */
  const confirmPayment = () => {
    if (!method) return
    addToWallet({
      ref: reference,
      slug: event.slug,
      departureId: departure?.id,
      slot,
      method,
      purchasedAt: new Date().toISOString(),
    })
    setPaid(true)
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)] lg:gap-16">
      <div className="lg:sticky lg:top-24 lg:self-start">
        <motion.div
          animate={paid && !reduced ? { scale: [1, 1.015, 1] } : undefined}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <Ticket
            event={event}
            variant="full"
            priority
            morphName={`ticket-${event.id}`}
            total={total}
            shuttle={
              departure && slot ? { district: departure.district, time: slot } : undefined
            }
            footer={
              paid ? (
                <motion.div
                  initial={reduced ? false : { opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-center gap-4"
                >
                  <div className="shrink-0 rounded-lg bg-white p-1.5">
                    <QrCode matrix={qr} animate className="size-20" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Billet validé
                    </p>
                    <p className="mt-0.5 break-all font-mono text-xs">{reference}</p>
                    {info && (
                      <p className="mt-1.5 text-xs text-muted-foreground">
                        Payé avec {info.label}
                      </p>
                    )}
                  </div>
                </motion.div>
              ) : undefined
            }
          />
        </motion.div>
      </div>

      <div className="space-y-9">
        <AnimatePresence mode="wait" initial={false}>
          {paid ? (
            <motion.div
              key="done"
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-5"
            >
              <div className="flex items-start gap-3 rounded-2xl border border-border bg-surface p-5">
                <ShieldCheck className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />
                <div>
                  <h2 className="font-display text-xl leading-tight">
                    Votre billet est prêt
                  </h2>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    Présentez le QR à l&apos;entrée
                    {departure && ' et à la montée dans la navette'}. Il est
                    déjà enregistré dans vos billets, hors connexion.
                  </p>
                </div>
              </div>

              <Link
                href="/mes-billets"
                className="group inline-flex items-center gap-2 text-sm text-brand-text"
              >
                Voir mes billets
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="pay"
              initial={false}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
              className="space-y-9"
            >
              <PaymentMethods selected={method} onSelect={setMethod} />

              <div className="rounded-2xl border border-border bg-surface p-6">
                <HoldToPay
                  amount={formatXOF(total)}
                  disabled={!method}
                  onComplete={confirmPayment}
                />
                {!method && (
                  <p className="mt-4 text-center text-sm text-muted-foreground">
                    Choisissez d&apos;abord un moyen de paiement.
                  </p>
                )}
              </div>

              <p className="text-center text-xs text-muted-foreground">
                Prototype : aucun paiement réel n&apos;est effectué.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
