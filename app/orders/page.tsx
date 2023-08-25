import RealTimeOrders from "@/components/RealTimeOrders";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import Head from "next/head";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export const revalidate = 60;
export default async function Order() {
  const supabase = createServerComponentClient({ cookies });
  const { data } = await supabase
    .from("orders")
    .select()
    .eq("restaurant_id", "84")
    .order("id", { ascending: false });
  return (
    <>
      <Head>
        <title>Bite terminal | orders</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      {data && data?.length > 0 && <RealTimeOrders serverOrders={data} />}
    </>
  );
}
