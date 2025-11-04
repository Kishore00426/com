import React from 'react';

const ProductFilters = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  categories,
  clearFilters,
  filteredCount,
  totalCount
}) => {
  return (
    <div className="mb-8 bg-inherit p-6 rounded-lg">
      <div className="flex flex-col xl:flex-row gap-4 items-center">
        {/* Search Input */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-slate-200 border-2 border-gray-600 rounded-md text-slate-950 placeholder-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-50"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-zinc-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-slate-50"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm font-medium text-gray-300">Sort by:</label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-zinc-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-slate-50"
          >
            <option value="">Default</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name</option>
            <option value="rating">Rating</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        {(searchTerm || selectedCategory || sortBy) && (
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-200"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Results Count */}
      <div className="mt-4 text-sm text-gray-400">
        Showing {filteredCount} of {totalCount} products
      </div>
    </div>
  );
};

export default ProductFilters;
