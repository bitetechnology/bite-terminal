import { Database } from "@bitetechnology/bite-types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useAsyncEffect } from "ahooks";
import React, { useCallback } from "react";
import { EDGE_FUNCTIONS } from "@/api/constants";
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

const MenuItem = ({ dish, handleSnooze, handleUnsnooze, snoozed }: Props) => {
  const supabase = createClientComponentClient<Database>();
  const [showModal, setShowModal] = React.useState(false);
  //TODO: create error state
  const [modifierGroup, setModifierGroup] =
    React.useState<Database["public"]["Tables"]["modifier_groups"]["Row"][]>();

  useAsyncEffect(async () => {
    const { data, error } = await supabase.functions.invoke(
      EDGE_FUNCTIONS.DELIVERECT_GET_MODIFIERS,
      {
        body: { dishId: dish.id },
      }
    );
    if (error) {
      //TODO: set error inside to true
      return;
    }
    const parsedData = JSON.parse(
      data
    ) as Database["public"]["Tables"]["modifier_groups"]["Row"][];
    if (parsedData.length > 0) {
      setModifierGroup(parsedData);
    }
  }, [supabase]);

  const openModal = useCallback(() => {
    setShowModal(true);
  }, []);

  return (
    <div>
      <div className="relative">
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
            Snooze<span className="sr-only">, {dish.name}</span>
          </a>
        )}
      </div>
    </div>
  );
};

export default MenuItem;

/**
 * {modifierGroup && (
        <div>
          <div>{modifierGroup.modifierGroupName}</div>
          {modifierGroup.modifiers?.map((modifier) => {
            return (
              <div key={modifier}>
                <div>{modifier.name}</div>
              </div>
            );
          })}
        </div>
      )}
 */
