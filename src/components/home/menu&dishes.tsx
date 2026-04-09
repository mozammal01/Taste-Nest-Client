import Dishes from "./dishes";
import Menu from "./menu";
import Reservation from "./reservation";

export default function MenuDishes({ user }: { user?: { id: string; role?: string } | null }) {
  return (
    <>
      <Menu />
      
      <div className="max-w-[1500px] mx-auto overflow-hidden">
        <Reservation user={user} />
      </div>

      <Dishes />
    </>
  );
}
