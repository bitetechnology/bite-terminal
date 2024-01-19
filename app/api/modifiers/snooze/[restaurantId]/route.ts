import { COLLECTIONS } from "@/api/constants";
import supabase from "@/api/supabaseClient";

type SnoozedDishesMap = {
  [key: string]:
    | {
        snoozeStart: string | null;
        snoozeEnd: string | null;
      }
    | {};
};

export async function GET(
  _: Request,
  { params }: { params: { restaurantId: string } }
) {
  const { restaurantId } = params;
  const { data, error } = await supabase
    .from(COLLECTIONS.SNOOZED_RESTAURANTS_MODIFIERS)
    .select("*")
    .eq("restaurant_id", restaurantId);

  if (error) {
    return new Response(`there was a problem with the request ${error}`, {
      status: 404,
    });
  }

  if (data) {
    const snoozedDishesMap: SnoozedDishesMap = data.reduce<SnoozedDishesMap>(
      (acc, curr) => {
        acc[curr.modifier_id] = {
          snoozeStart: curr.snooze_start,
          snoozeEnd: curr.snooze_end,
        };
        return acc;
      },
      {}
    );
    return Response.json(snoozedDishesMap);
  }

  return new Response(`there was a problem in making your request`, {
    status: 500,
  });
}
