import { COLLECTIONS } from "@/api/constants";
import supabase from "@/api/supabaseClient";

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
    return new Response(
      `There was an error on retrieveing the snoozed dishes ${error}`
    );
  }
  return Response.json(data);
}
