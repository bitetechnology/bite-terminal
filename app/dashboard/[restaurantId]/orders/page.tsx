import { COLLECTIONS } from "@/lib/constants";
import DashboardHeading from "@/components/DashboardHeading";
import NewRealTimeOrders from "@/components/dashboard/orders/RealTimeOrders/newIndex";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export const revalidate = 60;
export default async function Order({
  params,
}: {
  params: { restaurantId: string };
}) {
  const { restaurantId } = params;
  try {
    const supabase = createServerComponentClient({ cookies });
    const { data } = await supabase
      .from(COLLECTIONS.ORDERS)
      .select()
      .eq("restaurant_id", restaurantId) //TODO: remove the stubbed resturant id
      .order("id", { ascending: false });
    return (
      data &&
      data?.length > 0 && (
        <>
          <DashboardHeading title={`Orders`} />
          <NewRealTimeOrders serverOrders={data} />
        </>
      )
    );
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return null;
  }
}
