import md5 from "spark-md5";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      OPENAI_API_KEY?: string;
      CODE?: string;
      BASE_URL?: string;
      PROXY_URL?: string;
      VERCEL?: string;
      HIDE_USER_API_KEY?: string; // disable user's api key input
      DISABLE_GPT4?: string; // allow user to use gpt-4 or not
      BUILD_MODE?: "standalone" | "export";
      BUILD_APP?: string; // is building desktop app
      HIDE_BALANCE_QUERY?: string; // allow user to query balance or not
      API_URL?: string;
      API_KEY?: string;
      MODEL?: string;
      EMBEDDING_MODEL?: string;
      UPLOAD_URL?: string;
      ACCESS_KEY?: string;
      SECRET_KEY?: string;
      AWS_REGION?: string;
      S3_BUCKET?: string;
    }
  }
}

const ACCESS_CODES = (function getAccessCodes(): Set<string> {
  const code = process.env.CODE;

  try {
    const codes = (code?.split(",") ?? [])
      .filter((v) => !!v)
      .map((v) => md5.hash(v.trim()));
    return new Set(codes);
  } catch (e) {
    return new Set();
  }
})();

export const getServerSideConfig = () => {
  if (typeof process === "undefined") {
    throw Error(
      "[Server Config] you are importing a nodejs-only module outside of nodejs",
    );
  }

  return {
    apiKey: process.env.OPENAI_API_KEY,
    code: process.env.CODE,
    codes: ACCESS_CODES,
    needCode: ACCESS_CODES.size > 0,
    baseUrl: process.env.BASE_URL,
    proxyUrl: process.env.PROXY_URL,
    isVercel: !!process.env.VERCEL,
    hideUserApiKey: !!process.env.HIDE_USER_API_KEY,
    disableGPT4: !!process.env.DISABLE_GPT4,
    hideBalanceQuery: !!process.env.HIDE_BALANCE_QUERY,
    API_URL:
      process.env.API_URL ??
      "http://chatbot-alb-1653663846.us-east-1.elb.amazonaws.com:9988/aws_completions",
    API_KEY:
      process.env.API_KEY ??
      "https://rzp4stkn16.execute-api.us-east-2.amazonaws.com/prod/",
    MODEL: process.env.MODEL ?? "chatglm",
    EMBEDDING_MODEL:
      process.env.EMBEDDING_MODEL ??
      "191406342344-23-10-13-06-50-04-embedding-endpoint",
    UPLOAD_URL:
      process.env.UPLOAD_URL ??
      "http://chatbot-alb-1653663846.us-east-1.elb.amazonaws.com:9988/upload_doc",
    ACCESS_KEY: process.env.ACCESS_KEY ?? "AKIA2G4UHHBFAAOCCPXH",
    SECRET_KEY:
      process.env.SECRET_KEY ?? "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",
    AWS_REGION: process.env.AWS_REGION ?? "cn-north-1",
    S3_BUCKET: process.env.S3_BUCKET ?? "191406342344-23-10-13-06-50-04-bucket",
  };
};
