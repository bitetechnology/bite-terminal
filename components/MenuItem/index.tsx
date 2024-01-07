import { Database } from "@bitetechnology/bite-types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useAsyncEffect } from "ahooks";
import Image from "next/image";
import React, { useCallback } from "react";
import ModifierModal from "../ModifierModal";
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
    <>
      <div
        onClick={openModal}
        className={
          "border border-grey rounded-md p-4 hover:shadow-lg transition-shadow duration-200 my-5 flex"
        }
      >
        <Image
          src={
            dish.image_url
              ? dish.image_url
              : "https://abywcqquksfpaipjozbl.supabase.co/storage/v1/object/public/app%20image/no-dish-image.jpeg?t=2023-09-22T13%3A21%3A32.684Z"
          }
          alt={dish.name}
          className={"mr-4 object-cover"}
          width={200}
          height={50}
        />

        <div className={"flex-col"}>
          <div className="font-bold">{dish.name}</div>
          <div>{dish.description}</div>
          <div>{`€ ${dish.price ? dish.price / 100 : 0}`}</div>
          {snoozed ? (
            <button
              onClick={handleUnsnooze(dish.id)}
              className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-700 transition-colors duration-200 flex items-center"
            >
              <Image
                src="/alarm-clock-icon.svg"
                alt="Alarm Clock Icon"
                className="mr-2 text-white stroke-current stroke-2"
                width={20}
                height={20}
              />
              Unsnooze
            </button>
          ) : (
            <button
              onClick={handleSnooze(dish.id)}
              className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-700 transition-colors duration-200 flex items-center"
            >
              <Image
                src="/alarm-clock-icon.svg"
                alt="Alarm Clock Icon"
                className="mr-2 text-white stroke-current stroke-2"
                width={20}
                height={20}
              />
              Snooze
            </button>
          )}
          <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-yellow-700 transition-colors duration-200 flex items-center">
            Delete Item
          </button>
        </div>
      </div>
      {modifierGroup && <div>{modifierGroup.modifierGroupName}</div>}
      <ModifierModal
        modifierGroup={modifierGroup}
        open={showModal}
        onClose={() => {
          setShowModal(false);
        }}
      />
    </>
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
