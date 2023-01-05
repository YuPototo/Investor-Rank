import { Formik, Form } from "formik";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { trpc } from "../utils/trpc";
import { useSession } from "next-auth/react";

const NameSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  familyName: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
});

const EnterNameForm: React.FC = () => {
  const { data: sessionData } = useSession();
  const router = useRouter();

  const addName = trpc.user.addName.useMutation({
    onSuccess({ familyName, firstName }) {
      toast.success("Name added");

      if (sessionData && sessionData.user) {
        sessionData.user.name = `${firstName} ${familyName}`;
      }

      setTimeout(() => {
        router.push(`/`);
      }, 1000);
    },
    onError(err) {
      toast.error(err.message);
    },
  });

  return (
    <Formik
      initialValues={{ firstName: "", familyName: "" }}
      validationSchema={NameSchema}
      onSubmit={(values) => {
        addName.mutate({
          firstName: values.firstName,
          familyName: values.familyName,
        });
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
      }) => (
        <Form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700"
            >
              First Name
            </label>
            <div className="my-1">
              <input
                className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                type="firstName"
                name="firstName"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.firstName}
              />
            </div>

            <div className="text-sm text-red-500">
              {errors.firstName && touched.firstName && errors.firstName}
            </div>
          </div>

          <div>
            <label
              htmlFor="familyName"
              className="block text-sm font-medium text-gray-700"
            >
              Family Name
            </label>
            <div className="my-1">
              <input
                className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 "
                type="familyName"
                name="familyName"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.familyName}
              />
            </div>

            <div className="text-sm text-red-500">
              {errors.familyName && touched.familyName && errors.familyName}
            </div>
          </div>

          <div className="mx-auto">
            <button
              className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              type="submit"
              disabled={isSubmitting}
            >
              Submit
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default EnterNameForm;
