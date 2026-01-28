export default function Header({ setAddModalOpen }: { setAddModalOpen: (open: boolean) => void }) {
    return (
        <div className="mb-6 ">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-2">
                <div className="flex-1">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 my-auto">Welcome to Investment Tracker</h1>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-4">
                    <button
                        onClick={() => setAddModalOpen(true)}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center"
                    >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="hidden sm:inline">Add Investment</span>
                        <span className="sm:hidden">Add</span>
                    </button>

                </div>
            </div>
        </div>
    );
}