import { Database } from "@bitetechnology/bite-types";
import { useSWRConfig } from "swr";
import { useCallback } from "react";
import DishForm from "../DishForm";

type CategoryResponse = Database["public"]["Tables"]["categories"]["Row"] & {
  data: Database["public"]["Tables"]["dishes"]["Row"][];
};

interface CreateMenuFormProps {
  onClose: () => void;
  categories: CategoryResponse[];
  restaurantId: string;
}

type CreateFormValues = {
  name: string;
  description: string;
  price: number;
  imageUpload: File | null;
  ingredients: string;
  category: CategoryResponse | null;
};

const CreateMenuForm = ({
  onClose,
  categories,
  restaurantId,
}: CreateMenuFormProps) => {
  const { mutate } = useSWRConfig();
  const createMenu = useCallback(
    async (values: CreateFormValues) => {
      await fetch("/api/dishes/create", {
        method: "POST",
        body: JSON.stringify({ ...values, restaurantId }),
      });
    },
    [restaurantId]
  );

  const handleSubmit = useCallback(
    (values: CreateFormValues) => {
      mutate(`/api/dishes/create`, createMenu(values));
    },
    [createMenu, mutate]
  );

  return (
    <div>
      <DishForm
        categories={categories}
        values={{
          name: "",
          description: "",
          price: 0,
          deals: false,
          imageUpload: null,
          imagePreview: "",
          ingredients: "",
          category: categories[0],
        }}
        onClose={onClose}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default CreateMenuForm;
