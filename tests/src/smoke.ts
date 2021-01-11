import flagpole from "flagpole";
const puppeteer = require("puppeteer");

const suite = flagpole("Basic Smoke Test of Site");

suite
  .scenario("Homepage Loads", "html")
  .open("/")
  .next(async (context) => {
    context
      .assert("HTTP Status equals 200", context.response.statusCode)
      .equals(200);
    context.response.loadTime
      .assert("Load time was less than 1 second")
      .lessThan(1000);
  });

suite
  .scenario("Homepage Loads", "html")
  .open("/login")
  .next(async (context) => {
    context
      .assert("HTTP Status equals 200", context.response.statusCode)
      .equals(200);
    context.response.loadTime
      .assert("Load time was less than 1 second")
      .lessThan(1000);
  });

suite
  .scenario("Homepage Loads", "html")
  .open("/register")
  .next(async (context) => {
    context
      .assert("HTTP Status equals 200", context.response.statusCode)
      .equals(200);
    context.response.loadTime
      .assert("Load time was less than 1 second")
      .lessThan(1000);
  });

suite
  .scenario("Homepage Loads", "html")
  .open("/posts/:postId")
  .next(async (context) => {
    context
      .assert("HTTP Status equals 200", context.response.statusCode)
      .equals(200);
    context.response.loadTime
      .assert("Load time was less than 1 second")
      .lessThan(1000);
  });

suite
  .scenario("Some Other Page Loads", "browser")
  .open("/login")
  .next(async (context) => {
    await context.type('input[name="username"]', "Cris");
    await context.type('input[name="password"]', "helloworld");
    await context.click('button[name="loginButton"]');
    await context.waitForNavigation();
    // await page.screenshot({ path: "example.png" });
    await context.screenshot("example.png");
  });
