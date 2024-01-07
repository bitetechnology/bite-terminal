"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@bitetechnology/bite-types";
import OrderStates from "../OrderStates";
import { OrderStatus } from "@/utils/orderStatus";
import { updateOrder } from "@/utils/updateStatus";
import TableRow from "../table/row";
import { useGroupedOrders } from "@/hooks/useGroupedOrders";
import { classNames } from "@/utils/classNames";

type OrderFromSupabase = Database["public"]["Tables"]["orders"]["Row"];

const statuses = {
  paid: "text-green-700 bg-green-50 ring-green-600/20",
  pending: "text-yellow-700 bg-yellow-50 ring-yellow-600/20",
  preparing: "text-yellow-700 bg-yellow-50 ring-yellow-600/20",
  withdraw: "text-gray-600 bg-gray-50 ring-gray-500/10",
  pickup_ready: "text-green-700 bg-green-50 ring-green-600/20",
  canceled: "text-red-700 bg-red-50 ring-red-600/10",
  overdue: "text-red-700 bg-red-50 ring-red-600/10",
};

export default function NewRealTimeOrders({
  serverOrders,
}: {
  serverOrders: any; //TODO: check if this is really any
}) {
  const [orders, setOrders] = useState<OrderFromSupabase[] | []>(serverOrders);
  const supabaseClient = createClientComponentClient();

  //TODO: this is a call to the database realtime need to be generalized and separated from the view component
  useEffect(() => {
    const channel = supabaseClient
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
              return [newOrder, ...prevOrders];
            }
          });
        }
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabaseClient, orders, setOrders]);

  const days = useGroupedOrders(orders);

  const handleStatusChange = useCallback(
    (status: number, orderId: number, order_is_already_paid = true) =>
      async () =>
        updateOrder({
          status,
          order_is_already_paid,
          channelOrderId: orderId,
        }),
    []
  );

  useEffect(() => {
    const channel = supabaseClient
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
              return [newOrder, ...prevOrders];
            }
          });
        }
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabaseClient, orders, setOrders]);

  return (
    <>
      <div>
        <div className="mt-6 overflow-hidden border-t border-gray-100">
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
              <table className="w-full text-left">
                {days.map((day) => (
                  <Fragment key={day.dateTime}>
                    <thead>
                      <tr className="text-sm leading-6 text-gray-900">
                        <th
                          scope="colgroup"
                          colSpan={3}
                          className="relative isolate py-2 font-semibold"
                        >
                          <time dateTime={day.dateTime}>{day.date}</time>
                          <div className="absolute inset-y-0 right-full -z-10 w-screen border-b border-gray-200 bg-gray-50" />
                          <div className="absolute inset-y-0 left-0 -z-10 w-screen border-b border-gray-200 bg-gray-50" />
                        </th>
                      </tr>
                      <th className="relative py-5 pr-6">
                        <div className="flex gap-x-6">
                          <div className="flex-auto">
                            <div className="flex items-start gap-x-3">
                              <div className="text-sm font-medium leading-6 text-gray-900">
                                Order #
                              </div>
                            </div>
                          </div>
                        </div>
                      </th>
                      <TableRow>
                        <div className="text-sm font-medium leading-6 text-gray-900">
                          Items
                        </div>
                      </TableRow>
                      <TableRow>
                        <div className="text-sm font-medium leading-6 text-gray-900">
                          Total
                        </div>
                      </TableRow>
                      <TableRow>
                        <div className="text-sm font-medium leading-6 text-gray-900">
                          Remarks
                        </div>
                      </TableRow>
                      <TableRow>
                        <div className="text-sm font-medium leading-6 text-gray-900">
                          Order Paid?
                        </div>
                      </TableRow>
                      <TableRow>
                        <div className="text-sm font-medium leading-6 text-gray-900">
                          Take Away
                        </div>
                      </TableRow>
                      <TableRow>
                        <div className="text-sm font-medium leading-6 text-gray-900">
                          Actions
                        </div>
                      </TableRow>
                    </thead>
                    <tbody>
                      {day.transactions.map((transaction: any) => (
                        <>
                          <tr key={transaction.id}>
                            <td className="relative py-5 pr-6">
                              <div className="flex gap-x-6">
                                <div className="flex-auto">
                                  <div className="flex items-start gap-x-3">
                                    <div className="text-sm font-medium leading-6 text-gray-900">
                                      {transaction.id}
                                    </div>
                                    <div
                                      className={classNames(
                                        statuses[
                                          transaction.status as keyof typeof statuses
                                        ],
                                        "rounded-md py-1 px-2 text-xs font-medium ring-1 ring-inset"
                                      )}
                                    >
                                      {transaction.status}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="absolute bottom-0 right-full h-px w-screen bg-gray-100" />
                              <div className="absolute bottom-0 left-0 h-px w-screen bg-gray-100" />
                            </td>
                            <TableRow>
                              {transaction.deliverect_order.items.map(
                                (item: any) => {
                                  return (
                                    <div
                                      className="flex gap-x-6"
                                      key={item.quantity + item.name}
                                    >
                                      <div className="flex-auto">
                                        <div className="flex items-start gap-x-3">
                                          <div className="text-sm font-medium leading-6 text-gray-900">
                                            {`${item.quantity} ${item.name}`}
                                          </div>
                                        </div>
                                        {item.subItems.length > 0 &&
                                          item.subItems.map((subItem: any) => {
                                            return (
                                              <div
                                                key={
                                                  subItem.quantity +
                                                  subItem.name
                                                }
                                                className="pl-4 text-xs font-medium leading-6 text-gray-900"
                                              >
                                                {`${subItem.quantity} ${subItem.name}`}
                                              </div>
                                            );
                                          })}
                                      </div>
                                    </div>
                                  );
                                }
                              )}
                            </TableRow>
                            <TableRow>
                              <div className="text-sm leading-6 text-gray-900">
                                {`${transaction.total / 100} €`}
                              </div>
                              {/* <div className="mt-1 text-xs leading-5 text-gray-500">
                          </div> */}
                            </TableRow>
                            <TableRow>
                              <div className="text-sm leading-6 text-gray-900">
                                {transaction.remark}
                              </div>
                            </TableRow>
                            <TableRow>
                              <div
                                className={`text-sm text-gray-900 rounded-xl py-1 px-2 font-medium ring-1 ring-inset w-10 ${
                                  transaction.order_is_already_paid
                                    ? "text-green-700 bg-green-50 ring-green-600/20"
                                    : "text-red-700 bg-red-50 ring-red-600/10"
                                }`}
                              >
                                {transaction.order_is_already_paid
                                  ? "Yes"
                                  : "No"}
                              </div>
                            </TableRow>
                            <TableRow>
                              <div
                                className={`text-sm text-gray-900 rounded-xl py-1 px-2 font-medium ring-1 ring-inset w-10 ${
                                  transaction.take_away
                                    ? "text-green-700 bg-green-50 ring-green-600/20"
                                    : "text-red-700 bg-red-50 ring-red-600/10"
                                }`}
                              >
                                {transaction.take_away ? "Yes" : "No"}
                              </div>
                            </TableRow>
                            <TableRow>
                              <div className="flex gap-x-6">
                                <div className="flex-auto">
                                  <div className="flex items-start gap-x-3">
                                    {transaction.order_is_already_paid &&
                                      (transaction.status === "pending" ||
                                        transaction.status === "preparing" ||
                                        transaction.status === null) && (
                                        <>
                                          <OrderStates
                                            color="red"
                                            label="Cancel"
                                            onClick={handleStatusChange(
                                              OrderStatus.canceled,
                                              transaction.id
                                            )}
                                          />
                                          <OrderStates
                                            color="yellow"
                                            label="preparing"
                                            onClick={handleStatusChange(
                                              OrderStatus.preparing,
                                              transaction.id
                                            )}
                                          />
                                          <OrderStates
                                            color="green"
                                            label="Ready"
                                            onClick={handleStatusChange(
                                              OrderStatus.pickup_ready,
                                              transaction.id
                                            )}
                                          />
                                        </>
                                      )}
                                    {!transaction.order_is_already_paid && (
                                      <OrderStates
                                        color="green"
                                        label="Paid"
                                        onClick={handleStatusChange(
                                          OrderStatus.preparing,
                                          transaction.id
                                        )}
                                      />
                                    )}
                                  </div>
                                </div>
                              </div>
                            </TableRow>
                          </tr>
                        </>
                      ))}
                    </tbody>
                  </Fragment>
                ))}
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
