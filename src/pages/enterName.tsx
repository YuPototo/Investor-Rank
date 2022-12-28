import { type NextPage } from "next";
import EnterNameForm from "../components/EnterNameForm";
import EnterNameQandA from "../components/EnterNameQandA";

const EnterName: NextPage = () => {
  return (
    <div className="flex gap-4">
      <div className="w-1/2">
        <EnterNameForm />
      </div>
      <div className="w-1/2 ">
        <EnterNameQandA />
      </div>
    </div>
  );
};

export default EnterName;
