import BaseProvider, { ExitCode, IBaseProvider } from "./BaseProvider";

export default class PostgreSQL extends BaseProvider {
  constructor(config: any) {
    super({ port: 5432, ...config });
  }

  public async dump(outputFile: string): Promise<ExitCode> {
    await this.checkCommandExists("pg_dump", ["--version"]);

    const {
      database,
      hostname,
      port,
      username,
      password,
      pg_dump: pdDumpOptions,
    } = this.config;

    const customOptions = this.getCustomOptions(pdDumpOptions);

    this.logInfo(`Dump ${database}`);
    return this.execCommand(
      "pg_dump",
      [
        "--clean",
        "--no-acl",
        port ? `--port=${port}` : "",
        username ? `--username=${username}` : "",
        hostname ? `--host=${hostname}` : "",
        `--dbname=${database}`,
        `--file=${outputFile}`,
        ...customOptions,
      ],
      { env: { PGPASSWORD: password } }
    );
  }

  public async restore(inputFile: string) {
    await this.checkCommandExists("psql", ["--version"]);

    const {
      database,
      hostname,
      port,
      username,
      password,
      psql: psqlOptions,
    } = this.config;

    const customOptions = this.getCustomOptions(psqlOptions);

    this.logInfo(`Restore ${database}`);
    return this.execCommand(
      "psql",
      [
        "--echo-errors",
        "--quiet",
        port ? `--port=${port}` : "",
        username ? `--username=${username}` : "",
        hostname ? `--host=${hostname}` : "",
        `--dbname=${database}`,
        `--file=${inputFile}`,
        ...customOptions,
        "> /dev/null",
      ],
      { env: { PGPASSWORD: password } }
    );
  }

  public async listTables() {
    await this.checkCommandExists("psql", ["--version"]);

    const {
      database,
      hostname,
      port,
      username,
      password,
      psql: psqlOptions,
    } = this.config;

    const customOptions = this.getCustomOptions(psqlOptions);

    return this.execCommand(
      "psql",
      [
        port ? `--port=${port}` : "",
        username ? `--username=${username}` : "",
        hostname ? `--host=${hostname}` : "",
        ...customOptions,
        `--command="SELECT * FROM pg_catalog.pg_tables;"`,
      ],
      { env: { PGPASSWORD: password } }
    );
  }
}
