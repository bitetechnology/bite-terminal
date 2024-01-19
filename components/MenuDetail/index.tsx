import { Database } from "@bitetechnology/bite-types";
import { PhotoIcon } from "@heroicons/react/20/solid";
import { useFormik } from "formik";

type SnoozedDishesMap = {
  [key: string]:
    | {
        snoozeStart: string | null;
        snoozeEnd: string | null;
      }
    | {};
};

type ModifierGroupMap = {
  modifiers: Database["public"]["Tables"]["modifiers"]["Row"][];
  modifierGroupName: string;
};

interface MenuDetailProps {
  dish: Database["public"]["Tables"]["dishes"]["Row"];
  modifierGroups?: ModifierGroupMap[];
  handleSnooze: (modifierId: number) => () => void;
  handleUnsnooze: (modifierId: number) => () => void;
  snoozedModifierMap?: SnoozedDishesMap;
  onClose: () => void;
}

const MenuDetail = ({
  dish,
  modifierGroups,
  handleSnooze,
  handleUnsnooze,
  snoozedModifierMap,
  onClose,
}: MenuDetailProps) => {
  const formik = useFormik({
    initialValues: {
      name: dish.name ?? "",
      description: dish.description ?? "",
      price: dish.price ?? 0,
    },
    onSubmit: (values) => {
      //TODO: update the database with the new information
    },
  });

  return (
    <div>
      <form>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Menu Detail
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              You can edit the menu details here.
            </p>

            <div className="col-span-full">
              <label
                htmlFor="cover-photo"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Cover photo
              </label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                <div className="text-center">
                  {dish.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={dish.image_url ?? "/no-dish-image.jpeg"}
                      alt="Preview"
                      className="mx-auto"
                    />
                  ) : (
                    <PhotoIcon
                      className="mx-auto h-12 w-12 text-gray-300"
                      aria-hidden="true"
                    />
                  )}
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-gray-600">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="first-name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Dish name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="name"
                    id="name"
                    autoComplete="given-name"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="dishdescription"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Dish description
                </label>
                <div className="mt-2">
                  <textarea
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    id="description"
                    name="description"
                    rows={3}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
            <div className="sm:col-span-3">
              <label
                htmlFor="price"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Dish price
              </label>
              <div className="mt-2">
                <input
                  value={formik.values.price}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  type="text"
                  name="price"
                  id="price"
                  autoComplete="given-name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                {`The price are base of 100, for example ${dish.price} = ${
                  formik.values.price ? formik.values.price / 100 : 0
                }€`}
              </p>
            </div>
          </div>

          {modifierGroups && modifierGroups.length > 0 && (
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Snooze Modifiers
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                snooze the modifiers here related to the dishes here.
              </p>
              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                {modifierGroups.map(
                  (modifierGroup) => modifierGroup.modifierGroupName
                )}
              </div>

              {modifierGroups.map((modifierGroup) => {
                return modifierGroup.modifiers?.map((modifier) => {
                  return (
                    <div
                      key={modifier.id}
                      className={"row flex justify-between items-center mb-2"}
                    >
                      <p className="mt-1 text-sm leading-6 text-gray-600">
                        {modifier.name}
                      </p>
                      {!snoozedModifierMap?.[modifier.id] ? (
                        <button
                          type="button"
                          className="relative flex items-center justify-center rounded-md border border-transparent bg-gray-100 px-8 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200"
                          onClick={() => {
                            handleSnooze(modifier.id)();
                          }}
                        >
                          Snooze<span className="sr-only">{dish.name}</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="relative flex items-center justify-center rounded-md border border-transparent bg-gray-100 px-8 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200"
                          onClick={() => {
                            handleUnsnooze(modifier.id)();
                          }}
                        >
                          Unsnooze<span className="sr-only">{dish.name}</span>
                        </button>
                      )}
                    </div>
                  );
                });
              })}
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            className="text-sm font-semibold leading-6 text-gray-900"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default MenuDetail;
