import { Database } from "@bitetechnology/bite-types";
import Image from "next/image";
import React from "react";
type Props = {
  dish: Database["public"]["Tables"]["dishes"]["Row"];
  handleSnooze: (
    id: Database["public"]["Tables"]["dishes"]["Row"]["id"]
  ) => () => void;
  handleUnsnooze: (
    id: Database["public"]["Tables"]["dishes"]["Row"]["id"]
  ) => () => void;
  snoozed?: boolean;
  snoozed_ingredients: Record<string, boolean>;
};

const MenuItem = ({ dish, handleSnooze, handleUnsnooze, snoozed, snoozed_ingredients }: Props) => {
  return (
    <div
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
        <div>
        {dish.ingredients.map(
          (ingredient) => {
            return(
              <li>{ingredient} {snoozed_ingredients[ingredient] ? (
                <Image
                src="/alarm-clock-icon.svg"
                alt="Alarm Clock Icon"
                className="mr-2 text-white stroke-current stroke-2"
                width={20}
                height={20}
              />
              ): ""}
              </li>

        )})}
          
        </div>
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
  );
};

export default MenuItem;
