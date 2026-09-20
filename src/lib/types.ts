/** Lieu accueillant un événement. */
export type Venue = {
  id: string
  name: string
  city: string
  capacity: number
}

/** Créneau de départ d'une navette. */
export type Slot = {
  /** Heure locale, format "18:30". */
  time: string
  /** Taux de remplissage prévu, de 0 à 1. Alimente la courbe d'affluence. */
  load: number
}

/** Point de départ d'une navette vers un événement. */
export type Departure = {
  id: string
  district: string
  /**
   * Position dans le viewBox SVG `0 0 100 100` de la carte, et non des
   * coordonnées géographiques : la carte est un dessin stylisé, pas une
   * projection cartographique.
   */
  coords: [number, number]
  /** Prix du trajet, en XOF. */
  price: number
  durationMin: number
  slots: Slot[]
}

export type Event = {
  id: string
  slug: string
  title: string
  /** Date ISO 8601. */
  date: string
  venue: Venue
  /** Prix d'entrée du billet, en XOF. */
  priceFrom: number
  image: string
  /** Couleur d'ambiance : pilote la bascule chromatique de la page d'accueil. */
  accent: string
  capacity: number
  sold: number
  category: string
}

/**
 * Liaison interurbaine Fodium Transport, indépendante d'un événement.
 * Alimente le volet « trajets » de la recherche unifiée (brief §3.2).
 */
export type Route = {
  id: string
  from: string
  to: string
  /** Prix du trajet, en XOF. */
  price: number
  durationMin: number
  distanceKm: number
  /** Départs quotidiens, format "07:00". */
  departures: string[]
}

export type PaymentMethod = 'wave' | 'orange-money' | 'free-money' | 'card'

/** Commande en cours de composition sur la page événement. */
export type Order = {
  event: Event
  withShuttle: boolean
  departure?: Departure
  /** Heure du créneau retenu, référence un `Slot.time`. */
  slot?: string
  /** Total en XOF, recalculé par `computeTotal`. */
  total: number
}
