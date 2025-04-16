import { SvgIconComponent } from "@mui/icons-material";
import {
  InventoryDescriptionInterface,
  InventoryDetailInterface,
  InventoryListInterface,
} from "./InventoryInterface";
import { CheckoutInventoryDescriptionDetailInterface } from "@/types/CheckoutInterface";

import { CheckoutsResponseInterface } from "@/types/CheckoutInterface";
import { ReactNode } from "react";

export interface CancelConfirmationModalPropsInterface {
  onConfirm: () => void;
  onCancel: () => void;
}

export interface ButtonPropsInterface {
  href: string;
  text: string;
  Icon?: SvgIconComponent;
  className?: string;
}

interface DataItem {
  CompanyName: string;
  BranchName: string;
  ShortName: string;
  Description: string;
  Stock: number;
  AvailableQty: number;
  OnHold: number;
}
// export interface CheckoutCardPropsInterface {
//   data: DataItem[]; // Array of data items
//   selectedItems: string[]; // Array of selected item short names
//   handleCheckboxChange: (shortName: string) => void; // Function to handle checkbox change
//   description:CheckoutInventoryDescriptionDetailInterface
//   onAddtoCheckout:() => void
// }
export interface CheckoutCardPropsInterface {
  description: CheckoutInventoryDescriptionDetailInterface;
  onAddToCheckout?: (description: { Id: string; Description: string }) => void;
}

export interface ItemDescription {
  CompanyName: string;
  BranchName: string;
  ShortName: string;
  Description: string;
  Stock: number;
  AvailableQty: number;
  OnHold: number;
}

// Define the props interface
// export interface CheckoutCardPropsInterface {
//   data: ItemDescription[];
//   selectedItems: string[];
//   handleCheckboxChange: (shortName: string) => void;
// }

export interface checkoutListCardPropsInterface {
  checkoutListItem: CheckoutsResponseInterface;
  isreturn?: boolean;
  isinvoice?: boolean;
  checkoutNumber?: string;
  onHasReturnChange?: (hasReturn: boolean) => void;
}

export interface checkoutListInnerCardPropsInterface {
  checkoutNumber: string;
  handleHasReturn: (hasReturn: boolean) => void;
}

export interface BarcodeInputFormPropsInterface {
  onChange: (barcode: string) => void;
  onClick?: (index: Number | undefined) => void;
  value?: string | undefined;
  index?: Number;

  className?: string;
}

export interface DescriptionCardPropsInterface {
  description: {
    Id: string;
    Description: string;
    ManufacturerName: string | undefined;
    ShortName: string;
    ClientName: string;
    Stock: number;
    CategoryName?: string;
    ModelName?: string;
    PartNumber?: string;
    Location?: string;
    SmallUnit?: string;
    BranchName?: string;
  };
  title?: string;
  hasPartNumber?: boolean | null;
  hasModelName?: boolean | null;
}

export interface DropdownPropsInterface {
  label?: string;
  showLabel?: boolean;
  options: {
    id: string;
    name: string;
    isExpiry?: boolean;
    entryPoint?: boolean;
    hasModelName?: boolean;
    hasPartNumber?: boolean;
  }[];
  value?: any;
  onSelect: (option: {
    id: string;
    name: string;
    isExpiry?: boolean;
    hasChildren: boolean;
    hasClient: boolean;
  }) => void;
  placeholder: string;
  required?: boolean;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  error?: boolean;
  search?: boolean;
  disabled?: boolean;
}

export interface EditDropdownPropsInterface {
  options: { id: string; name: string }[];
  onSelect: (option: { id: string; name: string }) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  initialValue?: { id: string; name: string };
  search?: boolean;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export interface InventoryCardPropsInterface {
  inventory: InventoryListInterface;
  descriptionId: string;
}

export interface LayoutPropsInterface {
  children: ReactNode;
}

export interface PaginationPropsInterface {
  currentPage: number;
  totalPages: number;
}

export interface SearchInputPropsInterface {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

export interface SectionHeaderPropsInterface {
  title: string;
  stock?: string;
  button?: boolean;
  buttonClass?: string;
  buttonText?: string;
  buttonIcon?: SvgIconComponent;
  buttonHref?: string;
}

export interface SidebarSectionInterface {
  Id: string;
  Uri: string;
  Name: string;
  Code: string;
  SideBarDropdowns: SideBarDropdownInterface[] | null;
  PageDropdowns?: {
    Name: string;
  }[];
}

export interface SideBarDropdownInterface {
  Id: string;
  Uri: string;
  Name: string;
  ParentId: string;
  PageDropdowns: DropdownInterface[] | null;
}

export interface DropdownInterface {
  Id: string;
  Uri: string;
  Name: string;
  ParentId: string;
  CanCreate: string;
  CanDelete: string;
  CanUpdate: string;
}

export interface DeficitOptionsProps {
  onBack: () => void;
  onBranchTransfer?: () => void;
  onNotify: () => void;
  isBranchTransfer?: boolean;
}

export interface SidebarSubsectionInterface {
  title: string;
  id: string;
  href: string;
  subItems?: Array<SidebarSubsectionInterface>;
}

export interface TableHeaderPropsInterface {
  tableTitle: string;
  dataTitle?: string;
  button?: boolean;
  hasPartNumber?: boolean | null;
  hasModelName?: boolean | null;
  hasExpiryDate?: boolean | null;
  handleSortChange?: (column: string) => void;
  sortby?: string;
  sortorder?: "asc" | "desc";
}

export interface UpdateInventoryFormPropsInterface {
  inventory: InventoryDetailInterface;
  onSave: (status: boolean) => void;
  isCheckin?: boolean;
}

export interface DeficitQtyModalInterface {
  inventoryDescription: InventoryDescriptionInterface;
  currentCompany: { id?: string; name?: string };
  currentBranch: { id?: string; name?: string };
  onNotify: () => void;
  onBack: () => void;
}

export interface InventoryPerCompanyResponse {
  AvailableQuantity: number;
  BranchId: string;
  BranchName: string;
}
