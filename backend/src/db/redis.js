import IORedis from "ioredis";
export const connection = new IORedis({
  username: "default",
  password: process.env.REDIS_PASSWORD,
  host: "",
  port: 17153,
  ttl:{},
maxRetriesPerRequest: null,
});