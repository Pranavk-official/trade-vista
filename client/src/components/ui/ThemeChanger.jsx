import { useEffect } from "react";
import { themeChange } from "theme-change";

const ThemeChanger = () => {
  useEffect(() => {
    themeChange(false); // Initializes the theme change without auto-init
  }, []);

  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn m-1" htmlFor="theme-options">
        Theme
      </label>
      <ul
        id="theme-options"
        tabIndex={0}
        className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-50"
      >
        <li>
          <button
            data-set-theme="light"
            data-act-class="active"
            className="btn btn-outline w-full"
          >
            Light
          </button>
        </li>
        <li>
          <button
            data-set-theme="dark"
            data-act-class="active"
            className="btn btn-outline w-full"
          >
            Dark
          </button>
        </li>
        <li>
          <button
            data-set-theme="cupcake"
            data-act-class="active"
            className="btn btn-outline w-full"
          >
            Cupcake
          </button>
        </li>
        <li>
          <button
            data-set-theme="bumblebee"
            data-act-class="active"
            className="btn btn-outline w-full"
          >
            Bumblebee
          </button>
        </li>
        <li>
          <button
            data-set-theme="emerald"
            data-act-class="active"
            className="btn btn-outline w-full"
          >
            Emerald
          </button>
        </li>
        <li>
          <button
            data-set-theme="corporate"
            data-act-class="active"
            className="btn btn-outline w-full"
          >
            Corporate
          </button>
        </li>
      </ul>
    </div>
  );
};

export default ThemeChanger;
