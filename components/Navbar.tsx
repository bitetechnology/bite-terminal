import React from "react";

const Navbar: React.FC = () => {
  return (
    <div className="w-full">
      <header className="flex flex-wrap sm:justify-start sm:flex-nowrap z-50 w-full rounded-md bg-black text-sm py-4">
        <nav
          className="max-w-[85rem] w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between"
          aria-label="Global"
        >
          <div className="flex items-center justify-between">
            <a className="flex-none text-xl font-semibold text-white" href="#">
              BiTE
            </a>
            <div className="sm:hidden">
              <button
                type="button"
                className="hs-collapse-toggle p-2 inline-flex justify-center items-center gap-2 rounded-md border border-white/[.25] font-medium bg-blue-600 text-white shadow-sm align-middle hover:bg-white/[.15] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-600 focus:ring-white transition-all text-sm"
                data-hs-collapse="#navbar-primary"
                aria-controls="navbar-primary"
                aria-label="Toggle navigation"
              ></button>
            </div>
          </div>
          <div
            id="navbar-primary"
            className="hs-collapse hidden overflow-hidden transition-all duration-300 basis-full grow sm:block"
          >
            <div className="flex flex-col gap-5 mt-5 sm:flex-row sm:items-center sm:justify-end sm:mt-0 sm:pl-5">
              <a
                className="font-medium text-gray-300 hover:text-white"
                href="#"
              >
                Very Açai
              </a>
            </div>
          </div>
        </nav>
      </header>

      <div className="flex flex-col items-center justify-center h-[calc(2*3rem+1.5rem+100px)] bg-rgb(245 247 249 / var(--tw-bg-opacity)) m-0">
        <img src="/laptop.png" alt="laptop" className="w-24 h-24 mb-4" />
        <span
          className="text-black font-bold text-3xl"
          style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
        >
          Bite Terminal
        </span>
      </div>
    </div>
  );
};

export default Navbar;
