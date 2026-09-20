# Stage 1: install dependencies
# node:22 et non 20 : pnpm 11.17 exige Node >= 22.13 (il échoue sur 20 avec
# ERR_UNKNOWN_BUILTIN_MODULE). Next 16 se contente de >= 20.9.
FROM node:22-alpine AS deps
WORKDIR /app
# Corepack lit la version de pnpm dans package.json ("packageManager").
# Le prompt interactif bloquerait un build non supervisé.
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# Concurrence réduite et délai allongé : sur une liaison lente, la valeur par
# défaut sature le lien et les téléchargements expirent avant d'aboutir.
RUN pnpm install --frozen-lockfile --network-concurrency=4 --fetch-timeout=600000

# Stage 2: build the app
FROM node:22-alpine AS builder
WORKDIR /app
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable

# Origine publique du site. Lue au BUILD : les pages sont précalculées, donc
# l'URL absolue de l'image de partage est figée dans le HTML généré. La
# définir au démarrage du conteneur n'aurait aucun effet.
#
# La valeur par défaut est le domaine réel : un clone frais construit une
# image correcte sans étape manuelle, plutôt que de produire des URLs
# « localhost » en silence.
ARG NEXT_PUBLIC_SITE_URL=https://fodium.benhattab.pro
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# Stage 3: run image
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# Le serveur autonome écoute sur toutes les interfaces : sans cela il se lie
# à localhost DANS le conteneur et reste injoignable depuis l'hôte.
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
