import { useEffect } from "react";
import { themeChange } from "theme-change";

const ThemeChanger = () => {
  useEffect(() => {
    themeChange(false); // Initializes the theme change without auto-init
  }, []);

  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn m-1">
        Theme
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-10"
      >
        <li>
          <button
            data-set-theme="light"
            data-act-class="active"
            className="btn btn-outline"
          >
            Light
          </button>
        </li>
        <li>
          <button
            data-set-theme="dark"
            data-act-class="active"
            className="btn btn-outline"
          >
            Dark
          </button>
        </li>
        <li>
          <button
            data-set-theme="cupcake"
            data-act-class="active"
            className="btn btn-outline"
          >
            Cupcake
          </button>
        </li>
        <li>
          <button
            data-set-theme="bumblebee"
            data-act-class="active"
            className="btn btn-outline"
          >
            Bumblebee
          </button>
        </li>
        <li>
          <button
            data-set-theme="emerald"
            data-act-class="active"
            className="btn btn-outline"
          >
            Emerald
          </button>
        </li>
        <li>
          <button
            data-set-theme="corporate"
            data-act-class="active"
            className="btn btn-outline"
          >
            Corporate
          </button>
        </li>
      </ul>
    </div>
  );
};

export default ThemeChanger;
