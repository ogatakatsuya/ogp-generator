FROM public.ecr.aws/lambda/nodejs:22 AS base

WORKDIR /usr/app

COPY package.json package-lock.json ./
COPY src ./src
COPY assets ./assets

RUN npm install
RUN npm run build

FROM public.ecr.aws/lambda/nodejs:22

COPY --from=base /usr/app/* ./

CMD ["dist/app.handler"]