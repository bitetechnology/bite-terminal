import { COLLECTIONS } from "@/api/constants";
import supabase from "@/api/supabaseClient";

export async function POST(request: Request) {
  const body = await request.json();

  const { data, error } = await supabase
    .from(COLLECTIONS.SNOOZED_RESTAURANTS_DISHES)
    .upsert({
      restaurant_id: body.restaurantId,
      dish_id: body.dishId,
      snooze_start: body.snoozeStart,
      snooze_end: body.snoozeEnd,
    });
  if (error) {
    return new Response(
      `There was an error on retrieving the snoozed dishes ${error}`
    );
  }
  return Response.json(data);
}
