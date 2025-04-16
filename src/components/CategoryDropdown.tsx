"use client";

import { DropdownPropsInterface } from "@/types/ComponentInterface";
import Dropdown from "./Dropdown";
import { useState } from "react";
import { useCategoryList } from "@/app/hooks/categories/useCategoryList";

interface CategoryDropdownProps
  extends Omit<DropdownPropsInterface, "options" | "onSelect"> {
  authKey: string;
  currentPage: number;
  itemsPerPage: number;
  category?: { id: string };
  onSelectCategory: (option: { id: string; name: string }) => void;
}

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  authKey,
  currentPage,
  itemsPerPage,
  category,
  onSelectCategory,
  isOpen,
  setIsOpen,
  placeholder = "Categories",
  ...rest
}) => {
  const {
    data: categoryList,
    isLoading,
    error,
  } = useCategoryList(authKey, {
    page: currentPage,
    limit: itemsPerPage,
    categoryId: category?.id || "",
  });

  return (
    <Dropdown
      label="Category"
      placeholder="Categories"
      options={
        categoryList?.data.map((category) => ({
          id: category.Id,
          name: category.Name,
        })) ?? []
      }
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      onSelect={onSelectCategory}
      required
      search
      {...rest}
    />
  );
};

export default CategoryDropdown;
