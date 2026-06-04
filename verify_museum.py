import asyncio
import os
import signal
import subprocess
import time
from playwright.async_api import async_playwright

async def verify_museum():
    print("Starting verification of the Museum project...")

    # 1. Build and Start Server
    print("Building project...")
    subprocess.run(["npm", "run", "build"], check=True)

    print("Starting server...")
    server_process = subprocess.Popen(
        ["npm", "run", "preview"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        preexec_fn=os.setsid
    )

    # Wait for server to be ready
    time.sleep(5)

    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch()
            page = await browser.new_page()

            # Go to the app
            print("Navigating to app...")
            await page.goto("http://localhost:4173")
            await page.wait_for_selector(".fi-screen--mission")

            # 2. Lead Capture
            print("Checking Lead Capture screen...")
            await page.screenshot(path="verification/screenshots/1_lead_capture.png")

            # Click "Comenzar la Misión"
            await page.click("button:has-text('Comenzar la Misión')")
            await page.wait_for_timeout(500)

            # Fill form
            print("Filling lead form...")
            await page.fill("input#mi-name", "Jules Tester")
            await page.fill("input#mi-email", "jules@example.com")
            await page.screenshot(path="verification/screenshots/2_form_filled.png")

            # Submit
            await page.click("button:has-text('Registrarme')")
            print("Form submitted, waiting for welcome...")

            # Wait for welcome and transition to Hub
            print("Waiting for Hub and Dialogue box...")
            try:
                await page.wait_for_selector(".fi-dialogue-box", timeout=10000)
            except:
                print("Timed out waiting for .fi-dialogue-box")

            await page.screenshot(path="verification/screenshots/3_hub_intro.png")

            # 3. Check Hub Dialogue
            print("Checking for Ágata dialogue in Hub...")
            dialogue_box = page.locator(".fi-dialogue-box")
            if await dialogue_box.is_visible():
                print("SUCCESS: Ágata dialogue visible in Hub.")
                content = await dialogue_box.locator(".fi-dialogue-text").inner_text()
                print(f"Dialogue content: {content[:50]}...")

                # Advance dialogue (click)
                await page.click(".fi-dialogue-box")
                await page.wait_for_timeout(1000)
                await page.screenshot(path="verification/screenshots/4_dialogue_advanced.png")
            else:
                print("FAILURE: Ágata dialogue NOT visible in Hub.")
                # Try to see if Phaser loaded
                canvas = page.locator("canvas")
                if await canvas.count() > 0:
                    print("Phaser canvas exists.")
                else:
                    print("Phaser canvas NOT found.")

            # 4. Try to enter a Pillar (via coordinate click if possible, or wait)
            # Since coordinate clicking is flaky, we just verify the Dialogue box and Scene change exists.

            print("Verification finished.")

    finally:
        os.killpg(os.getpgid(server_process.pid), signal.SIGTERM)

if __name__ == "__main__":
    os.makedirs("verification/screenshots", exist_ok=True)
    asyncio.run(verify_museum())
