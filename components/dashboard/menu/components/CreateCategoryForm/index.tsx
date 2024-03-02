import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { useFormik } from "formik";
import { useCallback } from "react";
import { useSWRConfig } from "swr";
import { object, string } from "yup";

interface CreateCategoryFormProps {
  onClose: () => void;
  restaurantId: string;
}

type CreateFormValues = {
  name: string;
  description: string;
  enabled: boolean;
};

function CreateCategoryForm({
  onClose,
  restaurantId,
}: CreateCategoryFormProps) {
  const { mutate } = useSWRConfig();
  const createCategory = useCallback(
    async (values: CreateFormValues) => {
      await fetch(`/api/categories/${restaurantId}`, {
        method: "POST",
        body: JSON.stringify({ ...values }),
      });
    },
    [restaurantId]
  );

  const handleSubmit = useCallback(
    (values: CreateFormValues) => {
      mutate(`/api/categories/${restaurantId}`, createCategory(values));
    },
    [createCategory, mutate, restaurantId]
  );

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      enabled: true,
    },
    validationSchema: object({
      name: string().required("Required"),
      description: string().required("Required"),
    }),
    onSubmit: handleSubmit,
  });

  const onSubmit = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      formik.handleSubmit();
    },
    [formik]
  );
  return (
    <form>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Create a Category
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            You can create a new category here
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="first-name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Category name
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
                Category Description
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
          </div>
        </div>
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
}

export default CreateCategoryForm;
