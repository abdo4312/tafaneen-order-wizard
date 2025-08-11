import asyncio
from playwright.async_api import async_playwright, expect
import os

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        print("Navigating to page...")
        await page.goto("http://localhost:3001")

        print("Waiting for element...")
        welcome_banner = page.get_by_role("heading", name="أهلاً بك في مكتبة تفانين")
        await expect(welcome_banner).to_be_visible(timeout=10000)
        print("Element found.")

        screenshot_path = "/app/jules-scratch/verification/verification.png"
        print(f"Attempting to save screenshot to: {screenshot_path}")
        await page.screenshot(path=screenshot_path)
        print("Screenshot command executed.")

        # Check if the file exists
        if os.path.exists(screenshot_path):
            print("Screenshot file created successfully.")
        else:
            print("Error: Screenshot file not found after saving.")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
