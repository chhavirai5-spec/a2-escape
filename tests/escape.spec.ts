import { test, expect } from "@playwright/test";

const presets = ["beginner", "intermediate", "advanced"] as const;

test("generates single-file HTML for three presets", async ({ page }) => {
  await page.goto("/");

  for (const p of presets) {
    // Select the only <select> on the page
    await page.locator("select").selectOption(p);

    // Click Generate
    await page.getByRole("button", { name: "Generate" }).click();

    // Read the generated HTML from the textarea
    const html = await page.locator("[data-testid='output-html']").inputValue();

    // Basic checks that prove it's a standalone HTML file
    expect(html.toLowerCase()).toContain("<!doctype html>");
    expect(html).toContain("<style>");
    expect(html).toContain("<script>");
  }
});

test("POST /api/builds stores a build and GET returns a list", async ({ page, request }) => {
  await page.goto("/");
  await page.locator("select").selectOption("beginner");
  await page.getByRole("button", { name: "Generate" }).click();

  const html = await page.locator("[data-testid='output-html']").inputValue();

  // Save build
  const res = await request.post("/api/builds", {
    data: { scenario: "escape:beginner", html },
  });
  expect(res.status()).toBe(201);

  // List builds (only light fields so output is small)
  const list = await request.get("/api/builds?fields=id,scenario,createdAt");
  expect(list.ok()).toBeTruthy();
  const body = await list.json();
  expect(Array.isArray(body)).toBe(true);
  expect(body.length).toBeGreaterThan(0);
});
