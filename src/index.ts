/** @format */

import express from "express";
import puppeteer, { Browser, Page } from "puppeteer";
import {
  DIALOG_ROUTER,
  HUTCH_ROUTER,
  DIALOG_ROUTER_PASSWORD,
  DIALOG_ROUTER_USER_NAME,
  HUTCH_ROUTER_PASSWORD,
  HUTCH_ROUTER_USER_NAME,
  BROWSER_ENDPOINT,
} from "./config";

const IS_PRODUCTION = true; // process.env.NODE_ENV === "production";
const browserWSEndpoint = BROWSER_ENDPOINT;
const dialog_router = DIALOG_ROUTER;
const hutch_router = HUTCH_ROUTER;

const dialog_usr = DIALOG_ROUTER_USER_NAME;
const dialog_password = DIALOG_ROUTER_PASSWORD;

const hutch_usr = HUTCH_ROUTER_USER_NAME;
const hutch_password = HUTCH_ROUTER_PASSWORD;

const app = express();

const getBrowser = async (): Promise<Browser> =>
  IS_PRODUCTION ? puppeteer.connect({ browserWSEndpoint }) : puppeteer.launch();

async function isLoggedIn(page: Page): Promise<boolean> {
  try {
    await page.waitForSelector(
      `a#logoutlink.margin-right-10[data-trans="logout"][data-bind*="logout"]`,
      {
        visible: true,
        timeout: 10000,
      }
    );
    return true;
  } catch {
    return false;
  }
}

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

    const loggedIn = await isLoggedIn(page);

    if (!loggedIn) {
      await page.waitForSelector("a#loginlink", { visible: true });
      await page.click("a#loginlink");
      await page.type("#txtUsr", dialog_usr);
      await page.type("#txtPwd", dialog_password);
      await page.click("#btnLogin");
      await page.waitForSelector(
        `a#logoutlink.margin-right-10[data-trans="logout"][data-bind*="logout"]`,
        { visible: true }
      );
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

    const loggedIn = await isLoggedIn(page);

    if (!loggedIn) {
      await page.waitForSelector("a#loginlink", { visible: true });
      await page.click("a#loginlink");
      await page.type("#txtUsr", hutch_usr);
      await page.type("#txtPwd", hutch_password);
      await page.click("#btnLogin");
      await page.waitForSelector(
        `a#logoutlink.margin-right-10[data-trans="logout"][data-bind*="logout"]`,
        { visible: true }
      );
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

    res.end("Restating hutch router ...");
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

app.get("/dns2_dialog_enable", async (req, res) => {
  let browser: Browser | null = null;

  try {
    browser = await getBrowser();
    const page = await browser.newPage();
    await page.setViewport({
      width: 1280,
      height: 800,
    });
    await page.goto(dialog_router, { waitUntil: "networkidle2" });

    const loggedIn = await isLoggedIn(page);

    if (!loggedIn) {
      await page.waitForSelector("a#loginlink", { visible: true });
      await page.click("a#loginlink");
      await page.type("#txtUsr", dialog_usr);
      await page.type("#txtPwd", dialog_password);
      await page.click("#btnLogin");
      await page.waitForSelector(
        `a#logoutlink.margin-right-10[data-trans="logout"][data-bind*="logout"]`,
        { visible: true }
      );
    }

    await page.waitForSelector("a[onclick=\"tosms('#device_settings')\"]", {
      visible: true,
    });
    await page.click("a[onclick=\"tosms('#device_settings')\"]");

    await page.waitForSelector('a[data-trans="advance_settings"]', {
      visible: true,
    });

    await page.click('a[data-trans="advance_settings"]');

    await page.waitForSelector("div.row.form-group.is_show_dhcp_dns2");

    await page.click(
      'div.row.form-group.is_show_dhcp_dns2 input[name="dhcpServerDns"][value="1"]'
    );

    await page.click('input.btn.btn-primary[value="Apply"]');

    await page.waitForSelector("input#yesbtn");

    await page.click("input#yesbtn");

    res.end("Restating dialog router ...");

    // const screenshot = await page.screenshot();
    // res.end(screenshot, "binary");
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

app.get("/dns2_dialog_disable", async (req, res) => {
  let browser: Browser | null = null;

  try {
    browser = await getBrowser();
    const page = await browser.newPage();
    await page.setViewport({
      width: 1280,
      height: 800,
    });
    await page.goto(dialog_router, { waitUntil: "networkidle2" });

    const loggedIn = await isLoggedIn(page);

    if (!loggedIn) {
      await page.waitForSelector("a#loginlink", { visible: true });
      await page.click("a#loginlink");
      await page.type("#txtUsr", dialog_usr);
      await page.type("#txtPwd", dialog_password);
      await page.click("#btnLogin");
      await page.waitForSelector(
        `a#logoutlink.margin-right-10[data-trans="logout"][data-bind*="logout"]`,
        { visible: true }
      );
    }

    await page.waitForSelector("a[onclick=\"tosms('#device_settings')\"]", {
      visible: true,
    });
    await page.click("a[onclick=\"tosms('#device_settings')\"]");

    await page.waitForSelector('a[data-trans="advance_settings"]', {
      visible: true,
    });

    await page.click('a[data-trans="advance_settings"]');

    await page.waitForSelector("div.row.form-group.is_show_dhcp_dns2");

    await page.click(
      'div.row.form-group.is_show_dhcp_dns2 input[name="dhcpServerDns"][value="0"]'
    );

    await page.click('input.btn.btn-primary[value="Apply"]');

    await page.waitForSelector("input#yesbtn");

    await page.click("input#yesbtn");

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

app.listen(3223, () => console.log("Listening on PORT: http://localhost:3223"));
