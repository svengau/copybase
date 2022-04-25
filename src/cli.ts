import { Command } from "commander";

import {
  backup,
  copy,
  listTables,
  loadConfig,
  CliOptions,
  CopybaseConfig,
} from "./helper";

const moduleName = "copybase";
const config = loadConfig(moduleName);

const program = new Command();

async function execAction(callback: any) {
  if (!config) {
    console.error(
      `Config not found. Create file .${moduleName}.(yaml|js|json)`
    );
    return;
  }

  console.time("done");
  await callback();
  console.timeEnd("done");
}

program
  .name(moduleName)
  .description("Copy quickly a database")
  .version(require("../package.json").version);

program
  .command("copy")
  .argument("<fromDatabase>", "Database to copy")
  .argument("<toDatabase>", "Destination Database")
  .option("--verbose", "Verbose mode")
  .description("Copy a database")
  .action((fromDatabase: string, toDatabase: string, options: CliOptions) =>
    execAction(() =>
      copy(config as CopybaseConfig, { fromDatabase, toDatabase }, options)
    )
  );

program
  .command("list:tables")
  .argument("<database>", "List tables")
  .option("--verbose", "Verbose mode")
  .description("List all tables in database")
  .action((database: string, options: CliOptions) =>
    execAction(() =>
      listTables(config as CopybaseConfig, { database }, options)
    )
  );

program
  .command("backup")
  .description("Backup a database")
  .argument("<database>", "Database to backup")
  .option("--verbose", "Verbose mode")
  .action((database: string, options: CliOptions) =>
    execAction(() => backup(config as CopybaseConfig, { database }, options))
  );

program.parse(process.argv);
