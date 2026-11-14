
import { useQuery } from "@tanstack/react-query";
import api from "../services/api";

export function useTickets({
  page = 1,
  limit = 10,
  status,
  priority,
} = {}) {
  return useQuery({
    queryKey: ["tickets", { page, limit, status, priority }],

    queryFn: async () => {
      const response = await api.get("/tickets", {
        params: {
          page,
          limit,
          status,
          priority,
        },
      });

      return response.data;
    },
  });
}
