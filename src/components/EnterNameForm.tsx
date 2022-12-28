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
        <Form className="flex w-64 flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="mr-4" htmlFor="firstName">
              First Name
            </label>
            <input
              className="focus:shadow-outline appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
              type="firstName"
              name="firstName"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.firstName}
            />
            <div className="text-sm text-red-500">
              {errors.firstName && touched.firstName && errors.firstName}
            </div>
          </div>

          <div>
            <label className="mr-4" htmlFor="familyName">
              Family Name
            </label>
            <input
              className="focus:shadow-outline appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
              type="familyName"
              name="familyName"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.familyName}
            />
            <div className="text-sm text-red-500">
              {errors.familyName && touched.familyName && errors.familyName}
            </div>
          </div>

          <button className="btn-primary" type="submit" disabled={isSubmitting}>
            Submit
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default EnterNameForm;
