import { supabase } from "./supabaseClient";

export async function updateOrder(updatedData: {
  channelOrderId: number;
  status: number;
}) {
  const { data, error } = await supabase.functions.invoke(
    "deliverect-order-status-update",
    {
      body: { ...updatedData },
    }
  );

  if (error) {
    throw new Error("Network response was not ok");
  }
  return data;
}
