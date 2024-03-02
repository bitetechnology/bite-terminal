import { Database } from "@bitetechnology/bite-types";
import { PhotoIcon } from "@heroicons/react/20/solid";
import { useFormik } from "formik";
import { useCallback } from "react";
import useSWR, { useSWRConfig } from "swr";
import { object } from "yup";
import DishForm from "../DishForm";

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
  categories: CategoryResponse[];
  onClose: () => void;
}

type MenuDetailForm = {
  name: string;
  description: string;
  imageUpload: File | null;
  price: number;
};

const MenuDetail = ({
  dish,
  handleSnooze,
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

  const { mutate } = useSWRConfig();

  const updateDish = useCallback(
    async (values: MenuDetailForm) => {
      const res = await fetch(`/api/dishes/update/${dish.id}`, {
        method: "POST",
        body: JSON.stringify(values),
      });
      const data = await res.json();
      return data;
    },
    [dish.id]
  );

  const handleSubmit = useCallback(
    (values: MenuDetailForm) => {
      mutate(`/api/dishes/${dish.id}`, updateDish(values));
    },
    [dish.id, mutate, updateDish]
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
