export async function updateOrder(updatedData: {
  channelOrderId: number;
  status: number;
  order_is_already_paid: boolean;
}) {
  try {
    await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/deliverect-order-status-update`,
      {
        method: "POST",
        headers: {
          accept: "application/json",
        },
        body: JSON.stringify({ ...updatedData }),
      }
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
}
