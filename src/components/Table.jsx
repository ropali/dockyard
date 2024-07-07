import {
	useTable,
	useGlobalFilter,
	useSortBy,
	usePagination,
} from "react-table";
import { useMemo, Fragment, useCallback } from "react";
import {
	FaSearch,
	FaChevronDown,
	FaCheck,
	FaChevronLeft,
	FaChevronRight,
	FaSortUp,
	FaSortDown,
} from "react-icons/fa";
import { Listbox, Transition } from "@headlessui/react";

function Avatar({ src, alt = "avatar" }) {
	return (
		<img src={src} alt={alt} className="w-8 h-8 rounded-full object-cover" />
	);
}

const generateData = (numberOfRows = 25) =>
	[...Array(numberOfRows)].map(() => ({
		id: "3124adad",
		image: "hello-world",
		command: "/hello",
		created: "5 weeks ago",
		status: "Exited (0) 5 weeks ago",
	}));

const getColumns = () => [
	{
		Header: "ID",
		accessor: "id",

	},
	{
		Header: "IMAGE",
		accessor: "image",
		width: "300px"
	},
	{
		Header: "COMMAND",
		accessor: "command",
	},
	{
		Header: "CREATED",
		accessor: "created",
	},
	{
		Header: "STATUS",
		accessor: "status",
	},
];

function InputGroup7({
	label,
	name,
	value,
	onChange,
	type = "text",
	decoration,
	className = "",
	inputClassName = "",
	decorationClassName = "",
	disabled,
}) {
	return (
		<div
			className={`flex flex-row-reverse items-stretch w-full rounded-xl overflow-hidden bg-white shadow-[0_4px_10px_rgba(0,0,0,0.03)] ${className}`}
		>
			<input
				id={name}
				name={name}
				value={value}
				type={type}
				placeholder={label}
				aria-label={label}
				onChange={onChange}
				className={`peer w-full p-3 text-gray-600 focus:outline-none focus:ring-0 appearance-none ${disabled ? "bg-gray-200" : ""
					} ${inputClassName}`}
				disabled={disabled}
			/>
			<div
				className={`flex items-center pl-3 py-3 text-gray-600 ${disabled ? "bg-gray-200" : ""
					} ${decorationClassName}`}
			>
				{decoration}
			</div>
		</div>
	);
}

function GlobalSearchFilter1({
	globalFilter,
	setGlobalFilter,
	className = "",
}) {
	return (

		<div className="flex justify-end mt-4">
			<div class="relative">
				<input
					type="text"
					id="Search"
					placeholder="Search for..."
					class="w-full rounded-md border-gray-200 bg-gray-100 py-2 px-1 pe-10 shadow-sm sm:text-sm"
				/>

				<span class="absolute inset-y-0 end-0 grid w-10 place-content-center">
					<button type="button" class="text-gray-600 hover:text-gray-700">
						<span class="sr-only">Search</span>

						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="h-4 w-4"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
							/>
						</svg>
					</button>
				</span>
			</div>
		</div>


	);
}

function Button2({ content, onClick, active, disabled }) {
	return (
		<button
			className={`flex flex-col cursor-pointer items-center justify-center w-9 h-9 shadow-[0_4px_10px_rgba(0,0,0,0.03)] text-sm font-normal transition-colors rounded-lg
		${active ? "bg-red-500 text-white" : "text-red-500"}
		${!disabled
					? "bg-white hover:bg-red-500 hover:text-white"
					: "text-red-300 bg-white cursor-not-allowed"
				}
		`}
			onClick={onClick}
			disabled={disabled}
		>
			{content}
		</button>
	);
}

function PaginationNav1({
	gotoPage,
	canPreviousPage,
	canNextPage,
	pageCount,
	pageIndex,
	className,
}) {
	const renderPageLinks = useCallback(() => {
		if (pageCount === 0) return null;
		const visiblePageButtonCount = 3;
		let numberOfButtons =
			pageCount < visiblePageButtonCount ? pageCount : visiblePageButtonCount;
		const pageIndices = [pageIndex];
		numberOfButtons--;
		[...Array(numberOfButtons)].forEach((_item, itemIndex) => {
			const pageNumberBefore = pageIndices[0] - 1;
			const pageNumberAfter = pageIndices[pageIndices.length - 1] + 1;
			if (
				pageNumberBefore >= 0 &&
				(itemIndex < numberOfButtons / 2 || pageNumberAfter > pageCount - 1)
			) {
				pageIndices.unshift(pageNumberBefore);
			} else {
				pageIndices.push(pageNumberAfter);
			}
		});
		return pageIndices.map((pageIndexToMap) => (
			<li key={pageIndexToMap}>
				<Button2
					content={pageIndexToMap + 1}
					onClick={() => gotoPage(pageIndexToMap)}
					active={pageIndex === pageIndexToMap}
				/>
			</li>
		));
	}, [pageCount, pageIndex]);
	return (
		<ul className={`flex gap-2 ${className}`}>
			<li>
				<Button2
					content={
						<div className="flex ml-1">
							<FaChevronLeft size="0.6rem" />
							<FaChevronLeft size="0.6rem" className="-translate-x-1/2" />
						</div>
					}
					onClick={() => gotoPage(0)}
					disabled={!canPreviousPage}
				/>
			</li>
			{renderPageLinks()}
			<li>
				<Button2
					content={
						<div className="flex ml-1">
							<FaChevronRight size="0.6rem" />
							<FaChevronRight size="0.6rem" className="-translate-x-1/2" />
						</div>
					}
					onClick={() => gotoPage(pageCount - 1)}
					disabled={!canNextPage}
				/>
			</li>
		</ul>
	);
}

