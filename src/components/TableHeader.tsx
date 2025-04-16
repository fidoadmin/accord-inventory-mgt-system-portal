"use client";
import { TableHeaderPropsInterface } from "@/types/ComponentInterface";
import { useEffect, useState } from "react";

const TableHeader: React.FC<TableHeaderPropsInterface> = ({
  tableTitle,
  dataTitle,
  button,
  hasModelName,
  hasPartNumber,
  handleSortChange,
  sortby,
  sortorder,
}) => {
  const handleSort = (column: string) => {
    handleSortChange && handleSortChange(column);
  };
  const [roleCode, setRoleCode] = useState<string | null>(null);

  useEffect(() => {
    const RoleCode = localStorage.getItem("RoleCode");
    setRoleCode(RoleCode);
  }, []);
  return (
    <div>
      {tableTitle.toLowerCase() === "description" && (
        <div className="tableHeader w-auto flex justify-between  items-center p-2 bg-tablehead border-b text-black rounded-xl text-sm truncate whitespace-nowrap">
          <p
            className="w-full text-center cursor-pointer table-fixed"
            onClick={() => handleSort("manufacturername")}
          >
            Manufacturer{" "}
            {sortby === "manufacturername" && (sortorder === "asc" ? "↑" : "↓")}
          </p>
          <p
            className="w-full text-center cursor-pointer"
            onClick={() => handleSort("description")}
          >
            Description{" "}
            {sortby === "description" && (sortorder === "asc" ? "↑" : "↓")}
          </p>
          <p
            className="w-full text-center cursor-pointer"
            onClick={() => handleSort("shortname")}
          >
            Short Name{" "}
            {sortby === "shortname" && (sortorder === "asc" ? "↑" : "↓")}
          </p>
          {roleCode === "USERROLE_SYSTEMADMIN" && (
            <p
              className="w-full text-center cursor-pointer"
              onClick={() => handleSort("clientname")}
            >
              Client
              {sortby === "clientname" && (sortorder === "asc" ? "↑" : "↓")}
            </p>
          )}
          {dataTitle !== "inventory" && (
            <p
              className="w-full text-center cursor-pointer"
              onClick={() => handleSort("categoryname")}
            >
              Category{" "}
              {sortby === "categoryname" && (sortorder === "asc" ? "↑" : "↓")}
            </p>
          )}
          {hasModelName && <p className="w-full text-center">Model Name</p>}
          {hasPartNumber && <p className="w-full text-center">Part Number</p>}
          <p
            className="w-full text-center cursor-pointer"
            onClick={() => handleSort("stock")}
          >
            Stock {sortby === "stock" && (sortorder === "asc" ? "↑" : "↓")}
          </p>
          <p
            className="w-full text-center cursor-pointer"
            onClick={() => handleSort("smallunit")}
          >
            Container Unit{" "}
            {sortby === "smallunit" && (sortorder === "asc" ? "↑" : "↓")}
          </p>
          <p
            className="w-full text-center cursor-pointer"
            onClick={() => handleSort("location")}
          >
            Location{" "}
            {sortby === "location" && (sortorder === "asc" ? "↑" : "↓")}
          </p>
          <p
            className="w-full text-center cursor-pointer"
            onClick={() => handleSort("branchname")}
          >
            Branch{" "}
            {sortby === "branchname" && (sortorder === "asc" ? "↑" : "↓")}
          </p>
        </div>
      )}
      {tableTitle.toLowerCase() === "inventory" && (
        <div className="tableHeader flex justify-between gap-2 items-center p-2  bg-tablehead border-2 text-black rounded-xl text-sm">
          <p
            className="w-full text-center cursor-pointer table-fixed"
            onClick={() => handleSort("barcode")}
          >
            Bar Code {sortby === "barcode" && (sortorder === "asc" ? "↑" : "↓")}
          </p>
          <p
            className="w-full text-center cursor-pointer table-fixed"
            onClick={() => handleSort("batchnumber")}
          >
            Batch Number
            {sortby === "batchnumber" && (sortorder === "asc" ? "↑" : "↓")}
          </p>
          <p
            className="w-full text-center cursor-pointer table-fixed"
            onClick={() => handleSort("packsize")}
          >
            Pack Size
            {sortby === "packsize" && (sortorder === "asc" ? "↑" : "↓")}
          </p>
          <p
            className="w-full text-center cursor-pointer table-fixed"
            onClick={() => handleSort("expirationdate")}
          >
            Expiry Date
            {sortby === "expirationdate" && (sortorder === "asc" ? "↑" : "↓")}
          </p>
          <p
            className="w-full text-center cursor-pointer table-fixed"
            onClick={() => handleSort("stock")}
          >
            Quantity
            {sortby === "stock" && (sortorder === "asc" ? "↑" : "↓")}
          </p>
          <p
            className="w-full text-center cursor-pointer table-fixed"
            onClick={() => handleSort("created")}
          >
            Created {sortby === "created" && (sortorder === "asc" ? "↑" : "↓")}
          </p>
        </div>
      )}
      {tableTitle.toLowerCase() === "checkout" && (
        <div className="relative border-2 rounded-lg overflow-hidden">
          <table className="w-full table-auto">
            <thead className="bg-tableheader">
              <tr className="border-b-2">
                <th className="p-2"></th>
                <th className="p-2">Short Name</th>
                <th className="p-2">Company Name</th>
                <th className="p-2">Branch Name</th>
                <th className="p-2">Stock</th>
                <th className="p-2">Qty</th>
              </tr>
            </thead>
          </table>
        </div>
      )}

      {tableTitle.toLowerCase() === "checkoutlist" && (
        <div className="tableHeader flex justify-between gap-2 items-center p-2 bg-tablehead border-2 font-bold rounded-xl text-sm">
          <p
            className="w-1/6 text-center cursor-pointer"
            onClick={() => handleSort("checkoutnumber")}
          >
            Checkout Number
            {sortby === "checkoutnumber" && (
              <span className="ml-2">{sortorder === "asc" ? "↑" : "↓"}</span>
            )}
          </p>
          {roleCode === "USERROLE_SYSTEMADMIN" && (
            <p
              className="w-1/6 text-center cursor-pointer"
              onClick={() => handleSort("clientname")}
            >
              Client
              {sortby === "clientname" && (sortorder === "asc" ? "↑" : "↓")}
            </p>
          )}
          <p
            className="w-1/6 text-center cursor-pointer"
            onClick={() => handleSort("statusname")}
          >
            Status
            {sortby === "statusname" && (
              <span className="ml-2">{sortorder === "asc" ? "↑" : "↓"}</span>
            )}
          </p>

          <p
            className="w-1/6 text-center cursor-pointer"
            onClick={() => handleSort("checkouttypename")}
          >
            Type
            {sortby === "checkouttypename" && (
              <span className="ml-2">{sortorder === "asc" ? "↑" : "↓"}</span>
            )}
          </p>

          <p
            className="w-1/6 text-center cursor-pointer"
            onClick={() => handleSort("created")}
          >
            Date
            {sortby === "created" && (
              <span className="ml-2">{sortorder === "asc" ? "↑" : "↓"}</span>
            )}
          </p>

          <p
            className="w-1/6 text-center cursor-pointer"
            onClick={() => handleSort("checkoutstartedby")}
          >
            Initiated By
            {sortby === "checkoutstartedby" && (
              <span className="ml-2">{sortorder === "asc" ? "↑" : "↓"}</span>
            )}
          </p>

          <p
            className="w-1/6 text-center cursor-pointer"
            onClick={() => handleSort("checkoutcompletedby")}
          >
            Completed By
            {sortby === "checkoutcompletedby" && (
              <span className="ml-2">{sortorder === "asc" ? "↑" : "↓"}</span>
            )}
          </p>

          <div className="w-6" />
        </div>
      )}

      {tableTitle.toLowerCase() === "innercheckoutlist" && (
        <div className="tableHeader w-full mx-auto flex justify-between gap-2 items-center p-2 bg-tablehead border-2 text-black rounded-xl text-sm">
          <p className="w-full text-center">Challan Number</p>
          <p className="w-full text-center">From:</p>
          <p className="w-full text-center">To:</p>
        </div>
      )}

      {tableTitle.toLowerCase() === "usermaintenance" && (
        <div className="tableHeader w-auto flex justify-between  items-center p-4 bg-tablehead border-b text-black rounded-xl text-sm truncate whitespace-nowrap">
          <p
            className="w-1/6 text-center cursor-pointer"
            onClick={() => handleSort("staffnumber")}
          >
            Staff Number
            {sortby === "staffnumber" && (
              <span className="ml-2">{sortorder === "asc" ? "↑" : "↓"}</span>
            )}
          </p>
          <p
            className="w-1/6 text-center cursor-pointer"
            onClick={() => handleSort("firstname")}
          >
            First Name
            {sortby === "firstname" && (
              <span className="ml-2">{sortorder === "asc" ? "↑" : "↓"}</span>
            )}
          </p>
          <p
            className="w-1/6 text-center cursor-pointer"
            onClick={() => handleSort("lastname")}
          >
            Last Name
            {sortby === "lastname" && (
              <span className="ml-2">{sortorder === "asc" ? "↑" : "↓"}</span>
            )}
          </p>
          <p
            className="w-1/6 text-center cursor-pointer"
            onClick={() => handleSort("address")}
          >
            Address
            {sortby === "address" && (
              <span className="ml-2">{sortorder === "asc" ? "↑" : "↓"}</span>
            )}
          </p>
          <p
            className="w-1/6 text-center cursor-pointer"
            onClick={() => handleSort("phonenumber")}
          >
            Phone Number
            {sortby === "phonenumber" && (
              <span className="ml-2">{sortorder === "asc" ? "↑" : "↓"}</span>
            )}
          </p>
          <p
            className="w-1/6 text-center cursor-pointer"
            onClick={() => handleSort("emailaddress")}
          >
            Email Address
            {sortby === "emailaddress" && (
              <span className="ml-2">{sortorder === "asc" ? "↑" : "↓"}</span>
            )}
          </p>
          <p
            className="w-1/6 text-center cursor-pointer"
            onClick={() => handleSort("clientname")}
          >
            Client Name
            {sortby === "clientname" && (
              <span className="ml-2">{sortorder === "asc" ? "↑" : "↓"}</span>
            )}
          </p>
        </div>
      )}

      {tableTitle.toLowerCase() === "report" && (
        <div className="tableHeader w-full mx-auto flex  justify-between  items-center border-2 p-2 bg-tablehead  text-black rounded-xl text-sm">
          <p
            className="w-1/7  flex-1 text-center cursor-pointer "
            onClick={() => handleSort("salestocustomer")}
          >
            Customer Name
            {sortby === "salestocustomer" && (
              <span className="ml-2">{sortorder === "asc" ? "↑" : "↓"}</span>
            )}
          </p>

          <p
            className="w-1/7 flex-1 text-center cursor-pointer pr-6 "
            onClick={() => handleSort("shortname")}
          >
            Product
            {sortby === "shortname" && (
              <span className="ml-2">{sortorder === "asc" ? "↑" : "↓"}</span>
            )}
          </p>

          <p
            className="w-1/7  flex-1 text-center cursor-pointer pr-8 "
            onClick={() => handleSort("expirationdate")}
          >
            Expiry Date
            {sortby === "expirationdate" && (
              <span className="ml-2">{sortorder === "asc" ? "↑" : "↓"}</span>
            )}
          </p>

          <p
            className="w-1/7 flex-1 text-center cursor-pointer "
            onClick={() => handleSort("total_quantity")}
          >
            Qty
            {sortby === "total_quantity" && (
              <span className="ml-2">{sortorder === "asc" ? "↑" : "↓"}</span>
            )}
          </p>

          <p
            className="w-1/7 flex-1 text-center cursor-pointer  "
            onClick={() => handleSort("created")}
          >
            Dispatched Date
            {sortby === "created" && (
              <span className="ml-2">{sortorder === "asc" ? "↑" : "↓"}</span>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default TableHeader;
