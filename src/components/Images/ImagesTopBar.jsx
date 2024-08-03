function ImagesTopBar({ searchQuery, setSearchQuery }) {
    return (
        <div className="flex flex-row items-center space-x-2 w-full overflow-hidden">
            <div className="flex flex-grow space-x-2">
                <label className="input input-sm input-bordered flex items-center gap-2 w-full">
                    <input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        type="text"
                        className="grow w-full"
                        placeholder="Search..."
                    />
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="h-4 w-4 opacity-70">
                        <path
                            fillRule="evenodd"
                            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                            clipRule="evenodd"
                        />
                    </svg>
                </label>

                {/* <select className="select select-bordered select-sm flex-shrink-0 flex-grow"
                    onChange={(e) => { onFilterChange(e.target.value) }}
                >
                    <option defaultValue={"All"}>All</option>
                    <option>Running</option>
                    <option>Stopped</option>
                </select> */}
            </div>
        </div>
    );
}

export default ImagesTopBar;