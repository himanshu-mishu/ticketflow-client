
import { useRef, useState } from "react";
import { useCreateTicket } from "../hooks/useCreateTicket";

export default function CreateTicket() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");

  const idempotencyKeyRef = useRef(null);

  const {
    mutate,
    isPending,
    isError,
    error,
    isSuccess,
  } = useCreateTicket();

  function handleSubmit(e) {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      return;
    }

    // Reuse the same key if this submission needs to be retried
    if (!idempotencyKeyRef.current) {
      idempotencyKeyRef.current = crypto.randomUUID();
    }

    mutate(
      {
        ticketData: {
          title: title.trim(),
          description: description.trim(),
          priority,
        },
        idempotencyKey: idempotencyKeyRef.current,
      },
      {
        onSuccess: () => {
          setTitle("");
          setDescription("");
          setPriority("MEDIUM");
          idempotencyKeyRef.current = null;
        },
      }
    );
  }

  return (
    <div className="mb-8 rounded-xl bg-white p-6 shadow">
      <h2 className="mb-5 text-xl font-bold text-gray-800">
        Create New Ticket
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block font-medium text-gray-700">
            Ticket Title
          </label>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter ticket title"
            maxLength={200}
            required
            className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="mb-1 block font-medium text-gray-700">
            Description
          </label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your issue"
            maxLength={5000}
            rows={4}
            required
            className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="mb-1 block font-medium text-gray-700">
            Priority
          </label>

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="rounded-lg border bg-white p-3"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>

        {isError && (
          <p className="text-sm text-red-600">
            {error.response?.data?.message ||
              "Unable to create ticket. Please try again."}
          </p>
        )}

        {isSuccess && (
          <p className="text-sm text-green-600">
            Ticket created successfully!
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Creating..." : "Create Ticket"}
        </button>
      </form>
    </div>
  );
}
