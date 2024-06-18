import { Database } from "@bitetechnology/bite-types";
import { useCallback, useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import { v4 as uuidv4 } from "uuid";
import DishForm from "../DishForm";
import supabase from "@/lib/supabaseClient";

type SnoozedDishesMap = {
  [key: string]:
    | {
        snoozeStart: string | null;
        snoozeEnd: string | null;
      }
    | {};
};

type CategoryResponse = Database["public"]["Tables"]["categories"]["Row"] & {
  data: Database["public"]["Tables"]["dishes"]["Row"][];
};

interface MenuDetailProps {
  dish: Database["public"]["Tables"]["dishes"]["Row"];
  handleSnooze: (modifierId: number) => () => void;
  handleUnsnooze: (modifierId: number) => () => void;
  snoozedModifierMap?: SnoozedDishesMap;
  restaurantId: string;
  categories: CategoryResponse[];
  onClose: () => void;
}

type MenuDetailForm = {
  name: string;
  description: string;
  deals: boolean;
  imageUpload: File | null;
  price: number;
};

const MenuDetail = ({
  dish,
  handleSnooze,
  restaurantId,
  handleUnsnooze,
  snoozedModifierMap,
  categories,
  onClose,
}: MenuDetailProps) => {
  const {
    data: modifierGroups,
    isLoading: modifierGroupIsLoading,
    isValidating: modifierGroupIsValidating,
  } = useSWR(`/api/modifiers/${dish.id}`, {
    revalidateOnFocus: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  const { mutate } = useSWRConfig();

  const updateDish = useCallback(
    async (values: MenuDetailForm) => {
      setIsLoading(true);
      let imageUrl = dish.image_url;

      if (values.imageUpload) {
        const { data: uploadImageData, error } = await supabase.storage
          .from("food-images")
          .upload(`${restaurantId}/${uuidv4()}`, values.imageUpload, {
            cacheControl: "3600",
            upsert: false,
          });

        if (error) {
          setIsLoading(false);
          throw new Error("Failed to upload image: " + error.message);
        }

        // Update imageUrl with the new image path
        const { data: publicUrlData } = await supabase.storage
          .from("food-images")
          .getPublicUrl(uploadImageData?.path);

        imageUrl = publicUrlData.publicUrl;
      }

      // Update the dish details along with the new image URL
      await fetch(`/api/dishes/update/${dish.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...values, imageUrl }),
      });
      setIsLoading(false);
    },
    [dish.id, dish.image_url, restaurantId]
  );

  const handleSubmit = useCallback(
    (values: MenuDetailForm) => {
      setIsLoading(true);
      mutate(`/api/dishes/${dish.id}`, updateDish(values));
      setIsLoading(false);
      if (!isLoading) {
        onClose();
      }
    },
    [dish.id, isLoading, mutate, onClose, updateDish]
  );

  return (
    <div>
      <DishForm
        categories={categories}
        onClose={onClose}
        handleSubmit={handleSubmit}
        modifierGroups={modifierGroups}
        handleSnooze={handleSnooze}
        handleUnsnooze={handleUnsnooze}
        snoozedModifierMap={snoozedModifierMap}
        values={{
          name: dish.name ?? "",
          description: dish.description ?? "",
          imageUpload: null,
          price: dish.price ?? 0,
          ingredients: "",
          deals: dish.deals ?? false,
          imagePreview: dish.image_url ?? "",
          category: dish.category_id
            ? categories.find(
                (category) => category.category_id === dish.category_id
              ) ?? categories[0]
            : categories[0],
        }}
      />
    </div>
  );
};

export default MenuDetail;
