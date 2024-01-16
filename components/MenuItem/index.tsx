import { Database } from "@bitetechnology/bite-types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import React, { useCallback, useEffect, useState } from "react";
import { COLLECTIONS, EDGE_FUNCTIONS } from "@/api/constants";
import SlideOver from "../SlideOver";
import MenuDetail from "../MenuDetail";

const restaurantId = "84";

type Props = {
  dish: Database["public"]["Tables"]["dishes"]["Row"];
  handleSnooze: (
    id: Database["public"]["Tables"]["dishes"]["Row"]["id"]
  ) => () => void;
  handleUnsnooze: (
    id: Database["public"]["Tables"]["dishes"]["Row"]["id"]
  ) => () => void;
  snoozed?: boolean;
};

type SnoozedDishesMap = {
  [key: string]:
    | {
        snoozeStart: string | null;
        snoozeEnd: string | null;
      }
    | {};
};

const MenuItem = ({ dish, handleSnooze, handleUnsnooze, snoozed }: Props) => {
  const [showSlideOver, setSlideOver] = useState(false);
  const [modifierGroup, setModifierGroup] =
    useState<Database["public"]["Tables"]["modifier_groups"]["Row"][]>();
  const [snoozedUnsnoozedMap, setSnoozedUnsnoozedMap] =
    useState<SnoozedDishesMap>();
  const supabase = createClientComponentClient<Database>();

  const handleModifiersSnooze = useCallback(
    (modifierId: number) => async () => {
      const { error: errorSnooze } = await supabase
        .from(COLLECTIONS.SNOOZED_RESTAURANTS_MODIFIERS)
        .upsert({
          restaurant_id: Number(restaurantId),
          modifier_id: modifierId,
          snooze_start: new Date().toISOString(),
          snooze_end: new Date().toISOString(),
        });
      if (errorSnooze) {
        return;
      }
    },
    [supabase]
  );

  const handleModifiersUnsnooze = useCallback(
    (modifierId: number) => async () => {
      const { error: errorUnsnooze } = await supabase
        .from(COLLECTIONS.SNOOZED_RESTAURANTS_MODIFIERS)
        .delete()
        .match({
          restaurant_id: restaurantId,
          modifier_id: modifierId,
        });
      if (errorUnsnooze) {
        return;
      }
    },
    [supabase]
  );

  useEffect(() => {
    const fetchModifiers = async () => {
      const { data, error } = await supabase.functions.invoke(
        EDGE_FUNCTIONS.DELIVERECT_GET_MODIFIERS,
        {
          body: { dishId: dish.id },
        }
      );
      if (error) {
        return;
      }
      const parsedData = JSON.parse(
        data
      ) as Database["public"]["Tables"]["modifier_groups"]["Row"][];
      if (parsedData.length > 0) {
        setModifierGroup(parsedData);
      }
    };
    fetchModifiers();
  }, [dish, modifierGroup, supabase]);

  useEffect(() => {
    const fetchSnoozedUnsnoozeSnoozeData = async () => {
      try {
        const { data, error } = await supabase
          .from(COLLECTIONS.SNOOZED_RESTAURANTS_MODIFIERS)
          .select("*")
          .eq("restaurant_id", restaurantId);

        if (data && data?.length > 0) {
          const snoozedDishesMap: SnoozedDishesMap =
            data.reduce<SnoozedDishesMap>((acc, curr) => {
              acc[curr.modifier_id] = {
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
  }, [supabase]);

  const openModal = useCallback(() => {
    setSlideOver(true);
  }, []);

  const onCloseSlideOver = useCallback(() => {
    setSlideOver(false);
  }, []);

  return (
    <>
      <div>
        <div className="relative" onClick={openModal}>
          <div className="relative h-72 w-full overflow-hidden rounded-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                dish.image_url ??
                "https://abywcqquksfpaipjozbl.supabase.in/storage/v1/object/public/app%20image/no-dish-image.jpeg?t=2023-09-22T13%3A21%3A32.684Z"
              }
              alt={dish.name}
              className="h-full w-full object-cover object-center"
            />
          </div>
          <div className="relative mt-4">
            <h3 className="text-sm font-medium text-gray-900">{dish.name}</h3>
            <p className="mt-1 text-sm text-gray-500">{dish.description}</p>
          </div>
          <div className="absolute inset-x-0 top-0 flex h-72 items-end justify-end overflow-hidden rounded-lg p-4">
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black opacity-50"
            />
            <p className="relative text-lg font-semibold text-white">
              {`€ ${dish.price ? dish.price / 100 : 0}`}
            </p>
          </div>
        </div>
        <div className="mt-6">
          {snoozed ? (
            <a
              className="relative flex items-center justify-center rounded-md border border-transparent bg-gray-100 px-8 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200"
              onClick={handleUnsnooze(dish.id)}
            >
              Unsnooze<span className="sr-only">, {dish.name}</span>
            </a>
          ) : (
            <a
              className="relative flex items-center justify-center rounded-md border border-transparent bg-gray-100 px-8 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200"
              onClick={handleSnooze(dish.id)}
            >
              Snooze<span className="sr-only">{dish.name}</span>
            </a>
          )}
        </div>
      </div>
      <SlideOver open={showSlideOver} onClose={onCloseSlideOver}>
        <MenuDetail
          onClose={onCloseSlideOver}
          dish={dish}
          modifierGroups={modifierGroup}
          handleSnooze={handleModifiersSnooze}
          handleUnsnooze={handleModifiersUnsnooze}
          snoozedModifierMap={snoozedUnsnoozedMap}
        />
      </SlideOver>
    </>
  );
};

export default MenuItem;
