/** @format */

import express from "express";
import puppeteer, { Browser } from "puppeteer";

const IS_PRODUCTION = true; // process.env.NODE_ENV === "production";
const browserWSEndpoint = "http://192.168.8.100:3222?token=6R0W53R135510";
const dialog_router = "http://192.168.8.1";
const hutch_router = "http://192.168.8.2";
const app = express();

const getBrowser = async (): Promise<Browser> =>
  IS_PRODUCTION ? puppeteer.connect({ browserWSEndpoint }) : puppeteer.launch();

app.get("/restart_dialog", async (req, res) => {
  let browser: Browser | null = null;

  try {
    browser = await getBrowser();
    const page = await browser.newPage();
    await page.setViewport({
      width: 1280,
      height: 800,
    });
    await page.goto(dialog_router, { waitUntil: "networkidle2" });

    const isLoggedIn = (await page.$("a#logoutlink")) !== null;

    console.log(isLoggedIn);

    if (!isLoggedIn) {
      await page.waitForSelector("a#loginlink", { visible: true });
      await page.click("a#loginlink");
      await page.type("#txtUsr", "user");
      await page.type("#txtPwd", "Tj92N5D9");
      await page.click("#btnLogin");
      await page.waitForSelector("a#logoutlink", { visible: true });
    }

    await page.waitForSelector(
      'input.btn.btn-primary[data-trans="restart_button"][value="Restart Device"]',
      { visible: true }
    );
    await page.click(
      'input.btn.btn-primary[data-trans="restart_button"][value="Restart Device"]'
    );

    await page.waitForSelector("#yesbtn", { visible: true });
    await page.click("#yesbtn");

    const screenshot = await page.screenshot();
    res.end(screenshot, "binary");
  } catch (error: any) {
    if (!res.headersSent) {
      res.status(400).send(error.message);
    }
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});

app.get("/restart_hutch", async (req, res) => {
  let browser: Browser | null = null;

  try {
    browser = await getBrowser();
    const page = await browser.newPage();
    await page.setViewport({
      width: 1280,
      height: 800,
    });
    await page.goto(hutch_router, { waitUntil: "networkidle2" });

    const isLoggedIn = (await page.$("a#logoutlink")) !== null;

    console.log(isLoggedIn);

    if (!isLoggedIn) {
      await page.waitForSelector("a#loginlink", { visible: true });
      await page.click("a#loginlink");
      await page.type("#txtUsr", "admin");
      await page.type("#txtPwd", "admin");
      await page.click("#btnLogin");
      await page.waitForSelector("a#logoutlink", { visible: true });
    }

    await page.waitForSelector(
      'input.btn.btn-primary[data-trans="restart_button"][value="Restart Device"]',
      { visible: true }
    );
    await page.click(
      'input.btn.btn-primary[data-trans="restart_button"][value="Restart Device"]'
    );

    await page.waitForSelector("#yesbtn", { visible: true });
    await page.click("#yesbtn");

    const screenshot = await page.screenshot();
    res.end(screenshot, "binary");
  } catch (error: any) {
    if (!res.headersSent) {
      res.status(400).send(error.message);
    }
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});

app.listen(8080, () => console.log("Listening on PORT: http://localhost:8080"));
