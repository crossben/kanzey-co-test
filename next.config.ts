import type { NextConfig } from 'next'

/**
 * En-têtes de sécurité.
 *
 * `'unsafe-inline'` est nécessaire des deux côtés :
 *  - `style-src` parce que Tailwind et les composants posent des styles
 *    inline (couleur d'ambiance, position du reflet holographique) ;
 *  - `script-src` parce que Next.js injecte son bootstrap d'hydratation en
 *    inline. L'alternative est un nonce par requête, incompatible avec des
 *    pages statiques précalculées.
 *
 * Aucun domaine tiers n'est autorisé : les polices sont téléchargées au build
 * par `next/font` et servies depuis `/_next/static`, pas depuis Google.
 */
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "img-src 'self' data: blob:",
      "font-src 'self'",
      "style-src 'self' 'unsafe-inline'",
      "script-src 'self' 'unsafe-inline'",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
]

const nextConfig: NextConfig = {
  // Produit un serveur autonome avec ses seules dépendances tracées :
  // c'est ce que copie l'étape `runner` du Dockerfile.
  output: 'standalone',
  // Un build ne doit jamais masquer une erreur de types.
  typescript: { ignoreBuildErrors: false },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
}

export default nextConfig
