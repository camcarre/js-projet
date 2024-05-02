import { Application, send } from "https://deno.land/x/oak/mod.ts";

const app = new Application();
const basePath = Deno.cwd(); // Remplacez par le chemin vers vos fichiers statiques

app.use(async (context, next) => {
  if (context.request.url.pathname === "/") {
    await send(context, "index.html", {
      root: `${basePath}/html`,
    });
  } else {
    await next();
  }
});

<<<<<<< HEAD
app.use(async (context, next) => {
  const filePath = context.request.url.pathname;
  const fileWhitelist = [
    "css/index.css",
    "css/jeux.css",
    "css/regle.css",
    "html/clearplayer.html",
    "html/index.html",
    "html/jeux.html",
    "html/perso.html",
    "html/règle.html",
    "image/cartedos.jpeg",
    "image/imagehorizontale2.png",
    "image/jeux de carte.jpeg",
    "image/logohorizontaleundercover.jpeg",
    "image/png-clipart-contract-bridge-playing-card-poker-card-game-standard-52-card-deck-playing-card-back-rectangle-casino.png",
    "image/undercoverlogo.png",
  ];
  if (fileWhitelist.includes(filePath)) {
    await send(context, filePath, {
      root: `${basePath}/html`,
    });
  } else {
    await next();
  }
});

app.addEventListener("listen", ({ hostname, port, secure }) => {
  console.log(
    `Listening on: ${secure ? "https://" : "http://"}${hostname ?? "localhost"}:${port}`
  );
});

await app.listen({ port: 8000 });
=======
const PORT = 3000;
console.log(`Server is running on port ${PORT}`);
await app.listen({ port: PORT });







>>>>>>> theod

