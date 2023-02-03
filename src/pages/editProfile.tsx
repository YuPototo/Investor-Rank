import { type NextPage } from "next";
import EditProfileForm from "../components/EditProfileForm";

const EditProfile: NextPage = () => {
  return (
    <div className="pb-16">
      <div>This is edit profile page</div>
      <EditProfileForm />
    </div>
  );
};

export default EditProfile;
