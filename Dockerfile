FROM public.ecr.aws/lambda/nodejs:22 AS base

WORKDIR /usr/app

COPY package.json package-lock.json ./
COPY src ./src
COPY assets ./assets

RUN npm install
RUN npm run build

FROM public.ecr.aws/lambda/nodejs:22

COPY --from=base /usr/app/dist/* ./
COPY --from=base /usr/app/node_modules ./node_modules
COPY --from=base /usr/app/assets ./assets

CMD ["dist/app.handler"]