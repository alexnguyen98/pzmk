"use client";

import { PostMapBodyPayloadType } from "@/app/api/map/route";
import { MAP_STYLE } from "@/lib/const";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import maplibregl, { Map } from "maplibre-gl";
import { useEffect, useRef } from "react";

export const MapContainer = () => {
  const ref = useRef<HTMLDivElement>(null);
  const map = useRef<Map>(null);

  const { data, isLoading } = useQuery<PostMapBodyPayloadType>({
    queryKey: [],
    queryFn: async () => {
      const { data } = await axios.post("/api/map", {
        lat: 0,
        lng: 0,
        zoom: 0,
      });
      return data;
    },
  });

  console.log(data);

  useEffect(() => {
    // Initialize map only once
    if (map.current || !ref.current) return;

    map.current = new maplibregl.Map({
      container: ref.current,
      style: MAP_STYLE,
    });
  }, []);

  return (
    <div className="relative">
      <div ref={ref} className="h-svh w-full"></div>
    </div>
  );
};
