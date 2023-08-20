import React from 'react';

const Navbar2: React.FC = () => {
    return (
        <header className="flex flex-wrap sm:justify-start sm:flex-nowrap z-50 w-full bg-white text-sm py-4 dark:bg-gray-800" style={{borderRadius: '5px'}}>
            <nav className="max-w-[85rem] w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between" aria-label="Global">
                <div className="flex items-center justify-between">
                    <a className="inline-flex items-center gap-x-2 text-xl font-semibold dark:text-white" href="#">
                        <img src="/logo.jpeg" alt="Logo" className="w-10 h-auto" />
                        Terminal
                    </a>
                    <div className="sm:hidden">
                        <button type="button" className="hs-collapse-toggle p-2 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white dark:focus:ring-offset-gray-800" data-hs-collapse="#navbar-image-and-text-1" aria-controls="navbar-image-and-text-1" aria-label="Toggle navigation">
                        
                        </button>
                    </div>
                </div>
                <div id="navbar-image-and-text-1" className="hs-collapse hidden overflow-hidden transition-all duration-300 basis-full grow sm:block">
                    <div className="flex flex-col gap-5 mt-5 sm:flex-row sm:items-center sm:justify-end sm:mt-0 sm:pl-5">
                        <a className="font text-base text-white dark:text-white dark:hover:text-gray-500" href="#">Very Açaí - A Friendly Place</a> 
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Navbar2;

