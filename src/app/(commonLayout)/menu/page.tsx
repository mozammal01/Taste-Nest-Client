import Menu from "@/components/menu";
import FullMenuCategories from "@/components/menu/fullMenuCategories";
import SearchFilterBar from "@/components/menu/SearchFilterBar";
import MenuWrapper from "@/components/menu/MenuWrapper";
import SubTitle from "@/components/shared/subTitle";
import { Suspense } from "react";
import { MenuLoadingSkeleton } from "@/components/menu/foodMenu";

export default async function MenuPage(props: {
  searchParams: Promise<{ category?: string; search?: string; sort?: string }>;
}) {
  const searchParams = await props.searchParams;
  const category = searchParams.category || "all";
  const search = searchParams.search;
  const sort = searchParams.sort;

  return (
    <div className="container mx-auto py-10">
      <div className="text-center mb-16">
        <SubTitle title="Explore Our Menu" />
        <p className="text-slate-500 font-medium max-w-lg mx-auto mt-4">
          Discover a world of flavors, meticulously prepared by our master chefs. 
          Use filters to find your perfect match.
        </p>
      </div>

      <MenuWrapper>
        <div className="space-y-12">
          <FullMenuCategories />
          
          <SearchFilterBar />

          <div>
            <Suspense key={`${category}-${search || ""}-${sort || ""}`} fallback={<MenuLoadingSkeleton />}>
              <Menu category={category} search={search} />
            </Suspense>
          </div>
        </div>
      </MenuWrapper>
    </div>
  );
}

