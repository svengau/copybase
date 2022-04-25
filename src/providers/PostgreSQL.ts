import BaseProvider, { ExitCode, IBaseProvider } from "./BaseProvider";

export default class PostgreSQL extends BaseProvider {
  constructor(config: any) {
    super({ port: 5432, ...config });
  }

  public async dump(outputFile: string): Promise<ExitCode> {
    await this.checkCommandExists("pg_dump", ["--version"]);

    const { database, hostname, port, username, password } = this.config;
    this.logInfo(`Dump ${database}`);
    return this.execCommand(
      "pg_dump",
      [
        "--clean",
        "--no-acl",
        port ? `--port=${port}` : "",
        username ? `--username=${username}` : "",
        hostname ? `--host=${hostname}` : "",
        `-d ${database}`,
        `-f ${outputFile}`,
      ],
      { env: { PGPASSWORD: password } }
    );
  }

  public async restore(inputFile: string) {
    await this.checkCommandExists("psql", ["--version"]);

    const { database, hostname, port, username, password } = this.config;
    this.logInfo(`Restore ${database}`);
    return this.execCommand(
      "psql",
      [
        "--echo-errors",
        "--quiet",
        port ? `--port=${port}` : "",
        username ? `--username=${username}` : "",
        hostname ? `--host=${hostname}` : "",
        `-d ${database}`,
        `-f ${inputFile}`,
        `> /dev/null`,
      ],
      { env: { PGPASSWORD: password } }
    );
  }

  public async listTables() {
    await this.checkCommandExists("psql", ["--version"]);

    const { database, hostname, port, username, password } = this.config;
    return this.execCommand(
      "psql",
      [
        port ? `--port=${port}` : "",
        username ? `--username=${username}` : "",
        hostname ? `--host=${hostname}` : "",
        `--command="SELECT * FROM pg_catalog.pg_tables;"`,
      ],
      { env: { PGPASSWORD: password } }
    );
  }
}
