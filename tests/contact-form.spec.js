const { test, expect } = require("@playwright/test");

test("contact form checks required fields and handles real API states accessibly", async ({
  page,
}) => {
  await page.route("**/api/contact/challenge", (route) =>
    route.fulfill({ json: { question: "4 + 7", token: "test-token" } }),
  );
  let attempts = 0;
  await page.route("**/api/contact", (route) => {
    attempts++;
    const body = route.request().postDataJSON();
    expect(body.email).toBe("visitor@example.com");
    expect(body.token).toBe("test-token");
    return route.fulfill({
      status: attempts === 1 ? 400 : 200,
      json:
        attempts === 1
          ? {
              error: "The puzzle answer is incorrect or expired.",
              refreshChallenge: true,
            }
          : { message: "Your query has been accepted for delivery." },
    });
  });
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/#contact");
  const form = page.getByRole("form", { name: "Send a query" });
  await form.getByRole("button", { name: "Send query" }).click();
  expect(attempts).toBe(0);
  await page.getByLabel("Your name", { exact: true }).fill("Test Visitor");
  await page
    .getByLabel("Email address", { exact: true })
    .fill("visitor@example.com");
  await page.getByLabel("Subject", { exact: true }).fill("Project inquiry");
  await page
    .getByLabel("Your message", { exact: true })
    .fill("I have a software project to discuss with you.");
  await page.locator("#contact-answer").fill("999");
  await form.getByRole("button", { name: "Send query" }).click();
  await expect(form.getByRole("status")).toContainText("incorrect");
  await expect(page.getByLabel("Your message", { exact: true })).toHaveValue(
    "I have a software project to discuss with you.",
  );
  await page.locator("#contact-answer").fill("11");
  await form.getByRole("button", { name: "Send query" }).click();
  await expect(form.getByRole("status")).toContainText("accepted for delivery");
  await expect(page.getByLabel("Your message", { exact: true })).toBeEmpty();
  expect(attempts).toBe(2);
});

test("missing server configuration never claims a query was sent", async ({
  page,
}) => {
  await page.route("**/api/contact/challenge", (route) =>
    route.fulfill({
      status: 503,
      json: {
        error:
          "The contact form is temporarily unavailable. Please email directly.",
      },
    }),
  );
  await page.goto("/#contact");
  await expect(page.getByRole("status")).toContainText(
    "temporarily unavailable",
  );
  await expect(page.getByRole("button", { name: "Send query" })).toBeDisabled();
});
