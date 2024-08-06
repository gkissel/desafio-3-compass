FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN apt-get update -y && apt-get install -y openssl
RUN apt-get install -y build-essential libpq-dev
RUN corepack enable
COPY . ./
WORKDIR ./

FROM base AS prod-deps
RUN pnpm install --prod --frozen-lockfile

FROM base AS build
RUN pnpm install --frozen-lockfile
RUN pnpm dlx prisma generate
RUN pnpm run build

FROM base
COPY --from=prod-deps /node_modules /node_modules
COPY --from=build /dist /dist
EXPOSE 3000
CMD [ "pnpm", "start" ]