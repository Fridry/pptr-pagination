const puppeteer = require("puppeteer");

const extractPost = async (url, browser) => {
  const page = await browser.newPage();

  await page.goto(url);
  console.log("url -> ", url);

  await page.waitForSelector("div.content-area");

  // Scrape the data
  const posts = await page.$$eval("main#main > article", (items) => {
    const postsList = [];

    items.map((post) => {
      const title = post.querySelector("h2.entry-title").innerText;

      postsList.push(title);
    });

    return postsList;
  });

  await page.close();

  // Stop recursion?
  if (posts.length < 1) {
    console.log(`End recursion on: ${url}`);
    return posts;
  } else {
    // Next URL
    const nextPageNumber = parseInt(url.split("/")[4], 10) + 1;

    const nextPage = `https://www.keroseed.com/page/${nextPageNumber}`;

    return posts.concat(await extractPost(nextPage, browser));
  }
};

const run = async () => {
  const browser = await puppeteer.launch();

  const url = "https://www.keroseed.com/page/65";

  const getPosts = await extractPost(url, browser);

  console.log(getPosts);

  await browser.close();
};

run();
