"use client";

import { Loading } from "@/components/map/loading";
import { Popup } from "@/components/map/popup";
import { useMap } from "@/hooks/use-map";
import { useRef } from "react";

export const MapContainer = () => {
  const ref = useRef<HTMLDivElement>(null);

  const { query, activeItem, setActiveItem } = useMap(ref);

  const handleClose = () => {
    setActiveItem(null);
  };

  return (
    <div className="relative">
      {query.isLoading && <Loading />}
      {activeItem && <Popup activeItem={activeItem} close={handleClose} />}
      <div ref={ref} className="h-svh w-full"></div>
    </div>
  );
};
