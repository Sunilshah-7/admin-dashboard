import { expect, test, type Page } from "playwright/test";

async function login(page: Page) {
  await page.goto("/");
  await page.getByLabel("Email").fill("admin@test.com");
  await page.getByLabel("Password").fill("password");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByRole("heading", { name: "Cluster overview" })).toBeVisible();
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
});

test("login flow lands on the dashboard", async ({ page }) => {
  await login(page);

  await expect(page).toHaveURL(/\/dashboard\/?$/);
  await expect(page.getByText("GPU Utilization", { exact: true })).toBeVisible();
});

test("dashboard loads with data", async ({ page }) => {
  await login(page);

  await expect(page.getByText("Inference Latency Distribution")).toBeVisible();
  await expect(page.getByRole("table", { name: "Recent deployments" })).toBeVisible();
});

test("model registry navigation works", async ({ page }) => {
  await login(page);

  await page.getByRole("link", { name: /Models/ }).click();

  await expect(page).toHaveURL(/\/models\/?$/);
  await expect(page.getByRole("heading", { name: "Model Registry" })).toBeVisible();
  await expect(page.getByRole("table", { name: "Model registry" })).toBeVisible();
});

test("team invitation flow adds a pending member", async ({ page }) => {
  await login(page);
  await page.getByRole("link", { name: /Teams/ }).click();
  await page.getByRole("button", { name: "Invite member" }).click();
  await page.getByLabel("Email").fill("new.member@reflection.ai");
  await page.getByRole("button", { name: "Send invite" }).click();

  await expect(page.getByRole("table", { name: "Team members" })).toContainText(
    "new.member@reflection.ai",
  );
});

test("playground submits a prompt and renders a response", async ({ page }) => {
  await login(page);
  await page.goto("/playground");
  await expect(page.getByRole("heading", { name: "AI Playground" })).toBeVisible();
  await page.getByLabel("User message").fill("Summarize Vector Vision 70B status.");
  await page.keyboard.press("Control+Enter");

  await expect(page.getByText(/Hugging Face|Mock/).first()).toBeVisible();
});
