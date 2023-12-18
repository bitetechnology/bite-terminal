"use client";
import { Database } from "@bitetechnology/bite-types";
import Navbar from "../../../components/Navbar";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import MenuItem from "@/components/MenuItem";
import { useCallback, useEffect, useState } from "react";

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
        .from("snoozed_restaurants_dishes")
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
        .from("snoozed_restaurants_dishes")
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
          .from("categories")
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
          .from("snoozed_restaurants_dishes")
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
      {showAlert && (
        <div className="bg-yellow-500 text-black fixed transition-all duration-500 ease-in-out w-full text-center z-10">
          Snooze activated on the selected dish
        </div>
      )}
      <div className={"flex-col flex my-5 col-span-2 mx-5"}>
        {categories &&
          categories.map((category) => {
            return (
              <div key={category.id}>
                <div className={"text-lg font-black"}>{category.name}</div>
                <div className={"grid grid-cols-2 gap-4"}>
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
            );
          })}
      </div>
    </div>
  );
}
