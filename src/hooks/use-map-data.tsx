import { PostMapBodyPayloadType } from "@/app/api/map/route";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export const useMapData = () => {
  const search = useSearchParams();
  const lat = search.get("lat") ? parseFloat(search.get("lat")!) : 0;
  const lng = search.get("lng") ? parseFloat(search.get("lng")!) : 0;
  const zoom = search.get("zoom") ? parseFloat(search.get("zoom")!) : 0;

  const query = useQuery<PostMapBodyPayloadType>({
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

  useEffect(() => {
    if (query.error) toast.error("Failed to load map data");
  }, [query.error]);

  return { query, lat, lng, zoom };
};
