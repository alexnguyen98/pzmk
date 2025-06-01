import { PostMapBodyPayloadType } from "@/app/api/map/route";
import { MAP_STYLE } from "@/lib/const";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import maplibregl, { Map } from "maplibre-gl";
import { useRouter, useSearchParams } from "next/navigation";
import { RefObject, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export const useMap = (ref: RefObject<HTMLDivElement | null>) => {
  const map = useRef<Map>(null);
  const router = useRouter();

  const [styleLoaded, setStyleLoaded] = useState(false);

  const search = useSearchParams();
  const lat = search.get("lat") ? parseFloat(search.get("lat")!) : 49.847;
  const lng = search.get("lng") ? parseFloat(search.get("lng")!) : 15.339;
  const zoom = search.get("zoom") ? parseFloat(search.get("zoom")!) : 6.76;

  const query = useQuery<PostMapBodyPayloadType>({
    queryKey: ["map", lat, lng, zoom],
    queryFn: async () => {
      const { data } = await axios.post("/api/map", {
        lat,
        lng,
        zoom,
      });
      return data;
    },
  });

  const handleMoveEnd = () => {
    const center = map.current!.getCenter();
    const zoom = map.current!.getZoom();

    const params = new URLSearchParams();
    params.set("lat", center.lat.toString());
    params.set("lng", center.lng.toString());
    params.set("zoom", zoom.toString());

    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const updatePolygons = () => {
    const source = map.current!.getSource("polygon-data");
    const data = {
      type: "FeatureCollection" as const,
      features: query
        .data!.polygons.filter((i) => i.geojson)
        .map((i) => ({
          type: "Feature" as const,
          properties: {
            id: i.id,
          },
          geometry: i.geojson,
        })),
    };

    // Update existing source
    if (source) {
      (source as maplibregl.GeoJSONSource).setData(data);
      // Create source
    } else {
      map.current!.addSource("polygon-data", {
        type: "geojson",
        data,
      });

      // Add fill layer (blue filling)
      map.current!.addLayer!({
        id: "polygons-fill",
        type: "fill",
        source: "polygon-data",
        paint: {
          "fill-color": "#0080ff",
          "fill-opacity": 0.5,
        },
      });

      // Add line layer (thick red border)
      map.current!.addLayer!({
        id: "polygons-border",
        type: "line",
        source: "polygon-data",
        paint: {
          "line-color": "#ff0000",
          "line-width": 3,
          "line-opacity": 1,
        },
      });
    }
  };

  const updatePoints = () => {
    const source = map.current!.getSource("points-data");

    const data = {
      type: "FeatureCollection" as const,
      features: query
        .data!.points.filter((i) => i.geojson)
        .map((i) => ({
          type: "Feature" as const,
          properties: {
            id: i.id,
          },
          geometry: i.geojson,
        })),
    };

    if (source) {
      (source as maplibregl.GeoJSONSource).setData(data);
    } else {
      map.current!.addSource("points-data", {
        type: "geojson",
        data,
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
      });

      // Add clusters
      map.current!.addLayer({
        id: "clusters",
        type: "circle",
        source: "points-data",
        filter: ["has", "point_count"],
        paint: {
          // Use step expressions (https://maplibre.org/maplibre-style-spec/#expressions-step)
          // with three steps to implement three types of circles:
          //   * Blue, 20px circles when point count is less than 100
          //   * Yellow, 30px circles when point count is between 100 and 750
          //   * Pink, 40px circles when point count is greater than or equal to 750
          "circle-color": [
            "step",
            ["get", "point_count"],
            "#51bbd6",
            100,
            "#f1f075",
            750,
            "#f28cb1",
          ],
          "circle-radius": [
            "step",
            ["get", "point_count"],
            20,
            100,
            30,
            750,
            40,
          ],
        },
      });

      map.current!.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "points-data",
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12,
        },
      });

      map.current!.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "points-data",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": "#11b4da",
          "circle-radius": 4,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#fff",
        },
      });
    }
  };

  const handleUpdateMap = () => {
    updatePolygons();
    updatePoints();
  };

  useEffect(() => {
    if (query.error) toast.error("Failed to load map data");
  }, [query.error]);

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

    map.current.on("style.load", () => {
      setStyleLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!query.data || !map.current || !styleLoaded) return;

    console.log("Updating map with new data");
    handleUpdateMap();
  }, [query.data, styleLoaded]);

  return query;
};
