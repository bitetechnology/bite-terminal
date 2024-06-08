import { COLLECTIONS } from "@/lib/constants";
import supabase from "@/lib/supabaseClient";

export async function POST(
  request: Request,
  { params }: { params: { dishId: string } }
) {
  const { dishId } = params;
  const body = await request.json();

  const { data, error } = await supabase
    .from(COLLECTIONS.DISHES)
    .upsert({
      id: dishId,
      name: body.name,
      description: body.description,
      price: body.price,
      image_url: body.imageUrl,
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
