import { createServer } from "node:http";

export function serve(handler, env, port) {
  return createServer(async (incoming, outgoing) => {
    try {
      const data = [];
      let size = 0;
      for await (const chunk of incoming) {
        size += chunk.length;
        if (size > 16_000) {
          outgoing.writeHead(413);
          outgoing.end("Request too large");
          return;
        }
        data.push(chunk);
      }
      const request = new Request(
        `http://${incoming.headers.host}${incoming.url}`,
        {
          method: incoming.method,
          headers: incoming.headers,
          ...(!["GET", "HEAD"].includes(incoming.method)
            ? { body: Buffer.concat(data) }
            : {}),
        },
      );
      const response =
        (await handler(request, env)) ||
        new Response("Not found", { status: 404 });
      outgoing.writeHead(response.status, Object.fromEntries(response.headers));
      outgoing.end(Buffer.from(await response.arrayBuffer()));
    } catch {
      outgoing.writeHead(500);
      outgoing.end("Server error");
    }
  }).listen(port, "127.0.0.1", () =>
    console.log(`Local: http://127.0.0.1:${port}`),
  );
}

export function loadEnvironment() {
  for (const filename of [".env", ".env.local"]) {
    try {
      process.loadEnvFile(filename);
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }
  return {
    ...process.env,
    BREVO_SENDER_EMAIL:
      process.env.BREVO_SENDER_EMAIL || "billalyasir5@gmail.com",
    BREVO_SENDER_NAME: process.env.BREVO_SENDER_NAME || "Billal Yasir",
    CONTACT_EMAIL: process.env.CONTACT_EMAIL || "billalyasir5@gmail.com",
    LOCAL_DEVELOPMENT: "true",
  };
}
