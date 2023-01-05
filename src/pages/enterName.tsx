import { type NextPage } from "next";
import EnterNameForm from "../components/EnterNameForm";
import EnterNameQandA from "../components/EnterNameQandA";

const EnterName: NextPage = () => {
  return (
    <div className="pb-16">
      <div className="container mx-auto flex w-full flex-col justify-center gap-12 px-4 sm:flex-row">
        <div className="mx-5 w-[calc(100%_-_10)] sm:w-1/2 ">
          <h1 className="mb-6 mt-6 text-center text-2xl">Enter Your Name</h1>
          <EnterNameForm />
        </div>
        <div className="mx-5 w-[calc(100%_-_10)] sm:w-1/2 ">
          <h1 className="mb-6 mt-6 text-center text-xl">Q & A</h1>
          <EnterNameQandA />
        </div>
      </div>
    </div>
  );
};

export default EnterName;
