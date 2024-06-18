import { Database } from "@bitetechnology/bite-types";
import { useFormik } from "formik";
import { boolean, mixed, number, object, string } from "yup";
import ListSelect from "../ListSelect";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { useCallback } from "react";
import { PhotoIcon } from "@heroicons/react/24/outline";

type CategoryResponse = Database["public"]["Tables"]["categories"]["Row"] & {
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

type ModifierGroupMap = {
  modifiers: Database["public"]["Tables"]["modifiers"]["Row"][];
  modifierGroupName: string;
};

type DishFormProps<
  T extends {
    name: string;
    description: string;
    price: number;
    imageUpload: File | null;
    imagePreview: string;
    ingredients: string;
    category: CategoryResponse;
  }
> = {
  categories: CategoryResponse[];
  values: T;
  onClose: () => void;
  handleSubmit: (values: T) => void;
  snoozedModifierMap?: SnoozedDishesMap;
  modifierGroups?: ModifierGroupMap[] | null;
  handleSnooze?: (id: number) => () => void;
  handleUnsnooze?: (id: number) => () => void;
};

const DishForm = <
  T extends {
    name: string;
    description: string;
    price: number;
    imageUpload: File | null;
    deals: boolean;
    imagePreview: string;
    ingredients: string;
    category: CategoryResponse;
  }
>({
  categories,
  values,
  onClose,
  modifierGroups,
  handleSubmit,
  snoozedModifierMap,
  handleSnooze,
  handleUnsnooze,
}: DishFormProps<T>) => {
  const reader = new FileReader();
  const formik = useFormik({
    initialValues: values,
    onSubmit: handleSubmit,
    validationSchema: object().shape({
      name: string().required(),
      description: string().required(),
      price: number().required(),
      deals: boolean().notRequired(),
      imageUpload: mixed().notRequired(),
      ingredients: string(),
    }),
  });

  const onSubmit = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      formik.handleSubmit();
    },
    [formik]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    reader.onloadend = () => {
      formik.setFieldValue("imagePreview", reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
    formik.setFieldValue("imageUpload", file);
  };
  return (
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
                {formik.values.imageUpload || formik.values.imagePreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={formik.values.imagePreview}
                    alt="cover photo"
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
                      onChange={handleFileChange}
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
                {formik.errors.imageUpload && (
                  <div className="text-red-600 text-sm" id={"price-error"}>
                    {"you need to upload a valid image"}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="sm:col-span-3">
            <ListSelect
              items={categories}
              onChange={(item) => formik.setFieldValue("category", item)}
              selected={formik.values.category}
              field={"name"}
              title={"Dish categories"}
            />
          </div>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="first-name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Dish name
              </label>
              <div className="relative mt-2 rounded-md shadow-sm">
                <input
                  type="text"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="name"
                  id="name"
                  autoComplete="given-name"
                  aria-invalid="true"
                  aria-describedby="email-error"
                  className={`block w-full rounded-md border-0 py-1.5 pr-10 ${
                    formik.errors.name
                      ? "text-red-900 focus:ring-red-500 ring-red-300"
                      : "text-black"
                  }  ring-1 ring-inset  placeholder:text-red-300 focus:ring-2 focus:ring-inset  sm:text-sm sm:leading-6`}
                />
                {formik.errors.name && (
                  <>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <ExclamationCircleIcon
                        className="h-5 w-5 text-red-500"
                        aria-hidden="true"
                      />
                    </div>
                  </>
                )}
              </div>
              {formik.errors.name && (
                <p className="mt-2 text-sm text-red-600" id="description-error">
                  {"you need to insert a valid name"}
                </p>
              )}
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
              {formik.errors.description && (
                <p className="mt-2 text-sm text-red-600" id="description-error">
                  {"you need to insert a valid description"}
                </p>
              )}
            </div>

            <div className="col-span-full">
              <label
                htmlFor="dishingredients"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Dish ingredients
              </label>
              <div className="mt-2">
                <textarea
                  value={formik.values.ingredients}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  id="ingredients"
                  name="ingredients"
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
              {formik.errors.price && (
                <div className="text-red-600 text-sm" id={"price-error"}>
                  {"you need to insert a valid value for the price"}
                </div>
              )}
            </div>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              {`The price are base of 100, for example ${
                formik.values.price
              } = ${formik.values.price ? formik.values.price / 100 : 0}€`}
            </p>
          </div>
          <div className="sm:col-span-3">
            <label
              htmlFor="price"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Deal?
            </label>
            <div className="mt-2">
              <input
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                type="checkbox"
                name="deals"
                checked={formik.values.deals}
                id="deals"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
              {formik.errors.deals && (
                <div className="text-red-600 text-sm" id={"price-error"}>
                  {"you need to insert a valid value for the price"}
                </div>
              )}
            </div>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              {`The price are base of 100, for example ${
                formik.values.price
              } = ${formik.values.price ? formik.values.price / 100 : 0}€`}
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
                (modifierGroup: ModifierGroupMap) =>
                  modifierGroup.modifierGroupName
              )}
            </div>

            {modifierGroups.map((modifierGroup: ModifierGroupMap) => {
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
                          if (handleSnooze) {
                            handleSnooze(modifier.id)();
                          }
                        }}
                      >
                        Snooze<span className="sr-only">{modifier.name}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="relative flex items-center justify-center rounded-md border border-transparent bg-gray-100 px-8 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200"
                        onClick={() => {
                          if (handleUnsnooze) {
                            handleUnsnooze(modifier.id)();
                          }
                        }}
                      >
                        Unsnooze<span className="sr-only">{modifier.name}</span>
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
          onClick={onSubmit}
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default DishForm;
