// pages/api/proxy/[...path].js

import { NextRequest } from "next/server";

async function handle(
  req: NextRequest,
  { params }: { params: { path: string[] } },
) {
  const [protocol, ...subpath] = params.path;
  const url = `${
    process.env.API_URL ??
    "http://chatbot-alb-1653663846.us-east-1.elb.amazonaws.com:9988"
  }/${subpath.join("/")}`;

  const options = {
    method: req.method,
    headers: req.headers,
    body: req.method === "POST" ? req.body : null,
  };

  const response = await fetch(url, options);
  return response;
}

export const POST = handle;
export const GET = handle;
export const OPTIONS = handle;

export const runtime = "nodejs";
