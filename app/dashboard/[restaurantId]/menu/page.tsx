"use client";
import MenuItem from "@/components/dashboard/menu/components/MenuItem";
import { useCallback, useState } from "react";
import Alert from "@/components/dashboard/menu/components/Alert";
import useSWR, { useSWRConfig } from "swr";
import { Database } from "@bitetechnology/bite-types";
import SlideOver from "@/components/SlideOver";
import CreateMenuForm from "@/components/dashboard/menu/components/CreateMenuForm";
import { Menu as MenuUI } from "@headlessui/react";
import MenuPopUp from "@/components/dashboard/menu/components/MenuPopUp";
import CreateCategoryForm from "@/components/dashboard/menu/components/CreateCategoryForm";

type CategoryResponse = Database["public"]["Tables"]["categories"]["Row"] & {
  data: Database["public"]["Tables"]["dishes"]["Row"][];
};

export default function Menu({ params }: { params: { restaurantId: string } }) {
  const { restaurantId } = params;
  const [showLoading, setShowLoading] = useState(false);
  const [showSlideOver, setSlideOver] = useState(false);
  const [showCategorySlideOver, setCategorySlideOver] = useState(false);

  const openSlideOverCreateCategory = useCallback(() => {
    setCategorySlideOver(true);
  }, []);

  const onCloseSlideOverCategory = useCallback(() => {
    setCategorySlideOver(false);
  }, []);

  const openSlideOverCreateMenu = useCallback(() => {
    setSlideOver(true);
  }, []);

  const onCloseSlideOver = useCallback(() => {
    setSlideOver(false);
  }, []);

  const {
    data: categories,
    error: categoriesError,
    isLoading: categoriesApiIsLoading,
    isValidating: categoriesApiIsValidating,
  } = useSWR<CategoryResponse[]>(`/api/categories/${restaurantId}`, {
    revalidateOnFocus: false,
  });
  const {
    data: snoozedDishesMap,
    error: snoozedDishesMapError,
    isLoading: snoozeMapIsLoading,
    isValidating: snoozeMapIsValidating,
  } = useSWR(`/api/dishes/snooze/${restaurantId}`, {
    revalidateOnFocus: false,
  });

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
      setShowLoading(true);
      setTimeout(() => {
        setShowLoading(false);
      }, 3000);
    },
    [mutate, restaurantId]
  );

  const handleUnsnooze = useCallback(
    (dishId: string) => async () => {
      mutate(
        `/api/dishes/snooze/${restaurantId}`,
        fetchUnsnoozeDishMethod(dishId, restaurantId)
      );
      setShowLoading(true);
      setTimeout(() => {
        setShowLoading(false);
      }, 3000);
    },
    [mutate, restaurantId]
  );

  return (
    <>
      {(showLoading ||
        snoozeMapIsValidating ||
        categoriesApiIsValidating ||
        categoriesApiIsLoading ||
        snoozeMapIsLoading) && (
        <div className="fixed backdrop-blur-md inset-0 z-10 bg-black top-0 right-0 bottom-0 left-0 bg-opacity-40 flex items-center justify-center">
          <div role="status">
            <svg
              aria-hidden="true"
              className="w-10 h-10 text-gray-200 animate-spin dark:text-white fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
      <div className="absolute bg-blend-overlay bg-black-2">
        {showLoading && (
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
                            categories={categories}
                            dish={dish}
                            restaurantId={restaurantId}
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
        <MenuUI as="div" className="relative">
          <div>
            <MenuUI.Button className="fixed bg-black bottom-4 right-4 items-center justify-center py-6 px-8 flex rounded-full">
              <div className="text-white">+</div>
              <MenuPopUp
                onCreateMenu={openSlideOverCreateMenu}
                onCreateCategory={openSlideOverCreateCategory}
              />
            </MenuUI.Button>
          </div>
        </MenuUI>
      </div>
      <SlideOver
        open={showSlideOver}
        onClose={onCloseSlideOver}
        isLoading={false}
      >
        {categories && (
          <CreateMenuForm
            onClose={onCloseSlideOver}
            categories={categories}
            restaurantId={restaurantId}
          />
        )}
      </SlideOver>
      <SlideOver
        open={showCategorySlideOver}
        onClose={onCloseSlideOverCategory}
        isLoading={false}
      >
        <CreateCategoryForm
          onClose={onCloseSlideOverCategory}
          restaurantId={restaurantId}
        />
      </SlideOver>
    </>
  );
}
