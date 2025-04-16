import React from "react";
import { SearchRounded } from "@mui/icons-material";
import { SearchInputPropsInterface } from "@/types/ComponentInterface";

const SearchInput: React.FC<SearchInputPropsInterface> = ({
  searchTerm,
  setSearchTerm,
}) => {
  return (
    <label className="relative">
      <span className="sr-only">Search</span>
      <span className="absolute inset-y-0 left-0 flex items-center pl-1">
        <SearchRounded className="text-bold" />
      </span>
      <input
        // className="placeholder:text-primary bg-transparent w-full border border-grey rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-text focus:ring-text focus:placeholder:text-text focus:ring-1 sm:text-sm"
        className="w-full px-4 py-2 border border-gray-300 rounded-xl font-bold pl-10"
        placeholder="Search"
        type="text"
        name="search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </label>
  );
};

export default SearchInput;
