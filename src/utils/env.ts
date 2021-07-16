export type AppEnv = "prod" | "dev" | "staging";

export const getAppEnv = (): AppEnv => {
  const env = process.env.NODE_ENV;
  if (!env) {
    return "prod";
  }

  switch (env) {
    case "production":
      return "prod";
    case "staging":
      return "staging";
    case "development":
      return "dev";
    default:
      return "prod";
  }
};
