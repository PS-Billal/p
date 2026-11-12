const attempts = new Map();
const used = new Map();
const encoder = new TextEncoder();
const json = (body, status = 200) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
const unavailable = () =>
  json(
    {
      error:
        "The contact form is temporarily unavailable. Please email billalyasir5@gmail.com directly.",
    },
    503,
  );

async function key(secret) {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

const hex = (buffer) =>
  [...new Uint8Array(buffer)]
    .map((n) => n.toString(16).padStart(2, "0"))
    .join("");
const unhex = (value) =>
  Uint8Array.from(value.match(/.{2}/g) || [], (n) => parseInt(n, 16));

export async function handleContact(request, env, send = fetch) {
  const url = new URL(request.url);
  if (!url.pathname.startsWith("/api/contact")) return null;
  if (!env.BREVO_API_KEY || !env.BREVO_SENDER_EMAIL) return unavailable();

  const now = Date.now();
  for (const [id, expiry] of used) if (expiry < now) used.delete(id);
  for (const [id, value] of attempts)
    if (value.reset < now) attempts.delete(id);
  const ip = request.headers.get("cf-connecting-ip") || "local";
  const counter = attempts.get(ip) || { count: 0, reset: now + 60_000 };
  counter.count += 1;
  attempts.set(ip, counter);
  if (counter.count > 20)
    return json({ error: "Please wait a minute before trying again." }, 429);

  if (url.pathname === "/api/contact/challenge" && request.method === "GET") {
    const random = crypto.getRandomValues(new Uint32Array(2));
    const a = 2 + (random[0] % 8),
      b = 2 + (random[1] % 8);
    const payload = btoa(
      JSON.stringify({ a, b, id: crypto.randomUUID(), expires: now + 600_000 }),
    );
    const signature = hex(
      await crypto.subtle.sign(
        "HMAC",
        await key(env.BREVO_API_KEY),
        encoder.encode(payload),
      ),
    );
    return json({ question: `${a} + ${b}`, token: `${payload}.${signature}` });
  }

  if (url.pathname !== "/api/contact" || request.method !== "POST")
    return json({ error: "Method not allowed." }, 405);
  const origin = request.headers.get("origin");
  const local =
    env.LOCAL_DEVELOPMENT === "true" &&
    /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin || "");
  if (origin !== url.origin && !local)
    return json(
      { error: "Please submit this form from the portfolio website." },
      403,
    );
  if (!request.headers.get("content-type")?.includes("application/json"))
    return json({ error: "Unsupported request format." }, 415);
  if (Number(request.headers.get("content-length")) > 16_000)
    return json({ error: "Your message is too long." }, 413);

  let body;
  try {
    const text = await request.text();
    if (text.length > 16_000)
      return json({ error: "Your message is too long." }, 413);
    body = JSON.parse(text);
  } catch {
    return json({ error: "Please check your form and try again." }, 400);
  }

  if (!body || typeof body !== "object")
    return json({ error: "Invalid form." }, 400);
  if (body.website) return json({ error: "Unable to submit this form." }, 400);
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const subject = typeof body.subject === "string" ? body.subject.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (
    name.length < 2 ||
    name.length > 100 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    email.length > 254 ||
    subject.length < 3 ||
    subject.length > 120 ||
    message.length < 10 ||
    message.length > 5000 ||
    /[\r\n]/.test(name + email + subject)
  ) {
    return json(
      {
        error:
          "Please enter a valid name, email, subject, and a message of 10–5,000 characters.",
      },
      400,
    );
  }

  let challenge;
  try {
    const [payload, signature, extra] = String(body.token).split(".");
    if (extra || !/^[a-f0-9]{64}$/.test(signature)) throw new Error();
    const valid = await crypto.subtle.verify(
      "HMAC",
      await key(env.BREVO_API_KEY),
      unhex(signature),
      encoder.encode(payload),
    );
    if (!valid) throw new Error();
    challenge = JSON.parse(atob(payload));
    if (
      challenge.expires < now ||
      used.has(challenge.id) ||
      String(body.answer).trim() !== String(challenge.a + challenge.b)
    )
      throw new Error();
  } catch {
    return json(
      {
        error:
          "The puzzle answer is incorrect or expired. Please try the new puzzle.",
        refreshChallenge: true,
      },
      400,
    );
  }

  used.set(challenge.id, challenge.expires);
  try {
    const response = await send("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": env.BREVO_API_KEY,
        "Content-Type": "application/json",
        accept: "application/json",
      },
      signal: AbortSignal.timeout(12_000),
      body: JSON.stringify({
        sender: {
          email: env.BREVO_SENDER_EMAIL,
          name: env.BREVO_SENDER_NAME || "Billal Yasir",
        },
        to: [
          {
            email: env.CONTACT_EMAIL || "billalyasir5@gmail.com",
            name: "Billal Yasir",
          },
        ],
        replyTo: { email, name },
        subject: `Portfolio query: ${subject}`,
        textContent: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
        headers: { IdempotencyKey: challenge.id },
      }),
    });
    const result = await response.json();
    if (!response.ok || !result.messageId) throw new Error();
    return json({
      message:
        "Your query has been accepted for delivery. Thank you for getting in touch.",
    });
  } catch {
    return json(
      {
        error:
          "We couldn’t send your message. Your text is still here—please try again or email billalyasir5@gmail.com.",
        refreshChallenge: true,
      },
      502,
    );
  }
}
