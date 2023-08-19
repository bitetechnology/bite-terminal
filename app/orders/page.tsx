import RealTimeOrders from "@/components/RealTimeOrders";
import { supabase } from "@/utils/supabaseClient";

export default async function Order() {
  const { data } = await supabase
    .from("orders")
    .select()
    .eq("restaurant_id", "84")
    .order("id", { ascending: false });
  return data && data?.length > 0 && <RealTimeOrders serverOrders={data} />;
}
