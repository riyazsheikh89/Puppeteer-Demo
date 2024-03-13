const puppeteer = require("puppeteer");
require("dotenv").config();

const scrapeLogic = async (res) => {
  const browser = await puppeteer.launch({
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });
  try {
    const page = await browser.newPage();

    await page.goto("https://www.binance.com", {
      waitUntil: "networkidle2",
    });
    await page.pdf({ path: "hn.pdf", format: "a4" });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

    // Print the full title
    // const logStatement = `The title of this blog post is ${fullTitle}`;
    console.log("SUccess!");
    res.send(pdfBuffer);
  } catch (e) {
    console.error(e);
    res.send(`Something went wrong while running Puppeteer: ${e}`);
  } finally {
    await browser.close();
  }
};

module.exports = { scrapeLogic };
