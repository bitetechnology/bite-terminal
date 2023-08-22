"use client";

import { supabase } from "@/utils/supabaseClient";
import { useCallback, useEffect, useState } from "react";
import OrderSkeleton from "../OrderSkeleton";
import Navbar2 from "../Navbar2";
import OrderStates from "../OrderStates";
import { Database } from "@bitetechnology/bite-types";
import { OrderStatus } from "@/utils/orderStatus";
import { updateOrder } from "@/utils/updateStatus";

type OrderFromSupabase = Database["public"]["Tables"]["orders"]["Row"];

export default function RealTimeOrders({
  serverOrders,
}: {
  serverOrders: any;
}) {
  const [orders, setOrders] = useState<OrderFromSupabase[] | []>([]);

  useEffect(() => {
    setOrders(serverOrders);
  }, [serverOrders]);

  useEffect(() => {
    const channel = supabase
      .channel("*")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        (payload) => {
          setOrders((prevOrders: any) => {
            const newOrder = payload.new as OrderFromSupabase;

            if (
              prevOrders.find(
                (order: OrderFromSupabase) => order.id === newOrder.id
              )
            ) {
              const listOfOrders = [
                newOrder,
                ...prevOrders.filter(
                  (order: OrderFromSupabase) => order.id !== newOrder.id
                ),
              ];
              return listOfOrders.sort((a, b) => b.id - a.id);
            } else {
              return [...prevOrders, newOrder];
            }
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase, orders, setOrders]);

  const handleStatusChange = useCallback(
    (status: number, orderId: number) => async () =>
      updateOrder({
        status,
        channelOrderId: orderId,
      }),
    []
  );

  return orders && orders.length > 0 ? (
    <div
      className="min-h-screen flex flex-col items-center p-10"
      style={{
        backgroundColor: "#F5F7F9",
        fontFamily: "Plus Jakarta Sans, sans-serif",
        width: "100%",
        margin: "0 auto",
        padding: "0 auto",
      }}
    >
      <Navbar2 />

      <div className="w-full mt-10 flex flex-col items-center">
        {orders.map((order, index) => (
          <div
            key={order.id}
            className="card mb-10 flex flex-col w-[70vw] rounded-lg shadow-2xl"
          >
            <div className="flex justify-between items-center w-full bg-transparent border-b border-gray-300 pb-2">
              <span className="font-black text-xl">
                <span className="text-green-400">#</span>
                <span className="text-black">{order.id}</span>
                {order.status ? (
                  <span className="inline-flex items-center gap-1 py-0.5 px-2 ml-4 rounded-full text-sm font-bold bg-green-500 text-white">
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 py-0.5 px-2 ml-4 rounded-full text-sm font-bold bg-green-500 text-white">
                    Accepted
                  </span>
                )}
              </span>
              <div className="space-x-2 mt-1 mb-1 flex flex-wrap">
                <OrderStates
                  color="red"
                  label="Cancel"
                  onClick={handleStatusChange(OrderStatus.canceled, order.id)}
                />
                <OrderStates
                  color="yellow"
                  label="In preparation"
                  onClick={handleStatusChange(OrderStatus.preparing, order.id)}
                />
                <OrderStates
                  color="green"
                  label="Ready to pick up"
                  onClick={handleStatusChange(
                    OrderStatus.pickup_ready,
                    order.id
                  )}
                />
              </div>
            </div>

            <table className="min-w-full divide-y divide-[rgb(229,231,235)] w-full rounded-lg rounded-2xl ">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th scope="col" className="px-4 py-2 text-left text-md">
                    Item
                  </th>
                  <th scope="col" className="px-4 py-2 text-left text-md">
                    Price
                  </th>
                  <th scope="col" className="px-4 py-2 text-left text-md">
                    Quantity
                  </th>
                  <th scope="col" className="px-4 py-2 text-left text-md">
                    Sub-items
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[rgb(229,231,235)]">
                {order.deliverect_order &&
                  typeof order.deliverect_order === "object" &&
                  "items" in order.deliverect_order &&
                  Array.isArray(order.deliverect_order.items) &&
                  order.deliverect_order.items?.map((item: any) => (
                    <tr key={index}>
                      <td className="px-4 py-5 text-md text-gray-800">
                        {item.name || "N/A"}
                      </td>
                      <td className="px-4 py-5 text-md text-black font-bold">
                        €{(item.price / 100).toFixed(2)}
                      </td>
                      <td className="px-4 py-5 text-md text-gray-800">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-5 text-md text-gray-800">
                        {item.subItems && item.subItems.length > 0
                          ? item.subItems.map((subItem: any) => (
                              <p key={subItem.id} className="text-md">
                                {subItem.name} - €
                                {(subItem.price / 100).toFixed(2)} x{" "}
                                {subItem.quantity}
                              </p>
                            ))
                          : "N/A"}
                      </td>
                    </tr>
                  ))}

                <tr className="bg-gray-200">
                  <td
                    colSpan={4}
                    className="px-4 py-2 text-right text-md font-bold"
                  >
                    {`Total: ${order.total && order.total / 100}€`}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div className="min-h-screen flex flex-col items-center p-10">
      <Navbar2 />
      <div className="w-full mt-10 flex flex-col items-center">
        <OrderSkeleton />
        <OrderSkeleton />
        <OrderSkeleton />
      </div>
    </div>
  );
}
