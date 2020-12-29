import flagpole from "flagpole";

const suite = flagpole("Basic Smoke Test of Site");

suite
  .scenario("Homepage Loads", "html")
  .open("/")
  .next(async (context) => {
    const divTag = await context.exists("div");
  });
