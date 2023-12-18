"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import { ArrowUpCircleIcon } from "@heroicons/react/20/solid";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@bitetechnology/bite-types";
import OrderDetail from "../OrderDetail";
import OrderStates from "../OrderStates";
import { OrderStatus } from "@/utils/orderStatus";
import { updateOrder } from "@/utils/updateStatus";
import TableRow from "../table/row";
import Sidebar from "../Sidebar";

type OrderFromSupabase = Database["public"]["Tables"]["orders"]["Row"];

const statuses = {
  Paid: "text-green-700 bg-green-50 ring-green-600/20",
  Pending: "text-yellow-700 bg-yellow-50 ring-yellow-600/20",
  Preparing: "text-yellow-700 bg-yellow-50 ring-yellow-600/20",
  Withdraw: "text-gray-600 bg-gray-50 ring-gray-500/10",
  Overdue: "text-red-700 bg-red-50 ring-red-600/10",
};
const days = [
  {
    date: "Today",
    dateTime: "2023-03-22",

    transactions: [
      {
        id: 3,
        name: "Acai Bowl",
        order_is_already_paid: true,
        total: 100000,
        deliverect_order: {
          items: [
            {
              name: "Acai Bowl",
              quantity: "1",
              price: "1000",
              subItems: [
                {
                  name: "Banana",
                  quantity: "1",
                },
              ],
            },
            {
              name: "Acai Bowl",
              quantity: "1",
              price: "900",
              subItems: [
                {
                  name: "Banana",
                  quantity: "1",
                },
              ],
            },
          ],
        },
        price: "100000",
        quantity: "1",
        subItems: [{}],
        status: "Pending",
        remark: "Ciao senza glutine grazie",
        take_away: true,
        icon: ArrowUpCircleIcon,
      },
      {
        id: 2,
        name: "Acai Bowl",
        order_is_already_paid: false,
        total: 100000,
        deliverect_order: {
          items: [
            {
              name: "Acai Bowl",
              quantity: "1",
              price: "800",
              subItems: [
                {
                  name: "Banana",
                  quantity: "1",
                },
              ],
            },
            {
              name: "Acai Bowl",
              quantity: "1",
              price: "800",
              subItems: [
                {
                  name: "Banana",
                  quantity: "1",
                },
              ],
            },
          ],
        },
        price: "100000",
        quantity: "1",
        subItems: [{}],
        status: "Pending",
        remark: "Ciao senza glutine grazie",
        take_away: false,
        icon: ArrowUpCircleIcon,
      },
      {
        id: 1,
        name: "Acai Bowl",
        order_is_already_paid: false,
        total: 100000,
        deliverect_order: {
          items: [
            {
              name: "Acai Bowl",
              quantity: "1",
              price: "800",
              subItems: [
                {
                  name: "Banana",
                  quantity: "1",
                },
              ],
            },
            {
              name: "Acai Bowl",
              quantity: "1",
              price: "800",
              subItems: [
                {
                  name: "Banana",
                  quantity: "1",
                },
              ],
            },
          ],
        },
        price: "100000",
        quantity: "1",
        subItems: [{}],
        status: "Preparing",
        remark: "Ciao senza glutine grazie",
        take_away: false,
        icon: ArrowUpCircleIcon,
      },
    ],
  },
  {
    date: "Yesterday",
    dateTime: "2023-03-21",
    transactions: [
      {
        id: 0,
        name: "Acai Bowl",
        order_is_already_paid: false,
        total: 100000,
        deliverect_order: {
          items: [
            {
              name: "Acai Bowl",
              quantity: "1",
              price: "800",
              subItems: [
                {
                  name: "Banana",
                  quantity: "1",
                },
              ],
            },
            {
              name: "Acai Bowl",
              quantity: "1",
              price: "800",
              subItems: [
                {
                  name: "Banana",
                  quantity: "1",
                },
              ],
            },
          ],
        },
        price: "100000",
        quantity: "1",
        subItems: [{}],
        status: "Paid",
        remark: "Ciao senza glutine grazie",
        take_away: false,
        icon: ArrowUpCircleIcon,
      },
    ],
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function NewRealTimeOrders() {
  const [orders, setOrders] = useState<OrderFromSupabase[] | []>([]);

  const [open, setOpen] = useState(false);

  const supabase = createClientComponentClient();

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
              return [newOrder, ...prevOrders];
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
                      {day.transactions.map((transaction) => (
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
                                className={`text-sm text-gray-900 rounded-xl py-1 px-2 font-medium ring-1 ring-inset ${
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
                                      transaction.status === null) ? (
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
                                          label="In preparation"
                                          onClick={handleStatusChange(
                                            OrderStatus.preparing,
                                            transaction.id
                                          )}
                                        />
                                        <OrderStates
                                          color="green"
                                          label="Ready to pick up"
                                          onClick={handleStatusChange(
                                            OrderStatus.pickup_ready,
                                            transaction.id
                                          )}
                                        />
                                      </>
                                    ) : (
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
                            <td className="py-5 text-right">
                              <div className="flex justify-end">
                                <a
                                  // {/**TODO: on click open sidebar view */}
                                  // {/** set conext */}
                                  onClick={() => setOpen(true)}
                                  className="text-sm font-medium leading-6 text-indigo-600 hover:text-indigo-500"
                                >
                                  View
                                  <span className="hidden sm:inline">
                                    {" "}
                                    Order
                                  </span>
                                </a>
                              </div>
                              <div className="mt-1 text-xs leading-5 text-gray-500">
                                Invoice{" "}
                                <span className="text-gray-900">
                                  #{transaction.id}
                                </span>
                              </div>
                            </td>
                          </tr>
                          <Sidebar open={open} onClose={() => setOpen(false)}>
                            <OrderDetail
                              orderId={transaction.id}
                              deliverect_order={transaction.deliverect_order}
                            />
                          </Sidebar>
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
