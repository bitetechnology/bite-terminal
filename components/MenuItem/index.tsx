import { Database } from "@bitetechnology/bite-types";
import React, { useCallback, useState } from "react";
import SlideOver from "../SlideOver";
import MenuDetail from "../MenuDetail";
import useSWR, { useSWRConfig } from "swr";

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

  const {
    data: modifierGroup,
    error: modifierGroupError,
    isLoading: modifierGroupIsLoading,
    isValidating: modifierGroupIsValidating,
  } = useSWR(`/api/modifiers/${dish.id}`);

  const { mutate } = useSWRConfig();

  const {
    data: snoozedUnsnoozedMap,
    error: snoozedUnsnoozedMapError,
    isLoading: snoozedUnsnoozedMapIsLoading,
    isValidating: snoozedUnsnoozedMapIsValidating,
  } = useSWR<SnoozedDishesMap>(`/api/modifiers/snooze/${restaurantId}`);

  const fetchSnoozeModifier = async (
    modifierId: number,
    restaurantId: string
  ) => {
    const res = await fetch("/api/modifiers/snooze", {
      method: "POST",
      body: JSON.stringify({ modifierId, restaurantId }),
    });
    const data = await res.json();
    return data;
  };

  const fetchUnsnoozeModifier = async (
    modifierId: number,
    restaurantId: string
  ) => {
    const res = await fetch(`/api/modifiers/unsnooze`, {
      method: "POST",
      body: JSON.stringify({ modifierId, restaurantId }),
    });
    const data = await res.json();
    return data;
  };

  const handleModifiersSnooze = useCallback(
    (modifierId: number) => async () => {
      mutate(
        `/api/modifiers/snooze/${restaurantId}`,
        fetchSnoozeModifier(modifierId, restaurantId)
      );
    },
    [mutate]
  );

  const handleModifiersUnsnooze = useCallback(
    (modifierId: number) => async () => {
      mutate(
        `/api/modifiers/snooze/${restaurantId}`,
        fetchUnsnoozeModifier(modifierId, restaurantId)
      );
    },
    [mutate]
  );

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
      <SlideOver
        open={showSlideOver}
        onClose={onCloseSlideOver}
        isLoading={
          modifierGroupIsLoading ||
          snoozedUnsnoozedMapIsLoading ||
          modifierGroupIsValidating ||
          snoozedUnsnoozedMapIsValidating ||
          snoozedUnsnoozedMapIsValidating
        }
      >
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
