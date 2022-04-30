import BaseProvider, { ExitCode, IBaseProvider } from "./BaseProvider";

export default class MySQL extends BaseProvider {
  constructor(config: any) {
    super({ port: 3306, ...config });
  }

  public async dump(outputFile: string): Promise<ExitCode> {
    await this.checkCommandExists("mysqldump", ["--version"]);

    const {
      database,
      hostname,
      port,
      username,
      password,
      mysqldump: mysqldumpOptions,
    } = this.config;

    const customOptions = this.getCustomOptions(mysqldumpOptions);

    this.logInfo(`Dump ${database}`);
    return this.execCommand("mysqldump", [
      port ? `--port=${port}` : "",
      username ? `--user=${username}` : "",
      password ? `--password=${password}` : "",
      hostname ? `--host=${hostname}` : "",
      database,
      ...customOptions,
      `>${outputFile}`,
    ]);
  }

  public async restore(inputFile: string) {
    await this.checkCommandExists("mysql", ["--version"]);

    const {
      database,
      hostname,
      port,
      username,
      password,
      mysql: mysqlOptions,
    } = this.config;

    const customOptions = this.getCustomOptions(mysqlOptions);

    this.logInfo(`Restore ${database}`);
    return this.execCommand("mysql", [
      port ? `--port=${port}` : "",
      username ? `--user=${username}` : "",
      password ? `--password=${password}` : "",
      hostname ? `--host=${hostname}` : "",
      ...customOptions,
      database,
      `<${inputFile}`,
    ]);
  }

  public async listTables() {
    await this.checkCommandExists("mysql", ["--version"]);

    const {
      database,
      hostname,
      port,
      username,
      password,
      mysql: mysqlOptions,
    } = this.config;

    const customOptions = this.getCustomOptions(mysqlOptions);

    return this.execCommand(
      "mysql",
      [
        port ? `--port=${port}` : "",
        username ? `--user=${username}` : "",
        password ? `--password=${password}` : "",
        hostname ? `--host=${hostname}` : "",
        ...customOptions,
        `--execute=SHOW TABLES FROM ${database};`,
      ],
      { env: { MYSQL_PWD: password } }
    );
  }
}
