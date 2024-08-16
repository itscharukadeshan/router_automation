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
  BROWSER_TOKEN,
  BROWSER_LESS_ENDPOINT,
} from "./config";
import axios from "axios";
import qs from "qs";
import cors from "cors";
const path = require("path");

const IS_PRODUCTION = process.env.NODE_ENV === "production";
const browserWSEndpoint = BROWSER_ENDPOINT;
const dialog_router = DIALOG_ROUTER;
const hutch_router = HUTCH_ROUTER;

const dialog_usr = DIALOG_ROUTER_USER_NAME;
const dialog_password = DIALOG_ROUTER_PASSWORD;

const hutch_usr = HUTCH_ROUTER_USER_NAME;
const hutch_password = HUTCH_ROUTER_PASSWORD;

const app = express();

app.use(cors());

app.use(express.static(path.join(__dirname, "./dist")));

const getBrowser = async (): Promise<Browser> =>
  IS_PRODUCTION
    ? puppeteer.connect({ browserWSEndpoint })
    : puppeteer.connect({ browserWSEndpoint });

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

const delay = (ms: number | undefined) =>
  new Promise((resolve) => setTimeout(resolve, ms));

app.get("/api/restart_dialog", async (req, res) => {
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

      await delay(3000);

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

app.get("/api/legacy/restart_dialog", async (req, res) => {
  const data = `isTest=false&goformId=REBOOT_DEVICE`;
  const url = "http://192.168.8.1/goform/goform_set_cmd_process";

  try {
    await axios.post(url, data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    await delay(1);

    await axios.post(url, data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    res.status(200).json({ message: "Dialog router rebooted successfully" });
  } catch (error: any) {
    if (error.code === "ECONNRESET") {
      console.warn(
        "Dialog router reboot likely successful despite socket hang up"
      );
      res.status(200).json({
        message:
          "Dialog router reboot may have completed despite socket hang up",
      });
    } else {
      console.error("Error rebooting dialog router:", error);
      res.status(500).json({ error: "Failed to reboot dialog router" });
    }
  }
});

app.get("/api/restart_hutch", async (req, res) => {
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

      await delay(3000);

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

app.get("/api/legacy/restart_hutch", async (req, res) => {
  const data = `isTest=false&goformId=REBOOT_DEVICE`;
  const url = "http://192.168.8.2/goform/goform_set_cmd_process";

  try {
    await axios.post(url, data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
    });

    await delay(1);

    await axios.post(url, data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    res.status(200).json({ message: "Hutch router rebooted successfully" });
  } catch (error: any) {
    if (error.code === "ECONNRESET") {
      console.warn(
        "Hutch router reboot likely successful despite socket hang up"
      );
      res.status(200).json({
        message:
          "Hutch router reboot may have completed despite socket hang up",
      });
    } else {
      console.error("Error rebooting hutch router:", error);
      res.status(500).json({ error: "Failed to reboot hutch router" });
    }
  }
});

app.get("/api/dns2_dialog_enable", async (req, res) => {
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

      await delay(3000);

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

    res.end("Enabling dns_2 need to restart dialog router ...");

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

app.get("/api/dns2_dialog_disable", async (req, res) => {
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

      await delay(3000);

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

    res.end("Disabling dns_2 need to restart dialog router ...");

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

app.use("/api/status/dialog", async (req, res) => {
  try {
    const status = await axios.post(
      "http://192.168.8.1/goform/goform_get_cmd_process",
      "isTest=false&cmd=system_status",
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: "pageForward=home",
        },
      }
    );
    const signal = await axios.get(
      "http://192.168.8.1/goform/goform_get_cmd_process",
      {
        params: {
          multi_data: 1,
          isTest: false,
          cmd: "web_signal",
        },
        headers: {
          Cookie: "pageForward=home",
        },
      }
    );

    const status_data = status.data;
    const signal_data = signal.data;

    const uplink_rate = parseInt(status_data.uplink_rate, 10);
    const downlink_rate = parseInt(status_data.downlink_rate, 10);
    const uplink_traffic = parseInt(status_data.uplink_traffic, 10);
    const downlink_traffic = parseInt(status_data.downlink_traffic, 10);

    const unifiedData = {
      ...status_data,
      ...signal_data,
      uplink_rate,
      downlink_rate,
      uplink_traffic,
      downlink_traffic,
    };

    res.json(unifiedData);
  } catch (error) {
    res.status(500).json({ error: "Request failed" });
  }
});

app.use("/api/status/hutch", async (req, res) => {
  try {
    const status = await axios.post(
      "http://192.168.8.2/goform/goform_get_cmd_process",
      "isTest=false&cmd=system_status",
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Origin: "http://192.168.8.2",
          Referer: "http://192.168.8.2/index.html",
          Cookie: "pageForward=home",
        },
      }
    );
    const signal = await axios.post(
      "http://192.168.8.2/goform/goform_get_cmd_process",
      qs.stringify({
        multi_data: 1,
        isTest: false,
        cmd: "web_signal",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Origin: "http://192.168.8.2",
          Referer: "http://192.168.8.2/index.html",
          Cookie: "pageForward=home",
        },
      }
    );

    const signal_data = signal.data;
    const status_data = status.data;

    const uplink_rate = parseInt(status_data.uplink_rate, 10);
    const downlink_rate = parseInt(status_data.downlink_rate, 10);
    const uplink_traffic = parseInt(status_data.uplink_traffic, 10);
    const downlink_traffic = parseInt(status_data.downlink_traffic, 10);

    const unifiedData = {
      ...status_data,
      ...signal_data,
      uplink_rate,
      downlink_rate,
      uplink_traffic,
      downlink_traffic,
    };

    res.json(unifiedData);
  } catch (error) {
    res.status(500).json({ error: "Request failed" });
  }
});

app.get("/api/status/browserless", async (req, res) => {
  const url = `${BROWSER_LESS_ENDPOINT}/config${BROWSER_TOKEN}`;

  try {
    const config = await axios.get(url);

    res
      .status(200)
      .json({ message: `Browserless is working : ${config.status}` });
  } catch (error: any) {
    if (error) {
      console.error("Unable to reach browserless:", error);
      res.status(500).json({ error: "Unable to reach browserless" });
    }
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(3223, () => console.log("Listening on PORT: http://localhost:3223"));
