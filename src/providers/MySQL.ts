import BaseProvider, { ExitCode, IBaseProvider } from "./BaseProvider";

export default class MySQL extends BaseProvider {
  constructor(config: any) {
    super({ port: 3306, ...config });
  }

  public async dump(outputFile: string): Promise<ExitCode> {
    await this.checkCommandExists("mysqldump", ["--version"]);

    const { database, hostname, port, username, password } = this.config;
    this.logInfo(`Dump ${database}`);
    return this.execCommand("mysqldump", [
      port ? `--port=${port}` : "",
      username ? `--user=${username}` : "",
      password ? `--password=${password}` : "",
      hostname ? `--host=${hostname}` : "",
      database,
      `>${outputFile}`,
    ]);
  }

  public async restore(inputFile: string) {
    await this.checkCommandExists("mysql", ["--version"]);

    const { database, hostname, port, username, password } = this.config;
    this.logInfo(`Restore ${database}`);
    return this.execCommand("mysql", [
      port ? `--port=${port}` : "",
      username ? `--user=${username}` : "",
      password ? `--password=${password}` : "",
      hostname ? `--host=${hostname}` : "",
      database,
      `<${inputFile}`,
    ]);
  }

  public async listTables() {
    await this.checkCommandExists("mysql", ["--version"]);

    const { database, hostname, port, username, password } = this.config;
    return this.execCommand(
      "mysql",
      [
        port ? `--port=${port}` : "",
        username ? `--user=${username}` : "",
        hostname ? `--host=${hostname}` : "",
        `--execute=SHOW TABLES FROM ${database};`,
      ],
      { env: { MYSQL_PWD: password } }
    );
  }
}
