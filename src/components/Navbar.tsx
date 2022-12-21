import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import brandImage from "../../public/brand.png";
import Link from "next/link";

const Navbar: React.FC = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="flex h-12 w-full items-center bg-gray-300 px-5">
      <Link href="/">
        <Image src={brandImage} alt="brand"></Image>
      </Link>

      <div className="ml-5 flex gap-3">
        <Link href="/trade">Trade</Link>
        <Link href="/portfolio">Portfolio</Link>
        <Link href="/rank">Rank</Link>
      </div>

      <div className="ml-auto">
        <button
          className="btn-primary"
          onClick={sessionData ? () => signOut() : () => signIn()}
        >
          {sessionData ? "Sign out" : "Sign in"}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
