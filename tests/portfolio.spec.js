const { test, expect } = require("@playwright/test");

test("hero panel and badges fit their scene without clipping or covering the data layer", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });

  for (const width of [320, 375, 390, 430, 600, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    await expect(page.locator(".engineering-scene")).toHaveCSS(
      "overflow",
      "visible",
    );
    await expect
      .poll(async () =>
        page.locator(".engineering-scene").evaluate((scene) => {
          const bounds = scene.getBoundingClientRect();
          return [
            ...scene.querySelectorAll(
              ".architecture, .floating-token, .deployment-badge",
            ),
          ].every((card) => {
            const rect = card.getBoundingClientRect();
            return (
              rect.left >= bounds.left &&
              rect.right <= bounds.right &&
              rect.top >= bounds.top &&
              rect.bottom <= bounds.bottom
            );
          });
        }),
      )
      .toBe(true);

    const spacing = await page.locator(".scene-stage").evaluate((stage) => {
      const panel = stage
        .querySelector(".architecture")
        .getBoundingClientRect();
      const javascript = stage
        .querySelector(".token-js")
        .getBoundingClientRect();
      const deployment = stage
        .querySelector(".deployment-badge")
        .getBoundingClientRect();
      return {
        javascript: javascript.top - panel.bottom,
        deployment: deployment.top - panel.bottom,
      };
    });
    expect(spacing.javascript).toBeGreaterThan(0);
    expect(spacing.deployment).toBeGreaterThan(0);
  }
});

test("touch layouts keep cards centered with matching left and right gutters", async ({
  browser,
}) => {
  const context = await browser.newContext({
    isMobile: true,
    hasTouch: true,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();

  for (const width of [320, 375, 390, 430, 540, 600, 700, 768]) {
    await page.setViewportSize({ width, height: 667 });
    await page.goto("/");
    const measurements = await page.evaluate(() => {
      const viewport = document.documentElement.clientWidth;
      const selectors = [
        ".projects-grid",
        ".skills-grid",
        ".principle-grid",
        ".education-card",
        ".contact-section",
      ];
      if (innerWidth <= 700)
        selectors.push(".project-card", ".experience-card");
      if (innerWidth <= 540) selectors.push(".skill-card");
      return selectors.flatMap((selector) =>
        [...document.querySelectorAll(selector)].map((node) => {
          const rect = node.getBoundingClientRect();
          return { selector, left: rect.left, right: viewport - rect.right };
        }),
      );
    });

    for (const { selector, left, right } of measurements) {
      expect(Math.abs(left - right), `${selector} at ${width}px`).toBeLessThan(
        1,
      );
      expect(
        left,
        `${selector} left gutter at ${width}px`,
      ).toBeGreaterThanOrEqual(15);
    }

    const lastRow = await page.locator(".tech-stack").evaluate((stack) => {
      const tiles = [...stack.children].map((tile) =>
        tile.getBoundingClientRect(),
      );
      const row = tiles.filter(
        (tile) => Math.abs(tile.top - tiles.at(-1).top) < 1,
      );
      const bounds = stack.getBoundingClientRect();
      return {
        left: row[0].left - bounds.left,
        right: bounds.right - row.at(-1).right,
      };
    });
    expect(Math.abs(lastRow.left - lastRow.right)).toBeLessThan(1);
  }

  await context.close();
});

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
