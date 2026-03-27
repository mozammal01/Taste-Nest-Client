import Navigation from "@/components/home/navigation";
import Menu from "@/components/menu";
import { Suspense } from "react";
import MenuLoading from "./loading";

export default function MenuPage() {
  return (
    <>
      <Navigation />
      <div>
        <Suspense fallback={<MenuLoading />}>
          <Menu />
        </Suspense>
      </div>
    </>
  );
}
