import { Formik, Form } from "formik";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { trpc } from "../utils/trpc";
import { useSession } from "next-auth/react";

const NameSchema = Yup.object().shape({
  headline: Yup.string().max(1000, "Too Long!"),
  twitter: Yup.string().url("Invalid Url"),
});

const EnterNameForm: React.FC = () => {
  const { data: sessionData } = useSession();
  const router = useRouter();

  const updateProfile = trpc.user.updateProfile.useMutation({
    onSuccess() {
      toast.success("Profile updated");

      setTimeout(() => {
        router.push(`/profile/${sessionData?.user?.name}`);
      }, 1000);
    },
    onError(err) {
      toast.error(err.message);
    },
  });

  return (
    <Formik
      initialValues={{ headline: "", twitter: "" }}
      validationSchema={NameSchema}
      onSubmit={(values) => {
        updateProfile.mutate({
          headline: values.headline,
          twitter: values.twitter,
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
              htmlFor="headline"
              className="block text-sm font-medium text-gray-700"
            >
              Headline
            </label>
            <div className="my-1">
              <input
                className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                type="headline"
                name="headline"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.headline}
              />
            </div>

            <div className="text-sm text-red-500">
              {errors.headline && touched.headline && errors.headline}
            </div>
          </div>

          <div>
            <label
              htmlFor="twitter"
              className="block text-sm font-medium text-gray-700"
            >
              Twitter Link
            </label>
            <div className="my-1">
              <input
                className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 "
                type="twitter"
                name="twitter"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.twitter}
              />
            </div>

            <div className="text-sm text-red-500">
              {errors.twitter && touched.twitter && errors.twitter}
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
