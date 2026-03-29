import Banner from "@/components/home/banner";
import About from "@/components/home/about";
import MenuDishes from "@/components/home/menu&dishes";
import Testimonials from "@/components/home/testimonials";
import OurExperts from "@/components/home/ourExperts";
import News from "@/components/home/news";
import Ordering from "@/components/home/ordering";
import Categories from "@/components/home/categories";
import { getCurrentUser } from "@/lib/auth";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <>
      <div>
        <Banner />
      </div>
      <div>
        <About />
      </div>
      <div>
        <Categories />
      </div>
      <div>
        <MenuDishes user={user} />
      </div>
      <div>
        <Testimonials />
      </div>
      <div>
        <OurExperts />
      </div>
      <div>
        <Ordering />
      </div>
      <div>
        <News />
      </div>
    </>
  );
}
