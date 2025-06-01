import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { generateErrorMessage } from "zod-error";

export type ErrorCode =
  | "bad_request"
  | "unauthorized"
  | "forbidden"
  | "not_found"
  | "rate_limit_exceeded"
  | "internal_server_error";

type ErrorResponse = {
  error: {
    code: ErrorCode;
    message: string;
  };
};

export const errorCodeToHttpStatus: Record<ErrorCode, number> = {
  bad_request: 400,
  unauthorized: 401,
  forbidden: 403,
  not_found: 404,
  rate_limit_exceeded: 429,
  internal_server_error: 500,
};

export class ApiError extends Error {
  public readonly code: ErrorCode;

  constructor({
    code,
    message,
  }: {
    code: ErrorCode;
    message: string;
    docUrl?: string;
  }) {
    super(message);
    this.code = code;
  }
}

export function handleApiError(error: any): ErrorResponse & {
  status: number;
} {
  // Zod errors
  if (error instanceof ZodError) {
    return {
      error: {
        code: "bad_request",
        message: generateErrorMessage(error.issues, {
          maxErrors: 1,
          delimiter: {
            component: ": ",
          },
          path: {
            enabled: true,
            type: "objectNotation",
            label: "",
          },
          code: {
            enabled: true,
            label: "",
          },
          message: {
            enabled: true,
            label: "",
          },
        }),
      },
      status: errorCodeToHttpStatus.bad_request,
    };
  }

  // ApiError errors
  if (error instanceof ApiError) {
    return {
      error: {
        code: error.code,
        message: error.message,
      },
      status: errorCodeToHttpStatus[error.code],
    };
  }

  // Unhandled errors are not user-facing, so we don't expose the actual error
  return {
    error: {
      code: "internal_server_error",
      message:
        "An internal server error occurred. Please contact our support if the problem persists.",
    },
    status: errorCodeToHttpStatus.internal_server_error,
  };
}

export const handleAndReturnErrorResponse = (err: unknown) => {
  const { error, status } = handleApiError(err);

  return NextResponse.json<ErrorResponse>({ error }, { status });
};
