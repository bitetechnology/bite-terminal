import "../app/globals.css";
import { CheckIcon, XCircleIcon } from "@heroicons/react/20/solid";

import { supabase } from "@/utils/supabaseClient";
import { useEffect, useState } from "react";
import OrderSkeleton from "@/components/OrderSkeleton";
import { Database } from "@bitetechnology/bite-types";

export default function Order() {
  const [orders, setOrders] = useState<
    Database["public"]["Tables"]["orders"]["Row"][] | []
  >([]);
  useEffect(() => {
    const fetchOrders = async () => {
      const { data } = await supabase
        .from("orders")
        .select()
        .eq("restaurant_id", "84");
      console.log({ data });
      if (data) setOrders(data);
    };
    fetchOrders();
    const subscription = supabase
      .channel("orders-db-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
          filter: "restaurant_id=eq.84",
        },
        (payload) => {
          console.log({ payload });
          setOrders((prev) => [...prev, payload.new as any]);
        }
      )
      .subscribe();

    // Cleanup: remove the subscription on component unmount
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return orders && orders.length > 0 ? (
    <div className="min-h-screen bg-white flex items-center justify-center text-black">
      <div className="p-8 w-3/4">
        <h1 className="text-xl font-semibold mb-4">Orders</h1>
        <ul>
          {orders.map((order) => (
            <li
              key={order.id}
              className={`mb-6 bg-white p-4 rounded-lg shadow-xl h-72 flex flex-col items-start justify-start 
                ${
                  order.status === "pending" || order.status === "preparing"
                    ? "border-b-4 border-yellow-400"
                    : order.status === "accepted"
                    ? "border-b-4 border-green-400"
                    : order.status === "declined"
                    ? "border-b-4 border-red-400"
                    : "border-b-4 border-green-400"
                }`}
            >
              <div className="flex justify-between items-center w-full mb-2">
                <span className="font-medium text-black">
                  # <span className="text-gray-400">{order.id}</span>
                </span>
                {order.status === "pending" && (
                  <div className="flex space-x-3">
                    <button className="bg-green-500 p-2 rounded-lg hover:bg-green-600">
                      <CheckIcon className="h-5 w-5 text-white" />
                    </button>
                    <button className="bg-red-500 p-2 rounded-lg hover:bg-red-600">
                      <XCircleIcon className="h-5 w-5 text-white" />
                    </button>
                  </div>
                )}
              </div>

              {order.deliverect_order &&
                typeof order.deliverect_order === "object" &&
                "items" in order.deliverect_order &&
                Array.isArray(order.deliverect_order.items) &&
                order.deliverect_order.items?.map((item: any) => (
                  <div key={item.id} className="mt-2">
                    <p className="text-lg font-medium text-black">
                      {item.name || "N/A"}
                    </p>
                    <p className="text-sm">
                      Price: ${(item.price / 100).toFixed(2)}
                    </p>
                    <p className="text-sm">Quantity: {item.quantity}</p>

                    {/* Display subItems if available */}
                    {item.subItems && item.subItems.length > 0 && (
                      <div className="ml-4 mt-2">
                        {item.subItems.map((subItem: any) => (
                          <div key={subItem.id}>
                            <p className="text-xs text-black">{subItem.name}</p>
                            <p className="text-xs">
                              Price: ${(subItem.price / 100).toFixed(2)}
                            </p>
                            <p className="text-xs">
                              Quantity: {subItem.quantity}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </li>
          ))}
        </ul>
      </div>
    </div>
  ) : (
    <OrderSkeleton />
  );
}
