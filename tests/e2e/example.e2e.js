describe("Example E2E Test", () => {
    beforeAll(async () => {
      await device.launchApp();
    });

    it("should show login screen", async () => {
      await expect(element(by.text("Zaloguj się"))).toBeVisible();
    });

    it("should login successfully", async () => {
      await element(by.placeholder("Email")).typeText("test@example.com");
      await element(by.placeholder("Hasło")).typeText("password123");
      await element(by.text("Zaloguj")).tap();
      await expect(element(by.text("Wyślij"))).toBeVisible();
    });
  });
