import { type NextPage } from "next";
import EditProfileForm from "../components/EditProfileForm";

const EditProfile: NextPage = () => {
  return (
    <div className="mx-auto mt-6 w-10/12 md:w-1/2">
      <h1 className="mb-8 text-lg font-medium leading-6 text-gray-900">
        Edit Profile
      </h1>

      <EditProfileForm />
    </div>
  );
};

export default EditProfile;
