import { COLLECTIONS } from "@/lib/constants";
import supabase from "@/lib/supabaseClient";
import { SnoozedDishesMap } from "@/types/snoozedItems";

export async function GET(
  request: Request,
  { params }: { params: { restaurantId: string } }
) {
  const { restaurantId } = params;
  const { data, error } = await supabase
    .from(COLLECTIONS.SNOOZED_RESTAURANTS_DISHES)
    .select("*")
    .eq("restaurant_id", restaurantId);

  if (error) {
    return new Response(
      `error fetching the categories for the given restaurant: ${error}`,
      {
        status: 404,
      }
    );
  }

  if (data) {
    const snoozedDishesMap: SnoozedDishesMap = data.reduce<SnoozedDishesMap>(
      (acc, curr) => {
        acc[curr.dish_id] = {
          snoozeStart: curr.snooze_start,
          snoozeEnd: curr.snooze_end,
        };
        return acc;
      },
      {}
    );
    return Response.json(snoozedDishesMap);
  }

  return new Response(`there was a problem in making your request ${data}`, {
    status: 500,
  });
}
