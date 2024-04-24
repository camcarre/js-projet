import { Application, send } from "https://deno.land/x/oak/mod.ts";
import * as path from "https://deno.land/std/path/mod.ts";

const app = new Application();

app.use(async (ctx) => {
  const filePath = ctx.request.url.pathname;
  const root = Deno.cwd();

  try {
    if (filePath.endsWith(".css")) {
      await send(ctx, filePath, {
        root,
      });
    } else {
      await send(ctx, filePath, {
        root,
        index: "index.html",
      });
    }
  } catch (error) {
    console.error(error);
    ctx.response.status = error.status || 500;
    ctx.response.body = "Internal server error";
  }
});

const PORT = 3000;
console.log(`Server is running on port ${PORT}`);
await app.listen({ port: PORT });








