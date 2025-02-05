import chalk from "chalk";
import { spawn, SpawnOptionsWithoutStdio } from "child_process";

export type ExitCode = number;

export interface IBaseProvider {
  constructor: (config: any) => void;

  dump(outputFile: string): Promise<ExitCode>;

  restore(inputFile: string): Promise<ExitCode>;
}

abstract class BaseProvider {
  config: any;

  public constructor(config: any) {
    this.config = config;
  }

  logInfo(str: string) {
    console.info(str);
  }

  logVerbose(str: string) {
    if (this.config.verbose) console.info(str);
  }

  public abstract dump(outputFile: string): Promise<ExitCode>;

  public abstract restore(inputFile: string): Promise<ExitCode>;

  public abstract listTables(): Promise<ExitCode>;

  async execCommand(
    cmd: string,
    args: string[],
    _options?: SpawnOptionsWithoutStdio & { quiet?: boolean }
  ): Promise<ExitCode> {
    const { quiet, ...options } = _options || {};
    const cmdArgs = args.filter((o) => !!o);
    if (!quiet) {
      this.logVerbose(`exec "${chalk.yellow(`${cmd} ${cmdArgs.join(" ")}`)}"`);
    }
    const child = spawn(cmd, cmdArgs, {
      ...options,
      env: {
        ...options?.env,
        ...process.env,
      },
      shell: true,
    });

    if (!quiet) {
      child.stdout.on("data", (data: string) => process.stdout.write(data));
      child.stderr.on("data", (data: string) => process.stdout.write(data));
      child.on("error", (error: any) => process.stderr.write(error.message));
    }
    return new Promise((resolve, reject) =>
      child.on("close", (code: number) => resolve(code))
    );
  }

  async checkCommandExists(cmd: string, args: string[]) {
    const exitCode = await this.execCommand(cmd, args, { quiet: true });
    if (exitCode !== 0) {
      throw new Error(`Command ${cmd} not found`);
    }
  }

  getCustomOptions(options: Record<string, string | string[]>): string[] {
    if (!options) {
      return [];
    }
    const result: string[] = [];
    Object.entries(options).map(([key, valueOrArray]) => {
      if (key === "_raw_options") {
        result.push(valueOrArray as string);
      } else if (Array.isArray(valueOrArray)) {
        valueOrArray.forEach((value) => result.push(`--${key}=${value}`));
      } else {
        result.push(`--${key}=${valueOrArray}`);
      }
    });
    return result;
  }
}

export default BaseProvider;
