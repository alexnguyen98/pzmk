import { withAuth } from "@/lib/auth";
import { ZOOM_THRESHOLD } from "@/lib/const";
import { DataItem, db } from "@/lib/db";
import { parseReqBody } from "@/lib/request";
import { NextResponse } from "next/server";
import { z } from "zod";

export const POST = withAuth(async ({ req }) => {
  const body = schema.parse(await parseReqBody(req));

  const points: PostMapPayloadType["points"] = [];
  const polygons: PostMapPayloadType["polygons"] = [];

  const data = db.getAll();

  for (const item of data) {
    // Show clusters
    if (body.zoom < ZOOM_THRESHOLD) {
      points.push({
        id: item.kn_id,
        geojson: item.def_point,
      });
      // Show polygons
    } else {
      polygons.push({
        id: item.kn_id,
        geojson: item.coordinates,
      });
    }
  }

  return NextResponse.json({
    points,
    polygons,
  } satisfies PostMapPayloadType);
});

const schema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  zoom: z.number().min(0).max(24),
});
export type PostMapBodyType = z.infer<typeof schema>;
export type PostMapPayloadType = {
  points: {
    id: number;
    geojson: DataItem["coordinates"];
  }[];
  polygons: {
    id: number;
    geojson: DataItem["coordinates"];
  }[];
};
