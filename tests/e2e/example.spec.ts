import { test, expect } from '@playwright/test'

test('homepage has correct title', async ({ page }) => {
  await page.goto('/')

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Vue 3 Template/)
})

test('navigation works correctly', async ({ page }) => {
  await page.goto('/')

  // Click the login link
  await page.click('text=登录')

  // Expect url to contain login
  await expect(page).toHaveURL(/.*login/)

  // Click the register link
  await page.click('text=注册')

  // Expect url to contain register
  await expect(page).toHaveURL(/.*register/)
})

test('login form validation', async ({ page }) => {
  await page.goto('/login')

  // Try to submit empty form
  await page.click('button[type="submit"]')

  // Check for validation messages
  await expect(page.locator('text=邮箱是必填项')).toBeVisible()
  await expect(page.locator('text=密码是必填项')).toBeVisible()
})

test('responsive design works on mobile', async ({ page }) => {
  // Emulate mobile device
  await page.setViewportSize({ width: 375, height: 667 })
  await page.goto('/')

  // Check mobile navigation
  const mobileNav = page.locator('[data-testid="mobile-nav"]')
  await expect(mobileNav).toBeVisible()
})
