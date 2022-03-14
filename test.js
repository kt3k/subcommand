const path = require("path");
const test = require("tape");
const logger = require("./test/fixture/logger");
const fixtureMinirocket = require("./test/fixture/minirocket");
const dir = path.join(__dirname, "test", "fixture");

test("it throws if the first arg is not a string", (t) => {
  t.plan(1);
  t.throws(() => {
    fixtureMinirocket(1, { foo: true, bar: false }, () => {});
  });
});

test("it calls the callback with the action of the first truthy key", (t) => {
  t.plan(1);

  logger.log = (msg) => {
    t.equal(msg, "Hello, John!");
  };

  fixtureMinirocket(
    dir,
    { foo: false, bar: true },
    (action) => action({ name: "John" }),
  );
});

test("it throws if the action definition is not an object", (t) => {
  t.plan(1);

  t.throws(() => {
    fixtureMinirocket(dir, "", () => {});
  });
});

test("it throws if any of the action definition is not selected", (t) => {
  t.plan(1);

  t.throws(() => {
    fixtureMinirocket(dir, { foo: false, bar: false }, () => {});
  });
});

test("it emits `no-action` event if the given selected action is not available in actions directory", (t) => {
  t.plan(1);

  const minirocket = fixtureMinirocket(
    dir,
    { foo: false, bar: false, spam: true },
    () => {},
  );

  minirocket.on("no-action", (action) => {
    t.equal(action, "spam");
  });
});

test("`options` parameter can be null", (t) => {
  t.plan(1);

  fixtureMinirocket(dir, { foo: true }, null, () => {
    t.ok(true);
  });
});
