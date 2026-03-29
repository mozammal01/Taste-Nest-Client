import Menu from "@/components/menu";
import FullMenuCategories from "@/components/menu/fullMenuCategories";
import MenuWrapper from "@/components/menu/MenuWrapper";
import SubTitle from "@/components/shared/subTitle";
import { Suspense } from "react";
import { MenuLoadingSkeleton } from "@/components/menu/foodMenu";

export default async function MenuPage(props: {
  searchParams: Promise<{ category?: string }>;
}) {
  const searchParams = await props.searchParams;
  const category = searchParams.category || "all";

  return (
    <div className="container mx-auto py-10">
      <div className="text-center mb-10">
        <SubTitle title="Menu" />
      </div>

      <MenuWrapper>
        <div className="flex justify-center items-center gap-4 mb-8">
          <FullMenuCategories />
        </div>

        <div>
          <Suspense key={category} fallback={<MenuLoadingSkeleton />}>
            <Menu category={category} />
          </Suspense>
        </div>
      </MenuWrapper>
    </div>
  );
}
