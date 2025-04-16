"use client";

import { useState, useEffect, useRef } from "react";
import { KeyboardArrowDownRounded, SearchRounded } from "@mui/icons-material";
import { EditDropdownPropsInterface } from "@/types/ComponentInterface";

const EditDropdown: React.FC<EditDropdownPropsInterface> = ({
  options,
  onSelect,
  placeholder,
  initialValue,
  className,
  required,
  search,
  isOpen,
  setIsOpen,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [selectedOption, setSelectedOption] = useState<string | null>(
    initialValue ? initialValue.name : null
  );
  const [focusedOptionIndex, setFocusedOptionIndex] = useState<number | null>(
    null
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const optionsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialValue) {
      setSelectedOption(initialValue.name);
    }
    setFilteredOptions(
      options.filter((option) =>
        option.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [initialValue, searchQuery, options]);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        setIsOpen(!isOpen);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (
      focusedOptionIndex !== null &&
      optionsContainerRef.current &&
      focusedOptionIndex >= 0
    ) {
      const focusedOption = optionsContainerRef.current.children[
        focusedOptionIndex
      ] as HTMLDivElement;

      if (focusedOption) {
        focusedOption.scrollIntoView({
          block: "nearest",
        });
      }
    }
  }, [focusedOptionIndex]);

  const handleOptionClick = (option: { id: string; name: string }) => {
    setSelectedOption(option.name);
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div
      ref={dropdownRef}
      className={`relative inline-block bg-surface inner-border-2 inner-border-primary text-text rounded-lg ${className}`}
    >
      <div>
        <button
          type="button"
          className={`${className} w-full flex`}
          onClick={() => {
            setSearchQuery("");
            setIsOpen(!isOpen);
          }}
        >
          <p className="flex-1 text-left pl-2">
            {selectedOption || placeholder}
          </p>
          <KeyboardArrowDownRounded className="" />
        </button>
      </div>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-full rounded-lg shadow-lg bg-surface z-10 border">
          {search && (
            <div
              className={`focus-within:bg-secondary px-4 py-2 flex gap-4 justify-around items-center rounded-t-xl`}
            >
              <SearchRounded className="text-white" />
              <input
                type="text"
                ref={searchInputRef}
                className="flex-1 text-sm bg-transparent text-text placeholder:text-primary focus:outline-none"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}
          <div
            ref={optionsContainerRef}
            className="max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-primary"
          >
            {!required && (
              <div
                className="block px-4 py-2 text-sm text-text cursor-pointer hover:text-primary"
                onClick={() => {
                  setSelectedOption("None");
                  setIsOpen(!isOpen);
                }}
              >
                None
              </div>
            )}
            {filteredOptions.map((option) => (
              <div
                key={option.id}
                className="block px-4 py-2 text-sm hover:text-primary cursor-pointer last:rounded-b-3xl"
                onClick={() => handleOptionClick(option)}
              >
                {option.name}
              </div>
            ))}
            {!!searchQuery && !filteredOptions.length && (
              <div className="text-error font-bold text-center">
                No results found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EditDropdown;
