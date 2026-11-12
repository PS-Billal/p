"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

const challengeError =
  "Couldn’t load the human check. Please try again or email billalyasir5@gmail.com.";
const sendError =
  "Your message couldn’t be sent. Your text is still here. Please try again or email billalyasir5@gmail.com.";

async function readApiResponse(response, fallback) {
  let data;
  try {
    data = JSON.parse(await response.text());
  } catch {
    throw new Error(fallback);
  }
  if (!data || typeof data !== "object") throw new Error(fallback);
  if (!response.ok)
    throw new Error(typeof data.error === "string" ? data.error : fallback);
  return data;
}

export default function ContactForm() {
  const [challenge, setChallenge] = useState(null);
  const [status, setStatus] = useState("loading");
  const [notice, setNotice] = useState("");
  const [answer, setAnswer] = useState("");
  const pending = useRef(false);

  async function refresh(signal) {
    setChallenge(null);
    setAnswer("");
    try {
      const response = await fetch("/api/contact/challenge", {
        signal: signal
          ? AbortSignal.any([signal, AbortSignal.timeout(12_000)])
          : AbortSignal.timeout(12_000),
        cache: "no-store",
      });
      const data = await readApiResponse(response, challengeError);
      if (typeof data.token !== "string" || typeof data.question !== "string")
        throw new Error(challengeError);
      setChallenge(data);
      setStatus("ready");
    } catch (error) {
      if (error.name !== "AbortError") {
        setStatus("unavailable");
        setNotice(
          error instanceof TypeError || error.name === "TimeoutError"
            ? challengeError
            : error.message,
        );
      }
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    refresh(controller.signal);
    return () => controller.abort();
  }, []);

  async function submit(event) {
    event.preventDefault();
    if (!challenge || pending.current) return;
    pending.current = true;
    setStatus("sending");
    setNotice("");
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, answer, token: challenge.token }),
        signal: AbortSignal.timeout(15_000),
      });
      const result = await readApiResponse(response, sendError);
      if (typeof result.message !== "string") throw new Error(sendError);
      setStatus("sent");
      setNotice(result.message);
      form.reset();
      setAnswer("");
      setChallenge(null);
    } catch (error) {
      setNotice(
        error.name === "TimeoutError"
          ? "The request timed out. Your text is still here; please try again."
          : error instanceof TypeError
            ? sendError
            : error.message,
      );
      await refresh();
    } finally {
      pending.current = false;
    }
  }

  return (
    <div className="contact-form-panel">
      <div className="form-heading">
        <span className="eyebrow">START A CONVERSATION</span>
        <h3>What’s on your mind?</h3>
        <p>A project, a question, or an idea. Tell me about it.</p>
      </div>
      <form
        onSubmit={submit}
        className="contact-form"
        aria-label="Send a query"
      >
        <div className="form-row">
          <label htmlFor="contact-name">
            Your name
            <input
              id="contact-name"
              name="name"
              autoComplete="name"
              required
              minLength={2}
              maxLength={100}
              placeholder="Your name"
            />
          </label>
          <label htmlFor="contact-email">
            Email address
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              placeholder="you@example.com"
            />
          </label>
        </div>
        <label htmlFor="contact-subject">
          Subject
          <input
            id="contact-subject"
            name="subject"
            required
            minLength={3}
            maxLength={120}
            placeholder="What would you like to discuss?"
          />
        </label>
        <label htmlFor="contact-message">
          Your message
          <textarea
            id="contact-message"
            aria-label="Your message"
            name="message"
            required
            minLength={10}
            maxLength={5000}
            rows={5}
            placeholder="A little context goes a long way…"
            aria-describedby="message-help"
          />
          <span id="message-help" className="field-help">
            10–5,000 characters. Please leave out sensitive information.
          </span>
        </label>
        <div className="form-honeypot" aria-hidden="true">
          <label>
            Leave this empty
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <fieldset
          className="human-check"
          disabled={!challenge || status === "sending"}
        >
          <legend>
            <ShieldCheck size={16} /> A quick human check
          </legend>
          <div className="puzzle-row">
            <label htmlFor="contact-answer">
              <span>
                What is <strong>{challenge?.question || "…"}</strong>?
              </span>
              <input
                id="contact-answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                inputMode="numeric"
                pattern="[0-9]+"
                required
                autoComplete="off"
                maxLength={3}
                placeholder="Answer"
              />
            </label>
            <button
              type="button"
              className="puzzle-refresh"
              onClick={() => {
                setStatus("loading");
                setNotice("");
                refresh();
              }}
              aria-label="Get a new puzzle"
            >
              <RefreshCw size={17} />
            </button>
          </div>
        </fieldset>
        <p
          className={`form-notice ${status === "sent" ? "success" : ""}`}
          role="status"
          aria-live="polite"
        >
          {status === "sent" && <CheckCircle2 size={17} />}
          {notice || (status === "loading" ? "Loading the human check…" : "")}
        </p>
        <div className="form-actions">
          <button
            className="button primary"
            type="submit"
            disabled={!challenge || status === "sending"}
          >
            {status === "sending" ? "Sending…" : "Send query"}
            <ArrowUpRight size={18} />
          </button>
          {status === "sent" && (
            <button
              className="form-retry"
              type="button"
              onClick={() => {
                setNotice("");
                setStatus("loading");
                refresh();
              }}
            >
              Send another message
            </button>
          )}
          {status === "unavailable" && (
            <button
              className="form-retry"
              type="button"
              onClick={() => {
                setNotice("");
                setStatus("loading");
                refresh();
              }}
            >
              Try again
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
