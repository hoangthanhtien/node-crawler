const puppeteer = require("puppeteer");
const NewsTitle = require("../../models/crawl_news/model");
const { startSession } = require("mongoose");

exports.getCoinDeskNews = async (req, res) => {
  const { page, results_per_page } = req.query
  const total_docs = await NewsTitle.find({})
    .countDocuments()
  const total_pages = parseInt(total_docs / results_per_page)
  const data = await NewsTitle.find({})
    .skip((results_per_page * page) - results_per_page)
    .limit(results_per_page)
  res.send({ page, results_per_page, total_pages, data })
}

exports.crawlCoinDeskNews = async (req, res) => {
  const data = await crawlCoinDesk();
  let response = [];
  if (data.length > 0) {
    response = await saveNewNews(data);
  }
  res.send({ data: response });
};

const crawlCoinDesk = async () => {
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
    return elements.map((el) => ({
      title: el.innerText,
      referenceLink: el.href,
    }));
  });
  console.log("data", data);
  await browser.close();
  return data;
};

const saveNewNews = async (newsData) => {
  const session = await startSession();
  try {
    session.startTransaction();
    const newNews = [];
    newsData.forEach((data) => {
      console.log("In Loop");
      newNews.push({ title: data.title, referenceLink: data.referenceLink });
    });
    console.log("newNews", newNews);
    NewsTitle.create(newNews, { session });
    await session.commitTransaction();
    session.endSession();
    return newNews;
  } catch (error) {
    console.log("Something went wrong!", error);
    await session.abortTransaction();
    console.log("Aborted Transactions!");
  }
};
