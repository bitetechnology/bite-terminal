import { COLLECTIONS } from "@/api/constants";
import supabase from "@/api/supabaseClient";

export async function GET(
  request: Request,
  { params }: { params: { restaurantId: string } }
) {
  const { restaurantId } = params;
  const { data, error } = await supabase
    .from(COLLECTIONS.CATEGORIES)
    .select(
      `
            *,
            restaurants!inner(id),
            data:dishes(
              *, 
              modifierGroups:modifier_groups(*),
              ingredients(*),
              allergens(*)
            )
          `
    )
    .eq("restaurants.id", restaurantId)
    .eq("enabled", true)
    .order("order_number");

  if (error) {
    return new Response(
      `error fetching the categories for the given restaurant: ${error}`
    );
  }
  return Response.json(data);
}
