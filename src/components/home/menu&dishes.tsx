import Dishes from "./dishes";
import Menu from "./menu";
import Reservation from "./reservation";

export default function MenuDishes({ user }: { user?: { id: string; role?: string } | null }) {
  return (
    <div id="menu">
      <Menu />
      
      <div className="max-w-[1500px] mx-auto">
        <Reservation user={user} />
      </div>

      <div className="bg-slate-100/30 py-1">
        <Dishes />
      </div>
    </div>
  );
}
