import { PostMapBodyPayloadType } from "@/app/api/map/route";
import { MAP_STYLE } from "@/lib/const";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import maplibregl, { Map } from "maplibre-gl";
import { useRouter, useSearchParams } from "next/navigation";
import { RefObject, useEffect, useRef } from "react";
import { toast } from "sonner";

export const useMap = (ref: RefObject<HTMLDivElement | null>) => {
  const map = useRef<Map>(null);
  const router = useRouter();

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

  const resetMap = () => {
    if (map.current!.getLayer("polygons-fill")) {
      map.current!.removeLayer("polygons-fill");
    }
    if (map.current!.getLayer("polygons-border")) {
      map.current!.removeLayer("polygons-border");
    }
    if (map.current!.getLayer("clusters")) {
      map.current!.removeLayer("clusters");
    }
    if (map.current!.getLayer("cluster-count")) {
      map.current!.removeLayer("cluster-count");
    }
    if (map.current!.getLayer("unclustered-point")) {
      map.current!.removeLayer("unclustered-point");
    }

    // Remove all sources before removing the layers
    if (map.current!.getSource("polygon-data")) {
      map.current!.removeSource("polygon-data");
    }
    if (map.current!.getSource("points-data")) {
      map.current!.removeSource("points-data");
    }
  };

  const addPolygons = () => {
    map.current!.addSource("polygon-data", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: query
          .data!.polygons.filter((i) => i.geojson)
          .map((i) => ({
            type: "Feature",
            properties: {
              id: i.id,
            },
            geometry: i.geojson,
          })),
      },
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
  };

  const addPoints = () => {
    map.current!.addSource("points-data", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: query
          .data!.points.filter((i) => i.geojson)
          .map((i) => ({
            type: "Feature",
            properties: {
              id: i.id,
            },
            geometry: i.geojson,
          })),
      },
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
        "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
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
  };

  const handleUpdateMap = () => {
    // Remove existing source and layer if they exist
    resetMap();

    if (query.data!.polygons.length > 0) addPolygons();
    if (query.data!.points.length > 0) addPoints();
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

    // Wait for style to load before adding layers
    map.current.on("styleload", () => {
      if (query.data) {
        handleUpdateMap();
      }
    });
  }, []);

  useEffect(() => {
    if (!query.data || !map.current || !map.current.isStyleLoaded()) return;

    handleUpdateMap();
    // If style is not loaded, the styleload event will handle it
  }, [query.data]);

  return query;
};
