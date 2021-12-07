const puppeteer = require("puppeteer");
const NewsTitle = require("../../models/crawl_news/model");
const { startSession } = require("mongoose");

exports.getCoinDeskNews = async (req, res) => {
  const data = await crawlFirstNews();
  res.send({ data: data });
};

const crawlFirstNews = async () => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.goto("https://www.coindesk.com", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  console.log("Went to https://www.coindesk.com");
  const data = await page.evaluate(() => {
    const elements = Array.from(document.querySelectorAll(".headline"));
    console.log("elements", elements);
    return elements.map((el) => el.innerText);
  });
  console.log("data", data);
  await browser.close();
  return data;
};

const saveNewNews = async (newsData) => {
  const session = await startSession();
  try {
    session.startTransaction();
    newsData.forEach((title) => {
      NewsTitle.create({ title: title }, { session });
    });
    await session.commitTransaction();
    session.endSession();
  } catch (error) { }
};
