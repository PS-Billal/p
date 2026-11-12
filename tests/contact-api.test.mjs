import test from "node:test";
import assert from "node:assert/strict";
import { handleContact } from "../server/contact.mjs";

const env = {
  BREVO_API_KEY: "unit-test-only-secret",
  BREVO_SENDER_EMAIL: "sender@example.com",
  CONTACT_EMAIL: "owner@example.com",
};
const origin = "https://portfolio.example.com";
const values = {
  name: "Test Visitor",
  email: "visitor@example.com",
  subject: "Project query",
  message: "I would like to discuss a software project.",
  website: "",
};

async function challenge() {
  const result = await handleContact(
    new Request(`${origin}/api/contact/challenge`, {
      headers: { "cf-connecting-ip": crypto.randomUUID() },
    }),
    env,
  );
  const data = await result.json();
  return {
    token: data.token,
    answer: data.question
      .split(" + ")
      .reduce((sum, n) => sum + Number(n), 0)
      .toString(),
  };
}

function submit(body, overrideOrigin = origin) {
  return new Request(`${origin}/api/contact`, {
    method: "POST",
    headers: {
      Origin: overrideOrigin,
      "Content-Type": "application/json",
      "cf-connecting-ip": crypto.randomUUID(),
    },
    body: JSON.stringify(body),
  });
}

test("unconfigured delivery fails honestly and exposes no credentials", async () => {
  const response = await handleContact(
    new Request(`${origin}/api/contact/challenge`),
    {},
  );
  assert.equal(response.status, 503);
  assert.match((await response.json()).error, /temporarily unavailable/);
});

test("a valid puzzle sends a fixed-recipient message and sets visitor reply-to", async () => {
  const proof = await challenge();
  let captured;
  const response = await handleContact(
    submit({ ...values, ...proof, to: "attacker@example.com" }),
    env,
    async (url, options) => {
      captured = { url, options, body: JSON.parse(options.body) };
      return Response.json({ messageId: "test-message" }, { status: 201 });
    },
  );
  assert.equal(response.status, 200);
  assert.equal(captured.url, "https://api.brevo.com/v3/smtp/email");
  assert.equal(captured.options.headers["api-key"], env.BREVO_API_KEY);
  assert.equal(captured.body.to[0].email, env.CONTACT_EMAIL);
  assert.equal(captured.body.replyTo.email, values.email);
  assert.equal(captured.body.sender.email, env.BREVO_SENDER_EMAIL);
  assert.ok(!JSON.stringify(await response.json()).includes(env.BREVO_API_KEY));
  const replay = await handleContact(submit({ ...values, ...proof }), env);
  assert.equal(replay.status, 400);
});

test("wrong or tampered puzzles never call Brevo", async () => {
  let called = false;
  const send = async () => {
    called = true;
    throw new Error();
  };
  const proof = await challenge();
  for (const invalid of [
    { ...proof, answer: "999" },
    { ...proof, token: `${proof.token}0` },
  ]) {
    assert.equal(
      (await handleContact(submit({ ...values, ...invalid }), env, send))
        .status,
      400,
    );
  }
  assert.equal(called, false);
});

test("invalid fields, honeypot, and foreign origins are blocked", async () => {
  const proof = await challenge();
  for (const invalid of [
    { email: "invalid" },
    { message: "tiny" },
    { website: "spam" },
    { subject: "Injected\nHeader" },
  ]) {
    assert.equal(
      (await handleContact(submit({ ...values, ...proof, ...invalid }), env))
        .status,
      400,
    );
  }
  assert.equal(
    (
      await handleContact(
        submit({ ...values, ...proof }, "https://other.example.com"),
        env,
      )
    ).status,
    403,
  );
});

test("provider rejection returns an error rather than a success message", async () => {
  const response = await handleContact(
    submit({ ...values, ...(await challenge()) }),
    env,
    async () => Response.json({ message: "Invalid API key" }, { status: 401 }),
  );
  assert.equal(response.status, 502);
  const result = await response.json();
  assert.match(result.error, /couldn’t send/);
  assert.equal(result.refreshChallenge, true);
  assert.ok(!JSON.stringify(result).includes("Invalid API key"));
});

test("repeated requests are limited", async () => {
  const ip = crypto.randomUUID();
  let response;
  for (let i = 0; i < 21; i++)
    response = await handleContact(
      new Request(`${origin}/api/contact/challenge`, {
        headers: { "cf-connecting-ip": ip },
      }),
      env,
    );
  assert.equal(response.status, 429);
});
