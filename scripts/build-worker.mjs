import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";

// Embed the small static export in the Worker. No runtime asset binding is needed.
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
};
const assets = {};
async function collect(directory, prefix = "") {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    const url = `${prefix}/${entry.name}`;
    if (entry.isDirectory()) await collect(file, url);
    else {
      const bytes = await readFile(file);
      assets[url] = [
        bytes.toString("base64"),
        types[path.extname(file)] || "application/octet-stream",
        createHash("sha256").update(bytes).digest("hex"),
      ];
    }
  }
}
await collect("out");
const contact = (await readFile("server/contact.mjs", "utf8")).replace(
  "export async function handleContact",
  "async function handleContact",
);
const runtime = `
const assets = ${JSON.stringify(assets)};
export default {
  async fetch(request, env) {
    try {
      const contact = await handleContact(request, env);
      if (contact) return contact;
      if (!['GET', 'HEAD'].includes(request.method)) return new Response('Method not allowed', {status:405});
      const pathname = new URL(request.url).pathname;
      let asset = assets[pathname] || assets[pathname.endsWith('/') ? pathname + 'index.html' : pathname + '/index.html'];
      let status = 200;
      if (!asset) { asset = assets['/404.html']; status = 404; }
      if (!asset) return new Response('Not found', {status:404});
      const headers = {'Content-Type':asset[1], 'X-Content-Type-Options':'nosniff', 'Cache-Control':pathname.startsWith('/_next/static/') ? 'public, max-age=31536000, immutable' : 'no-cache', 'ETag':'"'+asset[2]+'"'};
      if (request.headers.get('if-none-match') === headers.ETag) return new Response(null,{status:304,headers});
      return new Response(request.method === 'HEAD' ? null : Uint8Array.from(atob(asset[0]), c=>c.charCodeAt(0)), {status,headers});
    } catch { return Response.json({error:'Something went wrong. Please try again.'},{status:500}); }
  }
};`;
await mkdir("dist/server", { recursive: true });
await mkdir("dist/.openai", { recursive: true });
await writeFile("dist/server/index.js", `${contact}\n${runtime}`);
await writeFile(
  "dist/.openai/hosting.json",
  await readFile(".openai/hosting.json"),
);
console.log(
  `Worker built with ${Object.keys(assets).length} static assets. No environment values are bundled.`,
);