function TableComponent({
	getTableProps,
	headerGroups,
	getTableBodyProps,
	rows,
	prepareRow,
}) {
	return (

		<table {...getTableProps()}>
			<thead>
				{headerGroups.map((headerGroup) => (
					<tr {...headerGroup.getHeaderGroupProps()}>
						{headerGroup.headers.map((column) => (
							<th
								{...column.getHeaderProps(column.getSortByToggleProps())}
								className="px-3 text-start text-xs font-light uppercase cursor-pointer"
								style={{ width: column.width }}
							>
								<div className="flex gap-2 items-center">
									<div className="text-gray-600">
										{column.render("Header")}
									</div>
									<div className="flex flex-col">
										<FaSortUp
											className={`text-sm translate-y-1/2 ${column.isSorted && !column.isSortedDesc
												? "text-red-400"
												: "text-gray-300"
												}`}
										/>
										<FaSortDown
											className={`text-sm -translate-y-1/2 ${column.isSortedDesc ? "text-red-400" : "text-gray-300"
												}`}
										/>
									</div>
								</div>
							</th>
						))}
					</tr>
				))}
			</thead>
			<tbody {...getTableBodyProps()}>
				{rows.map((row, i) => {
					prepareRow(row);
					return (
						<tr {...row.getRowProps()} className="hover:bg-gray-100">
							{row.cells.map((cell) => {
								return (
									<td
										{...cell.getCellProps()}
										className="p-3 text-sm font-normal text-gray-700 first:rounded-l-lg last:rounded-r-lg"
									>
										{cell.render("Cell")}
									</td>
								);
							})}
						</tr>
					);
				})}
			</tbody>
		</table>

	);
}

function Table() {
	const data = useMemo(() => generateData(100), []);
	const columns = useMemo(getColumns, []);
	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		prepareRow,
		state,
		setGlobalFilter,
		page: rows,
		canPreviousPage,
		canNextPage,
		pageCount,
		gotoPage,
		setPageSize,
		state: { pageIndex, pageSize },
	} = useTable(
		{
			columns,
			data,
			initialState: { pageSize: 5 },
		},
		useGlobalFilter,
		useSortBy,
		usePagination
	);
	return (
		<div className="w-full min-w-[30rem] p-4 bg-white rounded-xl shadow-[0_4px_10px_rgba(0,0,0,0.03)]">
			<div className="flex flex-col gap-4">
				<div className="flex flex-col sm:flex-row justify-between gap-2">
					<GlobalSearchFilter1
						className="sm:w-64"
						globalFilter={state.globalFilter}
						setGlobalFilter={setGlobalFilter}
					/>
				</div>
				<span className="flex items-center mt-1">
					<span className="h-px flex-1 bg-gray-200"></span>
				</span>
				<TableComponent
					getTableProps={getTableProps}
					headerGroups={headerGroups}
					getTableBodyProps={getTableBodyProps}
					rows={rows}
					prepareRow={prepareRow}
					footerGroups={""}
				/>

			</div>
			<span className="flex items-center mt-1">
				<span className="h-px flex-1 bg-gray-200"></span>
			</span>

			<div className="flex justify-end mt-4">

				<div className="mr-5">
					<select
						name="HeadlineAct"
						id="HeadlineAct"
						className="mt-1.5 w-full rounded-lg border-gray-300 text-gray-700 sm:text-sm"
					>
						<option value="">10</option>
						<option value="">20</option>
						<option value="">50</option>
						<option value="">100</option>

					</select>
				</div>


				<PaginationNav1
					gotoPage={gotoPage}
					canPreviousPage={canPreviousPage}
					canNextPage={canNextPage}
					pageCount={pageCount}
					pageIndex={pageIndex}
				/>

			</div>
		</div>

	);
}

export { Table };
