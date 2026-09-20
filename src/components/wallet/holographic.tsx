'use client'

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

type OrientationPermission = {
  requestPermission?: () => Promise<'granted' | 'denied'>
}

/** La capacité matérielle ne change pas en cours de session : rien à écouter. */
const noSubscribe = () => () => {}

/**
 * L'appareil peut-il, et doit-il, demander l'autorisation d'inclinaison ?
 *
 * La présence de l'API ne suffit pas : certains navigateurs de bureau
 * l'exposent sans capteur, et le bouton proposerait alors d'activer quelque
 * chose d'inopérant. On exige aussi un pointeur grossier — un appareil tenu
 * en main.
 *
 * Lu par `useSyncExternalStore` plutôt que par un effet : c'est une propriété
 * de l'environnement, pas un état applicatif, et cela évite le rendu en
 * cascade que le compilateur React signale.
 */
function tiltPermissionSnapshot(): boolean {
  const api = window.DeviceOrientationEvent as unknown as OrientationPermission | undefined
  const handheld = window.matchMedia('(pointer: coarse)').matches
  return Boolean(handheld && api && typeof api.requestPermission === 'function')
}

/**
 * Enveloppe holographique du billet en portefeuille.
 *
 * Feuille irisée qui réagit à l'inclinaison de l'appareil, ou au pointeur sur
 * desktop. C'est ce qui donne au billet acheté le statut d'objet possédé
 * plutôt que de page consultée.
 *
 * Pourquoi pas WebGL : Three.js pèse environ 600 ko pour un reflet que des
 * dégradés en `color-dodge` rendent de façon quasi identique, pour quelques
 * centaines d'octets. Le brief demande que l'innovation serve l'expérience,
 * pas qu'elle impressionne — ici le poids ne s'achèterait aucun gain perçu.
 *
 * Les variables CSS sont écrites directement sur le nœud : passer par un état
 * React re-rendrait le billet à chaque image du mouvement.
 */
export function Holographic({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()
  const [tiltOn, setTiltOn] = useState(false)
  const canRequestTilt = useSyncExternalStore(
    noSubscribe,
    tiltPermissionSnapshot,
    () => false,
  )

  const apply = (x: number, y: number, tilt: boolean) => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--mx', `${x * 100}%`)
    el.style.setProperty('--my', `${y * 100}%`)
    el.style.setProperty('--shift', String(x))
    el.style.setProperty('--holo', '1')
    el.style.transform = tilt
      ? `perspective(900px) rotateX(${(0.5 - y) * 7}deg) rotateY(${(x - 0.5) * 9}deg)`
      : ''
  }

  const reset = () => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--holo', '0')
    el.style.transform = ''
  }

  useEffect(() => {
    if (!tiltOn || reduced) return
    const onTilt = (e: DeviceOrientationEvent) => {
      // gamma : inclinaison gauche/droite (-90..90). beta : avant/arrière.
      const x = Math.min(1, Math.max(0, ((e.gamma ?? 0) + 45) / 90))
      const y = Math.min(1, Math.max(0, ((e.beta ?? 45) - 10) / 70))
      apply(x, y, true)
    }
    window.addEventListener('deviceorientation', onTilt)
    return () => window.removeEventListener('deviceorientation', onTilt)
  }, [tiltOn, reduced])

  const enableTilt = async () => {
    const api = window.DeviceOrientationEvent as unknown as OrientationPermission
    if (typeof api?.requestPermission === 'function') {
      const res = await api.requestPermission()
      if (res !== 'granted') return
    }
    setTiltOn(true)
  }

  return (
    <div className="space-y-3">
      <div
        ref={ref}
        className={`holo relative overflow-hidden rounded-2xl ${className}`}
        onPointerMove={
          reduced
            ? undefined
            : (e) => {
                const r = e.currentTarget.getBoundingClientRect()
                apply(
                  (e.clientX - r.left) / r.width,
                  (e.clientY - r.top) / r.height,
                  e.pointerType === 'mouse',
                )
              }
        }
        onPointerLeave={reset}
      >
        {children}
      </div>

      {canRequestTilt && !tiltOn && !reduced && (
        <button
          type="button"
          onClick={enableTilt}
          className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground focus-visible:underline"
        >
          Activer le reflet à l&apos;inclinaison
        </button>
      )}
    </div>
  )
}
