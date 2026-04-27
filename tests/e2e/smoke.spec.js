import { test, expect } from '@playwright/test';

test.describe('smoke - core flows', () => {
  test('home carrega com header e produtos', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('header.header')).toBeVisible();
    await expect(page.locator('img.header-logo-img')).toBeVisible();
    await expect(page.locator('.header-announce')).toBeVisible();
    // pelo menos 1 product card aparece (catalogo carrega)
    await expect(page.locator('.product-card').first()).toBeVisible({ timeout: 15_000 });
  });

  test('busca global abre e aceita texto', async ({ page }) => {
    await page.goto('/');
    await page.locator('.header-search-pill').click();
    const searchInput = page.locator('input').filter({ hasText: '' }).first();
    await expect(searchInput).toBeVisible({ timeout: 5_000 });
    await searchInput.fill('coca');
    await page.waitForTimeout(500);
  });

  test('carrinho abre o drawer', async ({ page }) => {
    await page.goto('/');
    await page.locator('.cart-button').first().click();
    await expect(page.locator('.cart-drawer')).toBeVisible({ timeout: 5_000 });
  });

  test('linha de auth (login/cadastro/cliente) renderiza quando deslogado', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);
    const isLoggedIn = await page.locator('.header-account').isVisible().catch(() => false);
    if (isLoggedIn) {
      test.skip(true, 'Usuario ja logado — pulando teste de auth-row');
      return;
    }
    await expect(page.locator('.auth-row')).toBeVisible();
    await expect(page.locator('.auth-row-btn--login')).toBeVisible();
  });

  test('sem overflow horizontal', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);
    const overflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    // tolerancia 2px pra rounding
    expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 2);
  });
});
