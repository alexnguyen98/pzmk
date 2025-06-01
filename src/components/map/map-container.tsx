"use client";

import { Loading } from "@/components/map/loading";
import { useMapData } from "@/hooks/use-map-data";
import { MAP_STYLE } from "@/lib/const";
import maplibregl, { Map } from "maplibre-gl";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export const MapContainer = () => {
  const ref = useRef<HTMLDivElement>(null);
  const map = useRef<Map>(null);
  const router = useRouter();

  const { query, lat, lng, zoom } = useMapData();

  const handleMoveEnd = () => {
    const center = map.current!.getCenter();
    const zoom = map.current!.getZoom();

    const params = new URLSearchParams();
    params.set("lat", center.lat.toString());
    params.set("lng", center.lng.toString());
    params.set("zoom", zoom.toString());

    router.replace(`?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    // Initialize map only once
    if (map.current || !ref.current) return;

    map.current = new maplibregl.Map({
      container: ref.current,
      style: MAP_STYLE,
      center: [lng, lat],
      zoom,
    });

    map.current.on("moveend", () => {
      handleMoveEnd();
    });
  }, []);

  return (
    <div className="relative">
      {query.isLoading && <Loading />}
      <div ref={ref} className="h-svh w-full"></div>
    </div>
  );
};
