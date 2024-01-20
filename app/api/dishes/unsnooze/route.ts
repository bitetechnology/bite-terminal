import { COLLECTIONS } from "@/lib/constants";
import supabase from "@/lib/supabaseClient";

export async function POST(request: Request) {
  const body = await request.json();
  const { data, error } = await supabase
    .from(COLLECTIONS.SNOOZED_RESTAURANTS_DISHES)
    .delete()
    .match({
      restaurant_id: body.restaurantId,
      dish_id: body.dishId,
    });
  if (error) {
    return new Response(`there was an error unsnoozing your dish ${error}`);
  }
  return Response.json(data);
}
