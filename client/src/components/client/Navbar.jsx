import ThemeChanger from "../ui/ThemeChanger";

const Navbar = () => (
  <div className="navbar bg-base-300 px-4 py-2">
    <div className="flex-1">
      <button className="btn btn-ghost text-xl normal-case">TradeVista</button>
    </div>
    <div className="flex-none">
      <ThemeChanger />
    </div>
  </div>
);

export default Navbar;
