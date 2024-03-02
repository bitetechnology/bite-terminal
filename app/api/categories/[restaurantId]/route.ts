import { COLLECTIONS, NORMALIZED_COLLECTIONS } from "@/lib/constants";
import supabase from "@/lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";

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

export async function POST(
  request: Request,
  { params }: { params: { restaurantId: string } }
) {
  const { restaurantId } = params;
  const body = await request.json();
  const { data, error } = await supabase
    .from(COLLECTIONS.CATEGORIES)
    .upsert({
      enabled: true,
      name: body.name,
      description: body.description,
      category_id: uuidv4(),
      insertion_date: new Date().toISOString(),
    })
    .select("*")
    .single();

  if (!data || error) {
    return new Response(`error creating the category: ${error}`);
  }

  const { data: restaurantCategoriesData, error: restaurantCategoriesError } =
    await supabase.from(NORMALIZED_COLLECTIONS.RESTAURANTS_CATEGORIES).upsert(
      {
        restaurant_id: Number(restaurantId),
        category_id: data?.id,
      },
      {
        onConflict: "restaurant_id,category_id",
      }
    );

  if (restaurantCategoriesError || !restaurantCategoriesData) {
    return new Response(
      `error creating the category: ${restaurantCategoriesError}`
    );
  }
  return Response.json(data);
}
