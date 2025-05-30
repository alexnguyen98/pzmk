"use client";

import { MAP_STYLE } from "@/lib/const";
import maplibregl, { Map } from "maplibre-gl";
import { useEffect, useRef } from "react";

export const MapContainer = () => {
  const ref = useRef<HTMLDivElement>(null);
  const map = useRef<Map>(null);

  useEffect(() => {
    // Initialize map only once
    if (map.current || !ref.current) return;

    map.current = new maplibregl.Map({
      container: ref.current,
      style: MAP_STYLE,
    });
  }, []);

  return <div ref={ref} className="h-svh w-full"></div>;
};
