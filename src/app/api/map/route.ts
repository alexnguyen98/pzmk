import { withAuth } from "@/lib/auth";
import { DataItem, db } from "@/lib/db";
import { parseReqBody } from "@/lib/request";
import { NextResponse } from "next/server";
import { z } from "zod";

export const POST = withAuth(async ({ req }) => {
  const body = schema.parse(await parseReqBody(req));

  const data = db.getAll();

  return NextResponse.json(data);
});

const schema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  zoom: z.number().min(0).max(24),
});
export type PostMapBodyType = z.infer<typeof schema>;
export type PostMapBodyPayloadType = DataItem[];
