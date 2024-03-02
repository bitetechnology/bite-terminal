import { COLLECTIONS, NORMALIZED_COLLECTIONS } from "@/lib/constants";
import supabase from "@/lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";

export async function POST(
  request: Request,
  { params }: { params: { dishId: string } }
) {
  const { dishId } = params;
  const body = await request.json();

  const { data: uploadImageData } = await supabase.storage
    .from("restaurant-cover-images")
    .upload(`${body.restaurantId}/${uuidv4()}`, body.imageUpload, {
      cacheControl: "3600",
      upsert: false,
    });

  //fetch dish original data better to pass it from the body maybe
  const { data: dishPreviousData, error: dishPreviousError } = await supabase
    .from(COLLECTIONS.DISHES)
    .select("*")
    .eq("id", dishId)
    .single();

  const { data, error } = await supabase
    .from(COLLECTIONS.DISHES)
    .upsert({
      id: dishId,
      name: body.name,
      description: body.description,
      price: body.price,
      image_url: uploadImageData
        ? uploadImageData.path
        : dishPreviousData?.image_url
        ? dishPreviousData?.image_url
        : null,
    })
    .select("*")
    .single();

  if (error || !data) {
    return Response.json(error);
  }

  return Response.json(data);
}

export async function DELETE(
  request: Request,
  { params }: { params: { dishId: string } }
) {
  const { dishId } = params;

  const { error: dishError } = await supabase
    .from(COLLECTIONS.DISHES)
    .delete()
    .eq("id", dishId);

  if (dishError) {
    return Response.json(dishError);
  }

  return Response.json({ success: true });
}
