import { withAuth } from "@/lib/auth";
import { DataItem, db } from "@/lib/db";
import { ApiError } from "@/lib/error";
import { NextResponse } from "next/server";
import { z } from "zod";

export const GET = withAuth(async ({ params }) => {
  const id = z.string().parse((await params).id);

  const data = db.getById(parseInt(id));

  if (!data) {
    throw new ApiError({
      code: "bad_request",
      message: "Data not found",
    });
  }

  return NextResponse.json(data satisfies GetDetailPayloadType);
});

export type GetDetailPayloadType = DataItem;
