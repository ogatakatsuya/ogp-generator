FROM public.ecr.aws/lambda/nodejs:22 AS base

WORKDIR /usr/app

COPY app.ts package.json package-lock.json ./
COPY assets ./assets

RUN npm install
RUN npm run build

FROM public.ecr.aws/lambda/nodejs:22

COPY --from=base /usr/app/* ./

CMD ["app.handler"]