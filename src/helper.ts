import os from "os";
import path from "path";
import fs from "fs/promises";
import { cosmiconfigSync } from "cosmiconfig";
import dayjs from "dayjs";

import providers from "./providers";
import { parseDatabaseUri } from "./util";

export interface CopybaseConfig {
  currentDir: string;
  backup: { folder: string; filenamePattern: string };
  databases: Record<
    string,
    {
      database: string;
      protocol: keyof typeof providers;
      hostname: string;
      port: number;
      user: string;
      password: string;
    }
  >;
}

export interface CliOptions {
  verbose: boolean;
}

/**
 * check databaseName exists in the provided copybase configuration
 *
 * @param databaseName
 * @param config
 * @returns
 */
function checkDatabaseConfig(databaseName: string, config: CopybaseConfig) {
  const dbConfig = config.databases[databaseName];
  const databaseNames = Object.keys(config.databases);
  const supportedDbTypes = Object.keys(providers);

  if (!dbConfig) {
    console.error(
      `Invalid database source: "${databaseName}". Must be ${databaseNames.join(
        ", "
      )}`
    );
    return false;
  }
  if (!providers[dbConfig.protocol]) {
    console.error(
      `Invalid database protocol: ${
        dbConfig.protocol
      }. Must be [${supportedDbTypes.join(", ")}]`
    );
    return false;
  }
  return true;
}

/**
 * Load copybase configuration
 *
 * @param moduleName
 * @returns
 */
export function loadConfig(moduleName: string) {
  const explorerSync = cosmiconfigSync(moduleName);
  const config = explorerSync.search();
  if (!config) {
    return null;
  }

  const databases = config.config.databases;

  Object.entries(config.config.databases).map(
    ([key, dbConfig]: [string, any]) => {
      config.config.databases[key] = {
        ...(dbConfig.uri ? parseDatabaseUri(dbConfig.uri) : {}),
        ...dbConfig,
      };
    }
  );

  return {
    currentDir: process.cwd(),
    databases,
    backup: {
      filenamePattern: "YYYYMMDDTHHmmss",
      ...config?.config.backup,
    },
  } as any as CopybaseConfig;
}

/**
 * backup a database into a given folder
 
 * @param config 
 * @param param1 
 * @param options 
 * @returns 
 */
export async function backup(
  config: CopybaseConfig,
  { database }: { database: string },
  { verbose }: CliOptions
) {
  if (!checkDatabaseConfig(database, config)) {
    return;
  }
  if (!config?.backup?.folder) {
    console.info("Please provide a backupFolder value in config");
    return;
  }

  console.info(`Backup ${database} into ${config.backup.folder}`);
  const dbConfig = config.databases[database];

  const provider = new providers[dbConfig.protocol]({ ...dbConfig, verbose });
  const outputFile = path.join(
    config.backup.folder,
    database,
    `${dayjs().format(config.backup.filenamePattern)}`
  );
  await fs.mkdir(path.dirname(outputFile), { recursive: true });

  await provider.dump(outputFile);
}

/**
 * Copy a database to another database
 *
 * @param config
 * @param param1
 * @param options
 * @returns
 */
export async function copy(
  config: CopybaseConfig,
  { fromDatabase, toDatabase }: { fromDatabase: string; toDatabase: string },
  { verbose }: CliOptions
) {
  if (!checkDatabaseConfig(fromDatabase, config)) {
    return;
  }
  if (!checkDatabaseConfig(toDatabase, config)) {
    return;
  }

  const fromConfig = config.databases[fromDatabase];
  const toConfig = config.databases[toDatabase];
  if (fromConfig.protocol !== fromConfig.protocol) {
    console.error(
      `Incompatible database protocol: ${fromConfig.protocol} !== ${toConfig.protocol}`
    );
    return;
  }

  const from = new providers[fromConfig.protocol]({ ...fromConfig, verbose });
  const to = new providers[toConfig.protocol]({ ...toConfig, verbose });

  console.info(`Copy ${fromDatabase} to ${toDatabase}`);

  const outputFile = path.join(os.tmpdir(), fromDatabase);
  const exitCode = await from.dump(outputFile);
  if (exitCode !== 0) {
    return;
  }
  await to.restore(outputFile);
}

/**
 * List all tables from a given database
 
 * @param config 
 * @param param1 
 * @param options 
 * @returns 
 */
export async function listTables(
  config: CopybaseConfig,
  { database }: { database: string },
  { verbose }: CliOptions
) {
  if (!checkDatabaseConfig(database, config)) {
    return;
  }

  console.info(`List tables on ${database}`);
  const dbConfig = config.databases[database];

  const provider = new providers[dbConfig.protocol]({ ...dbConfig, verbose });
  await provider.listTables();
}
