import { COLLECTIONS } from "@/lib/constants";
import supabase from "@/lib/supabaseClient";

export async function POST(request: Request) {
  const body = await request.json();
  const { error: errorUnsnooze } = await supabase
    .from(COLLECTIONS.SNOOZED_RESTAURANTS_MODIFIERS)
    .delete()
    .match({
      restaurant_id: body.restaurantId,
      modifier_id: body.modifierId,
    });
  if (errorUnsnooze) {
    return new Response(
      `there was an error unsnoozing your modifier ${errorUnsnooze}`
    );
  }
}
