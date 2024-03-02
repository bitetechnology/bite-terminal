import { classNames } from "@/utils/classNames";
import { Menu, Transition } from "@headlessui/react";
import React, { Fragment } from "react";

type Props = {
  onCreateMenu: () => void;
  onCreateCategory: () => void;
};

export default function MenuPopUp({ onCreateCategory, onCreateMenu }: Props) {
  return (
    <Transition
      as={Fragment}
      enter="transition ease-out duration-100"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
    >
      <Menu.Items className="absolute bottom-24 right-0 z20 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className="py-1">
          <Menu.Item>
            {({ active }) => (
              <a
                onClick={onCreateMenu}
                className={classNames(
                  active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                  "block px-4 py-2 text-sm"
                )}
              >
                Create Menu
              </a>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <a
                onClick={onCreateCategory}
                className={classNames(
                  active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                  "block px-4 py-2 text-sm"
                )}
              >
                Create a new Category
              </a>
            )}
          </Menu.Item>
        </div>
      </Menu.Items>
    </Transition>
  );
}
