import { getServerSideConfig } from "@/app/config/server";

const _defaultConfig = {
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
const getConfig: () => Record<keyof typeof _defaultConfig, any> = () => {
  const defaultConfig = getServerSideConfig();

  return Object.keys(defaultConfig).reduce((previousValue, currentValue) => {
    if (localStorage.getItem(currentValue)) {
      return {
        ...previousValue,
        [currentValue]: localStorage.getItem(currentValue),
      };
    }
    return previousValue;
  }, defaultConfig);
};

export const fetchAws = async (msg: string) => {
  const config = getConfig();
  let url = config.API_URL;

  let headers = {
    Accept: "application/json, text/plain, */*",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    "Proxy-Connection": "keep-alive",
    "Content-Type": "application/json",
    api_key: config.API_KEY,
  };
  let body = {
    model: config.MODEL,
    chat_name: "default-2984524094",
    prompt: "你好",
    embedding_model: config.EMBEDDING_MODEL,
    max_tokens: 2048,
    temperature: 0.9,
    frequency_penalty: 0,
    presence_penalty: 0,
    stop: ["nAI:", "nUser:"],
  };
  try {
    if (!msg) return "";
    let response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        ...body,
        prompt: msg,
      }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export function readFromFile() {
  return new Promise<string>((res, rej) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";

    fileInput.onchange = (event: any) => {
      const file = event.target.files[0];
      res(file);
    };

    fileInput.click();
  });
}
export const uploadAws = async () => {
  const config = getConfig();

  const file = await readFromFile();
  let formData = new FormData();

  formData.append("file", file);

  const response = await fetch(config.UPLOAD_URL, {
    method: "POST",
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "zh-CN,zh;q=0.9",
      access_key: config.ACCESS_KEY,
      aws_region: config.AWS_REGION,
      "cache-control": "no-cache",
      s3_bucket: config.S3_BUCKET,
      secret_key: config.SECRET_KEY,
    },
    body: formData,
  });

  const result = await response.json();
  console.log(result);
};
