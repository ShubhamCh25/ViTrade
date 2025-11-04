import React, { useEffect, useState } from "react";
import api from "../api/axios";

const ViewRequests = () => {
  const [requests, setRequests] = useState([]);
  
  useEffect(() => {
    api
      .get("/requests/incoming")
      .then((res) => setRequests(res.data))
      .catch((err) => console.error("Error fetching requests:", err));
  }, []);
  const [updatedRequests, setUpdatedRequests] = useState({}); // track local changes

  const handleStatus = async (id, status) => {
    try {
      const res = await api.patch(`/requests/${id}/status`, { status });
  
      if (status === "rejected") {
        // Remove it from the list immediately
        setRequests((prev) => prev.filter((req) => req._id !== id));
      } else if (status === "accepted") {
        // Only update local UI for accepted
        setUpdatedRequests((prev) => ({
          ...prev,
          [id]: "accepted",
        }));
      }
    } catch (err) {
      console.error("Error updating request status:", err);
      alert("Failed to update status");
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 text-center">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
            Order Requests
          </h2>
          <p className="text-muted-foreground">
            Manage incoming purchase requests
          </p>
        </div>

        {requests.length === 0 ? (
          <div className="bg-card rounded-2xl shadow-lg p-12 text-center border border-border">
            <div className="text-6xl mb-4 opacity-30">—</div>
            <p className="text-muted-foreground text-lg">No requests yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              You'll see purchase requests here when buyers are interested
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {requests.map((r) => {
              try {
                return (
                  <div
                    key={r._id}
                    className="flex flex-col md:flex-row items-center md:items-start justify-between bg-card rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-border hover:border-primary/30"
                  >
                    {/* LEFT SIDE — Product Info */}
                    <div className="w-full md:w-1/2 flex flex-col items-center md:items-start space-y-4">
                      <h3 className="text-2xl font-semibold text-primary text-center md:text-left">
                        {r.productId?.name || "Product no longer available"}
                      </h3>

                      <div className="w-60 h-60 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                        <img
                          src={r.productId?.images?.[0] || "/placeholder.png"}
                          alt={r.productId?.name || "Product"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* RIGHT SIDE — Buyer Details */}
                    <div className="w-full md:w-1/2 mt-6 md:mt-0 md:pl-10 flex flex-col space-y-3">
                      <h4 className="text-lg font-semibold text-primary mb-2">
                        Buyer Details
                      </h4>

                      <div className="grid grid-cols-1 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground text-xs">
                            Username
                          </p>
                          <p className="font-medium text-foreground">
                            {r.buyerId?.username || "Unknown"}
                          </p>
                        </div>

                        <div>
                          <p className="text-muted-foreground text-xs">Phone</p>
                          <p className="font-medium text-foreground">
                            {r.buyerId?.phone || "N/A"}
                          </p>
                        </div>

                        <div>
                          <p className="text-muted-foreground text-xs">Email</p>
                          <p className="font-medium text-foreground">
                            {r.buyerId?.vitmail || "N/A"}
                          </p>
                        </div>

                        <div>
                          <p className="text-muted-foreground text-xs">
                            Price Offered
                          </p>
                          <p className="font-semibold text-foreground">
                            ₹{r.offeredPrice}
                          </p>
                        </div>

                        <div>
                          <p className="text-muted-foreground text-xs">
                            Date of Order
                          </p>
                          <p className="font-medium text-foreground">
                            {new Date(r.createdAt).toLocaleString() || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-3 items-center mt-4 md:mt-0">
  {updatedRequests[r._id] === "accepted" ? (
    <p className="text-green-600 font-semibold">Notification sent to buyer</p>
  ) : (
    <button
      onClick={() => handleStatus(r._id, "accepted")}
      className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-full font-medium"
    >
      Accept
    </button>
  )}

  <button
    onClick={() => handleStatus(r._id, "rejected")}
    className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-full font-medium"
  >
    Reject
  </button>
</div>


                  </div>
                );
              } catch (err) {
                console.error("Error rendering request:", err);
                return null;
              }
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewRequests;
