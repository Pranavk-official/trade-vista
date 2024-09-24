const ThemeSwitcher = () => {
  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn m-1">
        Theme
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
      >
        <li>
          <a data-set-theme="light" data-act-class="ACTIVECLASS">
            Light
          </a>
        </li>
        <li>
          <a data-set-theme="dark" data-act-class="ACTIVECLASS">
            Dark
          </a>
        </li>
        <li>
          <a data-set-theme="cupcake" data-act-class="ACTIVECLASS">
            Cupcake
          </a>
        </li>
      </ul>
    </div>
  );
};

export default ThemeSwitcher;
