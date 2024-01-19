import { EDGE_FUNCTIONS } from "@/api/constants";
import supabase from "@/api/supabaseClient";
import { Database } from "@bitetechnology/bite-types";

export async function GET(
  _: Request,
  { params }: { params: { dishId: string } }
) {
  const { dishId } = params;
  const { data, error } = await supabase.functions.invoke(
    EDGE_FUNCTIONS.DELIVERECT_GET_MODIFIERS,
    {
      body: { dishId: dishId },
    }
  );

  const parsedData = JSON.parse(
    data
  ) as Database["public"]["Tables"]["modifier_groups"]["Row"][];
  if (parsedData.length > 0) {
    return Response.json(parsedData);
  }
  if (error) {
    return new Response(
      `There was an error on retrieving the modifiers: ${error}`
    );
  }
  return Response.json([]);
}
