import { handleAndReturnErrorResponse } from "@/lib/error";
import { getSearchParams } from "@/lib/request";
import { NextRequest } from "next/server";

interface WithAuthHandlerOptions {
  req: NextRequest;
  params: Promise<Record<string, string>>;
  searchParams: Record<string, string>;
}

export interface WithAuthHandlerType {
  (options: WithAuthHandlerOptions): Promise<Response>;
}

export const withAuth = (handler: WithAuthHandlerType) => {
  return async (
    req: NextRequest,
    { params }: { params: Promise<Record<string, string>> }
  ) => {
    const searchParams = getSearchParams(req.url);

    try {
      return await handler({
        req,
        params,
        searchParams,
      });
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.log(error);
      }

      return handleAndReturnErrorResponse(error);
    }
  };
};
