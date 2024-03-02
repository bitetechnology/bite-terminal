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

  const { data, error } = await supabase
    .from(COLLECTIONS.DISHES)
    .upsert({
      name: body.name,
      description: body.description,
      price: body.price,
      image_url: uploadImageData ? uploadImageData.path : null, // TODO upload to supabase storage and then get the link
    })
    .eq("id", dishId);

  if (error) {
    return Response.json(error);
  }

  return Response.json(data);
}
