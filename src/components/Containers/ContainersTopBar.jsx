

function ContainersTopBar({ searchQuery, setSearchQuery, showAll, setShowAll }) {
    return (
        <div className="flex flex-col items-start  space-y-1">
            <label className="input input-sm input-bordered flex items-center gap-2 w-full">
                <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    type="text" className="grow" placeholder="Search..." />
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-4 w-4 opacity-70">
                    <path
                        fillRule="evenodd"
                        d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                        clipRule="evenodd" />
                </svg>
            </label>

            <div className="form-control">
                <label className="label cursor-pointer">
                    <span className="label-text mr-2">Show All</span>
                    <input
                        type="checkbox"
                        checked={showAll}
                        className="checkbox checkbox-primary checkbox-xs"
                        onChange={(e) => setShowAll(e.target.checked)}
                    />
                </label>
            </div>
        </div>
    );
}


export default ContainersTopBar