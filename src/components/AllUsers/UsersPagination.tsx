interface PaginationProps {
	currentPage: number;
	lastPage: number;
	totalItems: number;
	onPageChange: (page: number) => void;
}

export const UsersPagination: React.FC<PaginationProps> = ({
	currentPage,
	lastPage,
	totalItems,
	onPageChange,
}) => {
	const handlePageChange = (page: number) => {
		if (page > 0 && page <= lastPage) {
			onPageChange(page);
		}
	};

	return (
		<div className="flex items-center justify-between mt-4 text-xs">
			<div className="text-xs flex gap-6">
				<div>
					{currentPage} of {lastPage}
				</div>{" "}
				<div>Total users: {totalItems}</div>
			</div>
			<div className="flex items-center space-x-2">
				<button
					onClick={() => handlePageChange(currentPage - 1)}
					disabled={currentPage === 1}
					className={`px-3 py-1 border rounded ${
						currentPage === 1
							? "bg-gray-700 text-gray-300 cursor-not-allowed"
							: "bg-gray-800 hover:bg-gray-700 cursor-pointer"
					}`}>
					Previous
				</button>
				<button
					onClick={() => handlePageChange(currentPage + 1)}
					disabled={currentPage === lastPage}
					className={`px-3 py-1 border rounded ${
						currentPage === lastPage
							? "bg-gray-700 text-gray-300 cursor-not-allowed"
							: "bg-gray-800 hover:bg-gray-700 cursor-pointer"
					}`}>
					Next
				</button>
			</div>
		</div>
	);
};
