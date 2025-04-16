"use client";

import { useState, useEffect, useRef } from "react";
import {
  CloseRounded,
  KeyboardArrowDownRounded,
  KeyboardArrowUpRounded,
  SearchRounded,
} from "@mui/icons-material";
import { DropdownPropsInterface } from "@/types/ComponentInterface";

const Dropdown: React.FC<DropdownPropsInterface> = ({
  label,
  showLabel,
  options,
  value,
  onSelect,
  placeholder,
  required,
  isOpen,
  setIsOpen,
  error,
  search,
  disabled,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [focusedOptionIndex, setFocusedOptionIndex] = useState<number | null>(
    null
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const optionsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const applyFilters = () => {
      let newFilteredOptions = options;

      if (searchQuery) {
        newFilteredOptions = newFilteredOptions.filter((option) =>
          option.name?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      if (label?.toLowerCase() === "branch") {
        {
          !!newFilteredOptions.filter((option) => option.entryPoint).length
            ? (newFilteredOptions = newFilteredOptions.filter(
                (option) => option.entryPoint
              ))
            : (newFilteredOptions = newFilteredOptions.filter(
                (option) => option
              ));
        }
      }

      newFilteredOptions.sort((a, b) => a.name.localeCompare(b.name));

      setFilteredOptions(newFilteredOptions);
    };

    applyFilters();
  }, [searchQuery, options, label]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  useEffect(() => {
    if (value === placeholder) {
      setSelectedOption(null);
    }
  }, [value, placeholder]);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (focusedOptionIndex !== null && optionsContainerRef.current) {
      const focusedOption = optionsContainerRef.current.children[
        focusedOptionIndex
      ] as HTMLDivElement;
      if (focusedOption) {
        focusedOption.scrollIntoView({ block: "nearest" });
      }
    }
  }, [focusedOptionIndex]);

  const handleOptionClick = (option: {
    id: string;
    name: string;
    hasChildren?: boolean;
    hasClient?: boolean;
  }) => {
    const updatedOption = {
      ...option,
      hasChildren: option.hasChildren ?? false,
      hasClient: option.hasClient ?? false,
    };

    setSelectedOption(updatedOption.name);
    onSelect(updatedOption);
    setIsOpen(false);
    setFocusedOptionIndex(null);
  };

  const handleDropdownClick = () => {
    if (
      (value && value === placeholder && !selectedOption) ||
      (!value && !selectedOption)
    ) {
      setIsOpen(!isOpen);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case "ArrowDown":
        setFocusedOptionIndex((prevIndex) =>
          prevIndex === null
            ? 0
            : Math.min(prevIndex + 1, filteredOptions.length - 1)
        );
        break;
      case "ArrowUp":
        setFocusedOptionIndex((prevIndex) =>
          prevIndex === null ? 0 : Math.max(prevIndex - 1, 0)
        );
        break;
      case "Enter":
        if (focusedOptionIndex !== null) {
          handleOptionClick(filteredOptions[focusedOptionIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="relative inline-block text-left w-full"
      onKeyDown={handleKeyDown}
    >
      {label && showLabel && (
        <p className="text-text text-xs">
          {label} {required && <span className="text-error">*</span>}
        </p>
      )}
      <div>
        <button
          type="button"
          // className={`flex justify-between relative w-full rounded-xl h-9 border shadow-sm px-4 py-2 bg-none text-sm font-medium disabled:cursor-default disabled:opacity-60 ${
          className={`flex justify-between mb-1 w-full h-10 border border-primary  focus:outline-primary rounded-xl shadow-sm px-4 py-2 bg-white text-sm font-medium${
            (value && value !== placeholder) || selectedOption
              ? "text-primary cursor-default"
              : "text-text cursor-pointer"
          } ${error ? "" : ""}
          `}
          onClick={handleDropdownClick}
          disabled={disabled}
        >
          <span className={`truncate ${error ? "text-error" : ""}`}>
            {value ? value : selectedOption?.split("(")[0] || placeholder}
          </span>

          {selectedOption || (value && value !== placeholder) ? (
            <CloseRounded
              className={`ml-2 -mr-1 h-5 w-5 text-error cursor-pointer`}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedOption(null);
                onSelect({
                  id: "",
                  name: "",
                  hasChildren: false,
                  hasClient: false,
                });
              }}
            />
          ) : !isOpen ? (
            <KeyboardArrowDownRounded
              className={`ml-2 -mr-1 h-5 w-5 ${error ? "text-error" : ""}`}
            />
          ) : (
            <KeyboardArrowUpRounded
              className={`ml-2 -mr-1 h-5 w-5 ${error ? "text-error" : ""}`}
            />
          )}
        </button>
      </div>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-full rounded-xl shadow-lg bg-surface z-40">
          {search && (
            <div className="focus-within:bg-secondary px-4 py-2 flex gap-4 justify-around items-center rounded-t-xl">
              <SearchRounded className="text-white" />
              <input
                type="text"
                ref={searchInputRef}
                className="flex-1 text-sm bg-transparent text-white placeholder:text-text focus:outline-none"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}
          <div
            className="max-h-56 overflow-y-auto scrollbar-thin scrollbar-thumb-primary bg-white"
            ref={optionsContainerRef}
          >
            {!required && (
              <div
                className="block px-4 py-2 text-sm text-text cursor-pointer hover:text-white"
                onClick={() => {
                  setSelectedOption("None");
                  onSelect({
                    id: "",
                    name: "",
                    hasChildren: false,
                    hasClient: false,
                  });
                  setIsOpen(false);
                }}
              >
                None
              </div>
            )}
            {filteredOptions.length > 0
              ? filteredOptions.map((option, index) => (
                  <div
                    className={`block px-4 py-2 text-sm text-text hover:text-primary cursor-pointer rounded-b-xl ${
                      focusedOptionIndex === index ? "text-primary" : ""
                    }`}
                    onClick={() => handleOptionClick(option)}
                  >
                    {option.name}
                  </div>
                ))
              : !searchQuery && (
                  <div className="py-2">
                    <h1 className="text-error text-center">No Data Found</h1>
                  </div>
                )}
            {searchQuery && filteredOptions.length === 0 && (
              <div className="text-center text-error font-bold py-2">
                No search results!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
