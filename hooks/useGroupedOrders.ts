// hooks/useGroupedOrders.ts
import { useMemo } from "react";
import { Database } from "@bitetechnology/bite-types";
type OrderFromSupabase = Database["public"]["Tables"]["orders"]["Row"];
type GroupedOrders = {
  date: string;
  dateTime: string;
  transactions: OrderFromSupabase[];
};

export const useGroupedOrders = (
  orders: OrderFromSupabase[]
): GroupedOrders[] => {
  return useMemo(() => {
    const groupedOrders: Record<string, OrderFromSupabase[]> = {};

    orders.forEach((order) => {
      const date = new Date(order.insertion_date ?? new Date().toISOString())
        .toISOString()
        .split("T")[0];
      if (!groupedOrders[date]) {
        groupedOrders[date] = [];
      }
      groupedOrders[date].push(order);
    });

    const days = Object.keys(groupedOrders)
      .map((date) => ({
        date: getFriendlyDateString(date), // Ensure getFriendlyDateString is imported or defined within this hook
        dateTime: date,
        transactions: groupedOrders[date],
      }))
      .sort(
        (a, b) =>
          new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
      );

    return days;
  }, [orders]);
};

function getFriendlyDateString(dateStr: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const dateObj = new Date(dateStr);
  dateObj.setHours(0, 0, 0, 0); // Normalize the time part to ensure correct comparison

  if (dateObj.getTime() === today.getTime()) {
    return "Today";
  } else if (dateObj.getTime() === yesterday.getTime()) {
    return "Yesterday";
  } else {
    return dateObj.toISOString().split("T")[0];
  }
}
