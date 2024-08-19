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

app.get("/api/switch_network/dialog", async (req, res) => {
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
    await page.waitForSelector("#h_connect_btn");

    await page.click("#h_connect_btn");

    res.end("Switching internet connection ...");

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

app.get("/api/switch_network/hutch", async (req, res) => {
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
    await page.waitForSelector("#h_connect_btn");

    await page.click("#h_connect_btn");

    res.end("Switching internet connection");

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

app.get("/api/status/dialog", async (req, res) => {
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
          cmd: "web_signal,ppp_status",
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

app.get("/api/status/hutch", async (req, res) => {
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
        sms_received_flag: 0,
        sts_received_flag: 0,
        cmd: "web_signal,ppp_status",
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

app.get("/metrics", async (req, res) => {
  try {
    const hutchResponse = await axios.get(
      "http://192.168.8.100:3223/api/status/hutch"
    );

    const dialogResponse = await axios.get(
      "http://192.168.8.100:3223/api/status/dialog"
    );

    const hutchData = hutchResponse.data;
    const dialogData = dialogResponse.data;

    res.set("Content-Type", "text/plain");
    res.send(`
# HELP router_hutch_uplink_rate Uplink rate from Hutch
# TYPE router_hutch_uplink_rate gauge
router_hutch_uplink_rate ${hutchData.uplink_rate}

# HELP router_hutch_web_signal Signal strength from Hutch
# TYPE router_hutch_web_signal gauge
router_hutch_web_signal ${hutchData.web_signal}

# HELP router_hutch_downlink_rate Downlink rate from Hutch
# TYPE router_hutch_downlink_rate gauge
router_hutch_downlink_rate ${hutchData.downlink_rate}

# HELP router_hutch_uplink_traffic Uplink traffic from Hutch
# TYPE router_hutch_uplink_traffic counter
router_hutch_uplink_traffic ${hutchData.uplink_traffic}

# HELP router_hutch_downlink_traffic Downlink traffic from Hutch
# TYPE router_hutch_downlink_traffic counter
router_hutch_downlink_traffic ${hutchData.downlink_traffic}

# HELP router_hutch_rsrp RSRP from Hutch
# TYPE router_hutch_rsrp gauge
router_hutch_rsrp ${hutchData.rsrp}

# HELP router_hutch_rsrq RSRQ from Hutch
# TYPE router_hutch_rsrq gauge
router_hutch_rsrq ${hutchData.rsrq}

# HELP router_hutch_sinr SINR from Hutch
# TYPE router_hutch_sinr gauge
router_hutch_sinr ${hutchData.sinr}

# HELP router_hutch_rssi RSSI from Hutch
# TYPE router_hutch_rssi gauge
router_hutch_rssi ${hutchData.rssi}

# HELP router_hutch_online_time Online time from Hutch
# TYPE router_hutch_online_time gauge
router_hutch_online_time ${hutchData.online_time}

# HELP router_dialog_uplink_rate Uplink rate from Dialog
# TYPE router_dialog_uplink_rate gauge
router_dialog_uplink_rate ${dialogData.uplink_rate}

# HELP router_dialog_web_signal Signal strength from Hutch
# TYPE router_dialog_web_signal gauge
router_dialog_web_signal ${dialogData.web_signal}

# HELP router_dialog_downlink_rate Downlink rate from Dialog
# TYPE router_dialog_downlink_rate gauge
router_dialog_downlink_rate ${dialogData.downlink_rate}

# HELP router_dialog_uplink_traffic Uplink traffic from Dialog
# TYPE router_dialog_uplink_traffic counter
router_dialog_uplink_traffic ${dialogData.uplink_traffic}

# HELP router_dialog_downlink_traffic Downlink traffic from Dialog
# TYPE router_dialog_downlink_traffic counter
router_dialog_downlink_traffic ${dialogData.downlink_traffic}

# HELP router_dialog_rsrp RSRP from Dialog
# TYPE router_dialog_rsrp gauge
router_dialog_rsrp ${dialogData.rsrp}

# HELP router_dialog_rsrq RSRQ from Dialog
# TYPE router_dialog_rsrq gauge
router_dialog_rsrq ${dialogData.rsrq}

# HELP router_dialog_sinr SINR from Dialog
# TYPE router_dialog_sinr gauge
router_dialog_sinr ${dialogData.sinr}

# HELP router_dialog_rssi RSSI from Dialog
# TYPE router_dialog_rssi gauge
router_dialog_rssi ${dialogData.rssi}

# HELP router_dialog_online_time Online time from Dialog
# TYPE router_dialog_online_time gauge
router_dialog_online_time ${dialogData.online_time}`);
  } catch (error) {
    console.error("Error fetching data from /metrics", error);
    res.status(500).send("Error fetching router data");
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(3223, () => console.log("Listening on PORT: http://localhost:3223"));
