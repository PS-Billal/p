const { test, expect } = require("@playwright/test");

for (const width of [320, 375, 390, 430, 768, 1024, 1440, 1920]) {
  test(`all sections fit at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("actually ship.");
    await expect(page.locator(".skill-card")).toHaveCount(6);
    await expect(page.locator(".project-card")).toHaveCount(4);
    const dimensions = await page.evaluate(() => ({
      viewport: innerWidth,
      content: document.documentElement.scrollWidth,
    }));
    expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
    for (const id of [
      "home",
      "projects",
      "skills",
      "experience",
      "about",
      "education",
      "contact",
    ]) {
      await expect(page.locator(`#${id}`)).toBeAttached();
    }
    expect(errors).toEqual([]);
  });
}

test("pointer tilt and spotlight follow the cursor and reset", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const card = page.locator(".project-card").first();
  await card.scrollIntoViewIfNeeded();
  const box = await card.boundingBox();
  await page.mouse.move(box.x + box.width * 0.75, box.y + box.height * 0.3);
  await expect(card).toHaveAttribute("data-hover", "true");
  const values = await card.evaluate((el) => ({
    rotation: el.style.getPropertyValue("--ry"),
    spotlight: el.style.getPropertyValue("--px"),
  }));
  expect(parseFloat(values.rotation)).toBeGreaterThan(0);
  expect(parseFloat(values.spotlight)).toBeGreaterThan(50);
  await page.mouse.move(5, 500);
  await expect(card).toHaveAttribute("data-hover", "false");
  expect(await card.evaluate((el) => el.style.getPropertyValue("--ry"))).toBe(
    "0deg",
  );
});

test("mobile menu traps focus, closes with Escape, and restores scrolling", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Open navigation" });
  await toggle.click();
  await expect(page.locator("#mobile-nav a").first()).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe(
    "hidden",
  );
  await page.keyboard.press("Shift+Tab");
  await expect(
    page.getByRole("button", { name: "Close navigation" }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.locator("#mobile-nav")).toHaveCount(0);
  await expect(toggle).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe(
    "hidden",
  );
  await toggle.click();
  await page
    .locator("#mobile-nav")
    .getByRole("link", { name: "Skills" })
    .click();
  await expect(page.locator("#mobile-nav")).toHaveCount(0);
  await expect(page).toHaveURL(/#skills$/);
});

test("reduced motion disables tilt and decorative animation", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const card = page.locator(".project-card").first();
  await card.hover();
  expect(await card.getAttribute("data-hover")).not.toBe("true");
  expect(
    await page
      .locator(".floating-token")
      .first()
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
});

test("case studies, section anchors, local assets, and email destinations work", async ({
  page,
  request,
}) => {
  await page.goto("/");
  const links = await page
    .locator('a[href^="/projects/"]')
    .evaluateAll((nodes) => [
      ...new Set(nodes.map((n) => n.getAttribute("href"))),
    ]);
  expect(links).toHaveLength(4);
  for (const href of links) {
    const response = await page.goto(href);
    expect(response.status()).toBe(200);
    await expect(page.locator("h1")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "The outcome" }),
    ).toBeVisible();
  }
  await page.goto("/");
  await expect(
    page.locator('.contact-details a[href="mailto:billalyasir5@gmail.com"]'),
  ).toBeVisible();
  for (const url of [
    "/robots.txt",
    "/sitemap.xml",
    "/icon.svg",
    "/social-preview.png",
  ]) {
    expect((await request.get(url)).status()).toBe(200);
  }
  const brokenImages = await page.locator("img").evaluateAll(async (images) => {
    images.forEach((img) => {
      img.loading = "eager";
    });
    await Promise.all(images.map((img) => img.decode().catch(() => {})));
    return images.filter((img) => img.naturalWidth === 0).map((img) => img.src);
  });
  expect(brokenImages).toEqual([]);
});
