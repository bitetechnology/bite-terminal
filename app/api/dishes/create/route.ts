import { COLLECTIONS, NORMALIZED_COLLECTIONS } from "@/lib/constants";
import supabase from "@/lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  const body = await request.json();

  const { data: uploadImageData } = await supabase.storage
    .from("restaurant-cover-images")
    .upload(`${body.restaurantId}/${uuidv4()}`, body.imageUpload, {
      cacheControl: "3600",
      upsert: false,
    });

  const { data, error } = await supabase
    .from(COLLECTIONS.DISHES)
    .upsert({
      name: body.name,
      description: body.description,
      price: body.price,
      image_url: uploadImageData ? uploadImageData.path : null, // TODO upload to supabase storage and then get the link
      eat_in_tax: body.eatInTax,
      deals: body.deals,
      insertion_date: new Date().toISOString(),
      max: body.max,
      min: body.min,
      category_id: body.categoryId,
    })
    .select("*")
    .single();

  if (error) {
    return Response.json(error);
  }

  const { error: restaurantDishesError } = await supabase
    .from(NORMALIZED_COLLECTIONS.RESTAURANTS_DISHES)
    .upsert(
      {
        restaurant_id: body.restaurantId,
        dish_id: data.id,
      },
      {
        onConflict: "restaurant_id,dish_id",
      }
    );

  if (restaurantDishesError) {
    return Response.json(restaurantDishesError);
  }

  const { error: dishesFoodCategoriesError } = await supabase
    .from(NORMALIZED_COLLECTIONS.DISHES_FOOD_CATEGORIES)
    .upsert(
      {
        dish_id: data.id,
        category_id: body.category.id,
      },
      {
        onConflict: "category_id,dish_id",
      }
    );

  if (dishesFoodCategoriesError) {
    return Response.json(dishesFoodCategoriesError);
  }

  return Response.json(data);
}
