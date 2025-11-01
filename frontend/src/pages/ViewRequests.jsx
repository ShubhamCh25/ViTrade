import React, { useEffect, useState } from "react";
import api from "../api/axios";

const ViewRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    api.get("/requests/incoming")
      .then(res => setRequests(res.data))
      .catch(err => console.error("Error fetching requests:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 text-center">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
            📥 Order Requests
          </h2>
          <p className="text-muted-foreground">Manage incoming purchase requests</p>
        </div>

        {requests.length === 0 ? (
          <div className="bg-card rounded-2xl shadow-lg p-12 text-center border border-border">
            <div className="text-6xl mb-4 opacity-30">📭</div>
            <p className="text-muted-foreground text-lg">No requests yet</p>
            <p className="text-sm text-muted-foreground mt-2">You'll see purchase requests here when buyers are interested</p>
          </div>
        ) : (
          <div className="space-y-5">
            {requests.map((r) => (
              <div
                key={r._id}
                className="bg-card rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-border hover:border-primary/30"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <h3 className="text-xl font-semibold text-primary">
                      {r.productId.name}
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">💰</span>
                        <div>
                          <p className="text-muted-foreground text-xs">Offered Price</p>
                          <p className="font-semibold text-foreground">₹{r.offeredPrice}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🧑</span>
                        <div>
                          <p className="text-muted-foreground text-xs">Buyer</p>
                          <p className="font-semibold text-foreground">{r.buyerId.username}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🎓</span>
                        <div>
                          <p className="text-muted-foreground text-xs">Registration</p>
                          <p className="font-medium text-foreground">{r.buyerId.vitReg}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-2xl">📞</span>
                        <div>
                          <p className="text-muted-foreground text-xs">Phone</p>
                          <p className="font-medium text-foreground">{r.buyerId.phone}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 sm:col-span-2">
                        <span className="text-2xl">📧</span>
                        <div>
                          <p className="text-muted-foreground text-xs">Email</p>
                          <p className="font-medium text-foreground">{r.buyerId.vitmail}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 px-3 py-2 rounded-lg">
                    <span>🕒</span>
                    <span>{new Date(r.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewRequests;
