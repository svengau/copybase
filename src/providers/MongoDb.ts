import path from "path";

import BaseProvider, { ExitCode } from "./BaseProvider";

export default class MongoDb extends BaseProvider {
  constructor(config: any) {
    super({ port: 27017, ...config });
  }

  public async dump(outputFolder: string): Promise<ExitCode> {
    await this.checkCommandExists("mongodump", ["--version"]);

    const {
      hostname,
      port,
      uri,
      username,
      password,
      mongodump: mongodumpOptions,
    } = this.config;
    const customOptions = this.getCustomOptions(mongodumpOptions);
    let { database } = this.config;

    this.logInfo(`Dump ${database} from ${hostname || uri}`);
    const exitCode = await this.execCommand(
      "mongodump",
      [
        this.config.verbose ? "" : "--quiet",
        port && !uri ? `--port=${port}` : "",
        username && !uri ? `--username=${username}` : "",
        password && !uri ? `--password=${password}` : "",
        hostname && !uri ? `--host=${hostname}` : "",
        uri ? `--uri='${uri}'` : `--db=${database}`,
        ` --out=${outputFolder}`,
        ...customOptions,
      ].filter((o) => o)
    );

    if (exitCode === 0 && database) {
      // mongodump stores the files into a folder having the same name than the database
      await this.execCommand("mv", [
        path.join(outputFolder, database, "*"),
        outputFolder,
      ]);
      await this.execCommand("rm", ["-rf", path.join(outputFolder, database)]);
    }

    return exitCode;
  }

  public async restore(inputFolder: string) {
    await this.checkCommandExists("mongorestore", ["--version"]);

    const {
      database,
      hostname,
      port,
      uri,
      username,
      password,
      mongorestore: mongorestoreOptions,
    } = this.config;
    const customOptions = this.getCustomOptions(mongorestoreOptions);

    this.logInfo(`Restore ${database} on ${hostname || uri}`);
    return this.execCommand(
      "mongorestore",
      [
        "--drop",
        this.config.verbose ? "" : "--quiet",
        username && !uri ? `--username=${username}` : "",
        password && !uri ? `--password=${password}` : "",
        hostname && !uri ? `--host=${hostname}` : "",
        port && !uri ? `--port=${port}` : "",
        uri ? `'${uri}'` : ` --db=${database}`,
        inputFolder,
        ...customOptions,
      ].filter((o) => o)
    );
  }

  public async listTables() {
    await this.checkCommandExists("mongo", ["--version"]);

    const {
      database,
      hostname,
      port,
      uri,
      username,
      password,
      mongo: mongoOptions,
    } = this.config;
    const customOptions = this.getCustomOptions(mongoOptions);
    return this.execCommand(
      "mongo",
      [
        port && !uri ? `--port=${port}` : "",
        username && !uri ? `--username=${username}` : "",
        password && !uri ? `--password=${password}` : "",
        hostname && !uri ? `--host=${hostname}` : "",
        `--eval='printjson(db.getCollectionNames())'`,
        uri ? `'${uri}'` : database,
        ...customOptions,
      ].filter((o) => o)
    );
  }
}
