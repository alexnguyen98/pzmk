import { ApiError } from "@/lib/error";
import { NextRequest } from "next/server";
import { z } from "zod";

export const getSearchParams = (url: string) => {
  // Create a params object
  let params = {} as Record<string, string>;

  new URL(url).searchParams.forEach(function (val, key) {
    params[key] = val;
  });

  return params;
};

export const parseReqBody = async (req: NextRequest) => {
  try {
    return await req.json();
  } catch (e) {
    throw new ApiError({
      code: "bad_request",
      message:
        "Invalid JSON format in request body. Please ensure the request body is a valid JSON object.",
    });
  }
};

export const uuidSchema = z.string().uuid();
