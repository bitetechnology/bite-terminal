"use client";
import MenuItem from "@/components/MenuItem";
import { useCallback, useState } from "react";
import Alert from "@/components/Alert";
import useSWR, { useSWRConfig } from "swr";

const restaurantId = "84";

export default function Menu() {
  const [showAlert, setShowAlert] = useState(false);

  const { data: categories, error: categoriesError } = useSWR(
    `/api/categories/${restaurantId}`
  );
  const { data: snoozedDishesMap, error: snoozedDishesMapError } = useSWR(
    `/api/dishes/snooze/${restaurantId}`
  );

  const { mutate: snoozeDish, error: errorSnoozeDish } = useSWRConfig();
  const { mutate: unsnoozeDish, error: errorUnsnoozeDish } = useSWRConfig();

  const handleSnooze = useCallback(
    (dishId: string) => async () => {
      snoozeDish("/api/dishes/snooze", { dishId, restaurantId });
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    },
    [snoozeDish]
  );

  const handleUnsnooze = useCallback(
    (dishId: string) => async () => {
      unsnoozeDish("/api/dishes/unsnooze", { dishId, restaurantId });
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    },
    [unsnoozeDish]
  );

  return (
    <div>
      {showAlert && <Alert text={"You have successfully snoozed the dish"} />}
      <div className={"flex-col flex my-5 col-span-2 mx-5"}>
        {categories &&
          categories.map((category) => {
            return (
              <div className="bg-white" key={category.id}>
                <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                  <h2 className="text-xl font-bold text-gray-900">
                    {category.name}
                  </h2>
                  <div className="mt-8 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
                    {category.data.map((dish) => {
                      return (
                        <MenuItem
                          key={dish.id}
                          dish={dish}
                          handleSnooze={handleSnooze}
                          handleUnsnooze={handleUnsnooze}
                          snoozed={!!snoozedDishesMap?.[dish.id]}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
