FROM denoland/deno

WORKDIR /textrain
COPY . .
RUN deno cache main.ts

CMD deno run -A main.ts