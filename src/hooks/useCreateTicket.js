
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";

export function useCreateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ ticketData, idempotencyKey }) => {
      const response = await api.post(
        "/tickets",
        ticketData,
        {
          headers: {
            "Idempotency-Key": idempotencyKey,
          },
        }
      );

      return response.data;
    },

    onSuccess: () => {
      // Refresh ticket queries after successful creation
      queryClient.invalidateQueries({
        queryKey: ["tickets"],
      });
    },
  });
}
