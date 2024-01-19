import { COLLECTIONS } from "@/api/constants";
import supabase from "@/api/supabaseClient";

export async function POST(request: Request) {
  const body = await request.json();
  const { error: errorSnooze } = await supabase
    .from(COLLECTIONS.SNOOZED_RESTAURANTS_MODIFIERS)
    .upsert({
      restaurant_id: Number(body.restaurantId),
      modifier_id: body.modifierId,
      snooze_start: new Date().toISOString(),
      snooze_end: new Date().toISOString(),
    });
  if (errorSnooze) {
    return new Response(
      `there was an error snoozing your modifier ${errorSnooze}`
    );
  }
}
