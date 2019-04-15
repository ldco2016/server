const puppeteer = require("puppeteer");
const session = require("./factories/sessionFactory");

let browser, page;

beforeEach(async () => {
  browser = await puppeteer.launch({
    headless: false
  });
  page = await browser.newPage();
  await page.goto("localhost:3000");
});

afterEach(async () => {
  await browser.close();
});

test("The header has the correct text", async () => {
  const text = await page.$eval("a.brand-logo", el => el.innerHTML);

  expect(text).toEqual("SurveyMail");
});

test("clicking login starts oauth flow", async () => {
  await page.click(".right a", el => el.innerHTML);

  const url = await page.url();

  expect(url).toMatch(/accounts\.google\.com/);
});

test("when signed in shows logout button", async () => {
  const { session, sig } = sessionFactory();

  await page.setCookie({ name: "session", value: session });
  await page.setCookie({ name: "session.sig", value: sig });
  await page.goto("localhost:3000");
  await page.waitFor('a[href="/api/logout"]');

  const text = await page.$eval('a[href="/api/logout"]', el => el.innerHTML);

  expect(text).toEqual("Logout");
});
