import { useState } from "react";
import { useTickets } from "../hooks/useTickets";
import CreateTicket from "../components/CreateTicket";

export default function Tickets() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");

  const { data, isLoading, isError, error, isFetching } = useTickets({
    page,
    limit: 10,
    status: status || undefined,
    priority: priority || undefined,
  });

  const tickets = data?.tickets ?? [];
  const pagination = data?.pagination;

  function handleStatusChange(value) {
    setStatus(value);
    setPage(1);
  }

  function handlePriorityChange(value) {
    setPriority(value);
    setPage(1);
  }

  if (isLoading) {
    return <div className="p-8">Loading tickets...</div>;
  }

  if (isError) {
    return (
      <div className="p-8 text-red-600">
        Unable to fetch tickets: {error.message}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-600">Tickets</h1>
          <p className="text-gray-600">
            Manage and track your support tickets.
          </p>
        </div>

        {isFetching && (
          <span className="text-sm text-gray-500">Updating...</span>
        )}
      </div>

      <CreateTicket />
      
      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <select
          value={status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="rounded-lg border bg-white p-2"
        >
          <option value="">All statuses</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </select>

        <select
          value={priority}
          onChange={(e) => handlePriorityChange(e.target.value)}
          className="rounded-lg border bg-white p-2"
        >
          <option value="">All priorities</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
        </select>
      </div>

      {/* Ticket list */}
      <div className="overflow-hidden rounded-xl bg-white shadow">
        {tickets.length === 0 ? (
          <p className="p-6 text-gray-500">No tickets found.</p>
        ) : (
          <div className="divide-y">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="flex flex-wrap items-center justify-between gap-4 p-5"
              >
                <div>
                  <h2 className="font-semibold text-gray-800">
                    {ticket.title}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {ticket.description}
                  </p>

                  <p className="mt-2 text-xs text-gray-400">
                    Created: {new Date(ticket.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex gap-3 text-sm">
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-blue-700">
                    {ticket.status}
                  </span>

                  <span className="rounded-full bg-orange-100 px-3 py-1 text-orange-700">
                    {ticket.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Page {pagination.page} of {pagination.totalPages}
            {" · "}
            {pagination.total} tickets
          </p>

          <div className="flex gap-3">
            <button
              disabled={page <= 1}
              onClick={() => setPage((current) => current - 1)}
              className="rounded-lg border bg-white px-4 py-2 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <button
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((current) => current + 1)}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
