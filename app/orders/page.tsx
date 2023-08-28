import RealTimeOrders from "@/components/RealTimeOrders";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export const revalidate = 60;
export default async function Order() {
  try {
    const supabase = createServerComponentClient({ cookies });
    const { data } = await supabase
      .from("orders")
      .select()
      .eq("restaurant_id", "84")
      .order("id", { ascending: false });
    return data && data?.length > 0 && <RealTimeOrders serverOrders={data} />;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return null;
  }
}
