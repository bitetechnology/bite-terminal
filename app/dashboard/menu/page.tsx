"use client";
import MenuItem from "@/components/MenuItem";
import { useCallback, useState } from "react";
import Alert from "@/components/Alert";
import useSWR, { useSWRConfig } from "swr";
import { Database } from "@bitetechnology/bite-types";
import { CircleSpinnerOverlay } from "react-spinner-overlay";

const restaurantId = "84";

type CategoryResponse = Database["public"]["Tables"]["categories"]["Row"] & {
  data: Database["public"]["Tables"]["dishes"]["Row"][];
};

export default function Menu() {
  const [showAlert, setShowAlert] = useState(false);

  const {
    data: categories,
    error: categoriesError,
    isLoading: categoriesApiIsLoading,
    isValidating: categoriesApiIsValidating,
  } = useSWR<CategoryResponse[]>(`/api/categories/${restaurantId}`);
  const {
    data: snoozedDishesMap,
    error: snoozedDishesMapError,
    isLoading: snoozeMapIsLoading,
    isValidating: snoozeMapIsValidating,
  } = useSWR(`/api/dishes/snooze/${restaurantId}`);

  const { mutate } = useSWRConfig();

  const fetchSnoozeDishMethod = async (
    dishId: string,
    restaurantId: string
  ) => {
    const res = await fetch("/api/dishes/snooze", {
      method: "POST",
      body: JSON.stringify({ dishId, restaurantId }),
    });
    const data = await res.json();
    return data;
  };

  const fetchUnsnoozeDishMethod = async (
    dishId: string,
    restaurantId: string
  ) => {
    const res = await fetch("/api/dishes/unsnooze", {
      method: "POST",
      body: JSON.stringify({ dishId, restaurantId }),
    });
    const data = await res.json();
    return data;
  };

  const handleSnooze = useCallback(
    (dishId: string) => async () => {
      mutate(
        `/api/dishes/snooze/${restaurantId}`,
        fetchSnoozeDishMethod(dishId, restaurantId)
      );
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    },
    [mutate]
  );

  const handleUnsnooze = useCallback(
    (dishId: string) => async () => {
      mutate(
        `/api/dishes/snooze/${restaurantId}`,
        fetchUnsnoozeDishMethod(dishId, restaurantId)
      );
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    },
    [mutate]
  );

  return (
    <>
      <CircleSpinnerOverlay
        loading={
          snoozeMapIsValidating ||
          categoriesApiIsValidating ||
          categoriesApiIsLoading ||
          snoozeMapIsLoading
        }
        overlayColor="rgba(255,255,255,0.9)"
      />
      <div className="absolute bg-blend-overlay bg-black-2">
        {showAlert && (
          <div className="absolute top-0 right-0 left-0">
            <Alert text={"You have successfully snoozed the dish"} />
          </div>
        )}
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
    </>
  );
}
