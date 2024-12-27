import { createApp } from "./infrastructure/web/fastify/app";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  const app = createApp();

  try {
    await app.listen({ port: 3333 });
    console.log("Server running on http://localhost:3333");
    console.log("API Docs at http://localhost:3000/docs");
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

main();