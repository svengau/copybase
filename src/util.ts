export function parseDatabaseUri(uri: string) {
  try {
    const url = new URL(uri);
    return {
      hostname: url.hostname,
      password: url.password,
      username: url.username,
      protocol: url.protocol?.replace(":", ""),
      database: url.pathname?.replace("/", ""),
      port: url.port,
      params: Object.fromEntries(url.searchParams),
    };
  } catch (err) {
    return null;
  }
}
