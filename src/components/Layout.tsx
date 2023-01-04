import EnterNameBanner from "./EnterNameBanner";
import Navbar from "./Navbar";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    /**
     * Why do we need h-0 here:
     * https://codepen.io/yupototo/pen/XWBjRpY?editors=1100
     */
    <div className="h-0 min-h-screen">
      <Navbar />
      <EnterNameBanner />
      {/* make pc home page almost as high as screen, as Navbar is around 91px */}
      <div className="h-[calc(100%_-_91px)]">{children}</div>
    </div>
  );
}
