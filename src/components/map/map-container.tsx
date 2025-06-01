"use client";

import { Loading } from "@/components/map/loading";
import { useMap } from "@/hooks/use-map";
import { useRef } from "react";

export const MapContainer = () => {
  const ref = useRef<HTMLDivElement>(null);

  const { isLoading } = useMap(ref);

  return (
    <div className="relative">
      {isLoading && <Loading />}
      <div ref={ref} className="h-svh w-full"></div>
    </div>
  );
};
