import { GetDetailPayloadType } from "@/app/api/detail/[id]/route";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import { toast } from "sonner";

export const useDetail = (id?: string) => {
  const query = useQuery<GetDetailPayloadType>({
    queryKey: ["detail", id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/detail/${id}`);
      return data;
    },
    enabled: Boolean(id),
  });

  useEffect(() => {
    if (query.error) toast.error("Failed to load detail");
  }, [query.error]);

  return query;
};
