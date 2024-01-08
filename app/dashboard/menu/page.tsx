"use client";
import { Database } from "@bitetechnology/bite-types";
import Navbar from "../../../components/Navbar";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import MenuItem from "@/components/MenuItem";
import { useCallback, useEffect, useState } from "react";
import { COLLECTIONS } from "@/api/constants";
import Alert from "@/components/Alert";

const restaurantId = "84";

type Categories = Database["public"]["Tables"]["categories"]["Row"] & {
  data: Database["public"]["Tables"]["dishes"]["Row"][];
};

type SnoozedDishesMap = {
  [key: string]:
    | {
        snoozeStart: string | null;
        snoozeEnd: string | null;
      }
    | {};
};

export default function Menu() {
  const [showAlert, setShowAlert] = useState(false);
  const [snoozedUnsnoozedMap, setSnoozedUnsnoozedMap] =
    useState<SnoozedDishesMap>();
  const supabase = createClientComponentClient<Database>();
  const handleSnooze = useCallback(
    (dishId: string) => async () => {
      const { error: errorSnooze } = await supabase
        .from(COLLECTIONS.SNOOZED_RESTAURANTS_DISHES)
        .upsert({
          restaurant_id: Number(restaurantId),
          dish_id: dishId,
          snooze_start: new Date().toISOString(),
          snooze_end: new Date().toISOString(),
        });
      if (errorSnooze) {
        return;
      }
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    },
    [supabase]
  );

  const handleUnsnooze = useCallback(
    (dishId: string) => async () => {
      const { error: errorUnsnooze } = await supabase
        .from(COLLECTIONS.SNOOZED_RESTAURANTS_DISHES)
        .delete()
        .match({
          restaurant_id: restaurantId,
          dish_id: dishId,
        });
      if (errorUnsnooze) {
        return;
      }
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    },
    [supabase]
  );

  const [categories, setCategories] = useState<Categories[]>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from(COLLECTIONS.CATEGORIES)
          .select(
            `
            *,
            restaurants!inner(id),
            data:dishes(
              *, 
              modifierGroups:modifier_groups(*),
              ingredients(*),
              allergens(*)
            )
          `
          )
          .eq("restaurants.id", restaurantId)
          .eq("enabled", true)
          .order("order_number");

        if (error) {
          throw error;
        }

        setCategories(data);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
    };

    fetchData();
  }, [supabase, showAlert]);

  useEffect(() => {
    const fetchSnoozedUnsnoozeSnoozeData = async () => {
      try {
        const { data, error } = await supabase
          .from(COLLECTIONS.SNOOZED_RESTAURANTS_DISHES)
          .select("*")
          .eq("restaurant_id", restaurantId);

        if (data && data?.length > 0) {
          const snoozedDishesMap: SnoozedDishesMap =
            data.reduce<SnoozedDishesMap>((acc, curr) => {
              acc[curr.dish_id] = {
                snoozeStart: curr.snooze_start,
                snoozeEnd: curr.snooze_end,
              };
              return acc;
            }, {});

          setSnoozedUnsnoozedMap(snoozedDishesMap);
        }
        if (error) {
          throw error;
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }
    };

    fetchSnoozedUnsnoozeSnoozeData();
  }, [supabase, showAlert]);

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
                          snoozed={!!snoozedUnsnoozedMap?.[dish.id]}
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
