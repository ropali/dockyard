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
	  name: "name",
	  image: "MN",
	  accountNumber: "12345678",
	  accountName: "Dummy Jon",
	  amount: "$1134",
	}));
  
  const getColumns = () => [
	{
	  Header: "Name",
	  accessor: "name",
	  width: "300px",
	  Cell: ({ row, value }) => {
		return (
		  <div className="flex gap-2 items-center">
			<Avatar src={row.original.image} alt={`${value}'s Avatar`} />
			<div>{value}</div>
		  </div>
		);
	  },
	},
	{
	  Header: "Account Number",
	  accessor: "accountNumber",
	},
	{
	  Header: "Account Name",
	  accessor: "accountName",
	},
	{
	  Header: "Amount",
	  accessor: "amount",
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
		  className={`peer block w-full p-3 text-gray-600 focus:outline-none focus:ring-0 appearance-none ${
			disabled ? "bg-gray-200" : ""
		  } ${inputClassName}`}
		  disabled={disabled}
		/>
		<div
		  className={`flex items-center pl-3 py-3 text-gray-600 ${
			disabled ? "bg-gray-200" : ""
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
	  <InputGroup7
		name="search"
		value={globalFilter || ""}
		onChange={(e) => setGlobalFilter(e.target.value)}
		label="Search"
		decoration={<FaSearch size="1rem" className="text-gray-400" />}
		className={className}
	  />
	);
  }
  
  function Button2({ content, onClick, active, disabled }) {
	return (
	  <button
		className={`flex flex-col cursor-pointer items-center justify-center w-9 h-9 shadow-[0_4px_10px_rgba(0,0,0,0.03)] text-sm font-normal transition-colors rounded-lg
		${active ? "bg-red-500 text-white" : "text-red-500"}
		${
		  !disabled
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
	  <div className="w-full min-w-[30rem] p-4 bg-white rounded-xl shadow-[0_4px_10px_rgba(0,0,0,0.03)]">
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
						  className={`text-sm translate-y-1/2 ${
							column.isSorted && !column.isSortedDesc
							  ? "text-red-400"
							  : "text-gray-300"
						  }`}
						/>
						<FaSortDown
						  className={`text-sm -translate-y-1/2 ${
							column.isSortedDesc ? "text-red-400" : "text-gray-300"
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
	  </div>
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
	  <div className="flex flex-col gap-4">
		<div className="flex flex-col sm:flex-row justify-between gap-2">
		  <GlobalSearchFilter1
			className="sm:w-64"
			globalFilter={state.globalFilter}
			setGlobalFilter={setGlobalFilter}
		  />
		</div>
		<TableComponent
		  getTableProps={getTableProps}
		  headerGroups={headerGroups}
		  getTableBodyProps={getTableBodyProps}
		  rows={rows}
		  prepareRow={prepareRow}
		/>
		<div className="flex justify-end">
		  <PaginationNav1
			gotoPage={gotoPage}
			canPreviousPage={canPreviousPage}
			canNextPage={canNextPage}
			pageCount={pageCount}
			pageIndex={pageIndex}
			className="justify-end"
		  />
		</div>
	  </div>
	);
  }
  
  export { Table };
  