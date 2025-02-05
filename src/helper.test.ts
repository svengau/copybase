import BaseProvider from "./providers/BaseProvider";

import {
  backup,
  copy,
  listTables,
  loadConfig,
  CliOptions,
  CopybaseConfig,
} from "./helper";

const moduleName = "copybase";
const config = loadConfig(moduleName) as CopybaseConfig;

const mockExecCommand = jest.fn((cmd: string, args: string[], _options?: any) =>
  Promise.resolve(0)
);

// MONGODB
const mongodumpVersion = ["mongodump", ["--version"], { quiet: true }];
const mongorestoreVersion = ["mongorestore", ["--version"], { quiet: true }];
const mv = ["mv", [expect.anything(), expect.anything()]];
const rm = ["rm", ["-rf", expect.anything()]];
const mongoDump1 = [
  "mongodump",
  [
    "--quiet",
    "--port=27018",
    "--username=root",
    "--password=password",
    "--host=127.0.0.1",
    "--db=demo",
    expect.anything(), // --out=/var/folders/8q/fzn0b8r51tz6hdsw6pfqz41h0000gn/T/mongodb1
    "--authenticationDatabase=admin",
    "--excludeCollection=passwords",
  ],
];
const mongorestore2 = [
  "mongorestore",
  [
    "--drop",
    "--quiet",
    "'mongodb://root:password@localhost:27018/demo'",
    expect.anything(),
    "--authenticationDatabase=admin",
  ],
];

// POSTGRE
const pgDumpVersion = ["pg_dump", ["--version"], { quiet: true }];
const psqlVersion = ["psql", ["--version"], { quiet: true }];
const pgDump1 = [
  "pg_dump",
  [
    "--clean",
    "--no-acl",
    "--port=54321",
    "--username=demo",
    "--host=127.0.0.1",
    "--dbname=demo",
    expect.anything(), // --file=/var/folders/8q/fzn0b8r51tz6hdsw6pfqz41h0000gn/T/postgre1
    "--no-owner",
    "--exclude-table=users",
    "--exclude-table=tokens",
  ],
  { env: { PGPASSWORD: "password" } },
];
const psqlRestore2 = [
  "psql",
  [
    "--echo-errors",
    "--quiet",
    "--port=54322",
    "--username=demo",
    "--host=localhost",
    "--dbname=demo",
    expect.anything(),
    "> /dev/null",
  ],
  { env: { PGPASSWORD: "password" } },
];

// MYSQL
const mysqldumpVersion = ["mysqldump", ["--version"], { quiet: true }];
const mysqlVersion = ["mysql", ["--version"], { quiet: true }];
const mysqlDump1 = [
  "mysqldump",
  [
    "--port=33061",
    "--user=demo",
    "--password=password",
    "--host=127.0.0.1",
    "demo",
    expect.anything(), // --out=/var/folders/8q/fzn0b8r51tz6hdsw6pfqz41h0000gn/T/mongodb1
  ],
];
const mysqlrestore2 = [
  "mysql",
  [
    "--port=33062",
    "--user=demo",
    "--password=password",
    "--host=127.0.0.1",
    "demo",
    expect.anything(),
  ],
];

describe("Test Helper", () => {
  describe("Mongodb", () => {
    beforeAll(() => {
      jest
        .spyOn(BaseProvider.prototype, "execCommand")
        .mockImplementation(mockExecCommand);
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    test("should backup", async () => {
      await backup(config, { database: "mongodb1" });
      expect(mockExecCommand).toHaveBeenCalledTimes(4);
      expect(mockExecCommand).toHaveBeenNthCalledWith(1, ...mongodumpVersion);
      expect(mockExecCommand).toHaveBeenNthCalledWith(2, ...mongoDump1);
      expect(mockExecCommand).toHaveBeenNthCalledWith(3, ...mv);
      expect(mockExecCommand).toHaveBeenNthCalledWith(4, ...rm);
    });

    test("should copy", async () => {
      await copy(config, { fromDatabase: "mongodb1", toDatabase: "mongodb2" });

      expect(mockExecCommand).toHaveBeenCalledTimes(6);
      expect(mockExecCommand).toHaveBeenNthCalledWith(1, ...mongodumpVersion);
      expect(mockExecCommand).toHaveBeenNthCalledWith(2, ...mongoDump1);
      expect(mockExecCommand).toHaveBeenNthCalledWith(3, ...mv);
      expect(mockExecCommand).toHaveBeenNthCalledWith(4, ...rm);
      expect(mockExecCommand).toHaveBeenNthCalledWith(
        5,
        ...mongorestoreVersion
      );
      expect(mockExecCommand).toHaveBeenNthCalledWith(6, ...mongorestore2);
    });
  });

  describe("PostgreSQL", () => {
    beforeAll(() => {
      jest
        .spyOn(BaseProvider.prototype, "execCommand")
        .mockImplementation(mockExecCommand);
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    test("should backup", async () => {
      await backup(config, { database: "postgres1" });
      expect(mockExecCommand).toHaveBeenCalledTimes(2);
      expect(mockExecCommand).toHaveBeenNthCalledWith(1, ...pgDumpVersion);
      expect(mockExecCommand).toHaveBeenNthCalledWith(2, ...pgDump1);
    });

    test("should copy", async () => {
      await copy(config, {
        fromDatabase: "postgres1",
        toDatabase: "postgres2",
      });

      expect(mockExecCommand).toHaveBeenCalledTimes(4);
      expect(mockExecCommand).toHaveBeenNthCalledWith(1, ...pgDumpVersion);
      expect(mockExecCommand).toHaveBeenNthCalledWith(2, ...pgDump1);
      expect(mockExecCommand).toHaveBeenNthCalledWith(3, ...psqlVersion);
      expect(mockExecCommand).toHaveBeenNthCalledWith(4, ...psqlRestore2);
    });
  });

  describe("MySQL", () => {
    beforeAll(() => {
      jest
        .spyOn(BaseProvider.prototype, "execCommand")
        .mockImplementation(mockExecCommand);
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    test("should backup", async () => {
      await backup(config, { database: "mariadb1" });
      expect(mockExecCommand).toHaveBeenCalledTimes(2);
      expect(mockExecCommand).toHaveBeenNthCalledWith(1, ...mysqldumpVersion);
      expect(mockExecCommand).toHaveBeenNthCalledWith(2, ...mysqlDump1);
    });

    test("should copy", async () => {
      await copy(config, {
        fromDatabase: "mariadb1",
        toDatabase: "mariadb2",
      });

      expect(mockExecCommand).toHaveBeenCalledTimes(4);
      expect(mockExecCommand).toHaveBeenNthCalledWith(1, ...mysqldumpVersion);
      expect(mockExecCommand).toHaveBeenNthCalledWith(2, ...mysqlDump1);
      expect(mockExecCommand).toHaveBeenNthCalledWith(3, ...mysqlVersion);
      expect(mockExecCommand).toHaveBeenNthCalledWith(4, ...mysqlrestore2);
    });
  });
});
