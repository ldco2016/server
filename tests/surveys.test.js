const Page = require("./helpers/page");

let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto("localhost:3000");
});

afterEach(async () => {
  await page.close();
});

describe("When logged in", async () => {
  beforeEach(async () => {
    await page.login();
    await page.click("a.btn-floating");
  });

  test("can see survey create form", async () => {
    const label = await page.getContentsOf("form label");
    expect(label).toEqual("Survey Title");
  });

  describe("And using valid inputs", async () => {
    beforeEach(async () => {
      await page.type("input[name=title]", "My Title");
      await page.type("input[name=subject]", "My Subject");
      await page.type("input[name=body]", "This is the body of the email");
      await page.type("input[name=recipients]", "dancortes@protonmail.com");
      await page.click("form button.teal");
    });

    test("Submitting takes user to review screen", async () => {
      const text = await page.getContentsOf("h5");

      expect(text).toEqual("Please confirm your entries");
    });

    xtest("Submitting then saving adds survey to index page", async () => {
      await page.click("button.green");
      await page.waitFor(".card");

      const title = await page.getContentsOf("span.card-title");
      const content = await page.getContentsOf("p");

      expect(title).toEqual("My Title");
      expect(content).toEqual("This is the body of the email");
    });
  });

  describe("And using invalid inputs", async () => {
    beforeEach(async () => {
      await page.click("form button.teal");
    });

    test("the form shows an error message", async () => {
      const inputError = await page.getContentsOf(".red-text");

      expect(inputError).toEqual("You must provide a value");
    });
  });
});

describe("User is not logged in", async () => {
  const actions = [
    { method: "get", path: "/api/surveys" },
    { method: "post", path: "/api/surveys", data: { title: "T", content: "C" } }
  ];

  test("Survey related actions are prohibited", async () => {
    const results = await page.execRequests(actions);

    for (let result of results) {
      expect(result).toEqual({ error: "You must be logged in" });
    }
  });
});
