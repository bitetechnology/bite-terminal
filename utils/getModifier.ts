export async function getModifiers(body: { dishId: string }) {
  try {
    const { json } = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/deliverect-get-modifiers`,
      {
        method: "POST",
        headers: {
          accept: "application/json",
        },
        body: JSON.stringify({ ...body }),
      }
    );
    await json().then((data) => {
      return data;
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
}
