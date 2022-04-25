import { parseDatabaseUri } from "./util";

describe("test parseDatabaseUri", () => {
  test("mongodb", () => {
    expect(
      parseDatabaseUri("mongodb://root:password@localhost:27017/demo")
    ).toMatchObject({
      hostname: "localhost",
      password: "password",
      protocol: "mongodb",
      username: "root",
      database: "demo",
    });

    expect(
      parseDatabaseUri(
        "mongodb+srv://root:password@localhost:27017/demo?retryWrites=true&w=majority"
      )
    ).toMatchObject({
      hostname: "localhost",
      password: "password",
      protocol: "mongodb+srv",
      username: "root",
      database: "demo",
      params: { retryWrites: "true", w: "majority" },
    });
  });

  test("postgresql", () => {
    expect(
      parseDatabaseUri("postgresql://root:password@localhost:54322/demo")
    ).toMatchObject({
      hostname: "localhost",
      password: "password",
      protocol: "postgresql",
      database: "demo",
      username: "root",
    });
  });
});
