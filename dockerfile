FROM node:20 AS base

RUN apt-get update -y && apt-get install -y openssl

COPY . ./
WORKDIR ./

FROM base AS prod-deps
RUN npm install --prod --frozen-lockfile

FROM base AS build
RUN npm install --frozen-lockfile
RUN npx prisma generate
RUN npm run build

FROM base
COPY --from=prod-deps /node_modules /node_modules
COPY --from=build /dist /dist
EXPOSE 3000
CMD [ "npm", "start" ]
