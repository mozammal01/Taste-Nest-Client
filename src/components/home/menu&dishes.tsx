import Dishes from "./dishes";
import Menu from "./menu";
import Reservation from "./reservation";

interface MenuDishesProps {
  user?: any;
}

export default function MenuDishes({ user }: MenuDishesProps) {
  return (
    <div id="menu">
      <Menu />
      
      <div className="max-w-[1500px] mx-auto">
        <Reservation user={user} />
      </div>

      <div className="bg-slate-100/30">
        <Dishes />
      </div>
    </div>
  );
}
