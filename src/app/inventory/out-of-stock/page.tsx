"use client";

import { useState, useEffect } from "react";
import TableHeader from "@/components/TableHeader";
import DescriptionCard from "@/components/DescriptionCard";
import { useInventoryDescriptionList } from "@/app/hooks/inventorydescriptions/useInventoryDescriptionList";
import { InventoryDescriptionInterface } from "@/types/InventoryInterface";
import SearchInput from "@/components/SearchBox";
import Loading from "@/app/loading";
import Pagination from "@/components/Pagination";

export default function Inventory() {
  const [authKey, setAuthKey] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [result, setResult] = useState<InventoryDescriptionInterface[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);

  const {
    data,
    error: inventoryError,
    isLoading: inventoryLoading,
  } = useInventoryDescriptionList(authKey || "", { isFromDispatch: true });

  const { data: inventoryList, totalCount } = data || {
    data: [],
    totalCount: 0,
  };

  useEffect(() => {
    const key = "authKey" as string;
    setAuthKey(key);
  }, []);

  useEffect(() => {
    if (totalCount) {
      setTotalPages(Math.ceil(totalCount / itemsPerPage));
    }
  }, [totalCount]);

  useEffect(() => {
    let filteredData = inventoryList?.filter((inventory) =>
      inventory.Description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData?.slice(
      startIndex,
      startIndex + itemsPerPage
    );

    setResult(paginatedData || []);
  }, [searchTerm, inventoryList, currentPage]);

  if (inventoryLoading || !inventoryList) {
    return <Loading />;
  }

  if (inventoryError) {
    return <div>Error Loading Data</div>;
  }

  return (
    <div className="inventory pb-6 px-4 md:px-6 flex flex-col gap-4">
      <div className="searchSort flex flex-col md:flex-row justify-between items-center md:items-end">
        <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>
      <div className="inventorySection">
        <>
          <ul className="flex flex-col gap-1">
            <h1 className="text-text font-bold text-xl">
              Out of Stock Inventory
            </h1>
            <TableHeader tableTitle="Description" />
            {result.map((inventory) => (
              <DescriptionCard key={inventory.Id} description={inventory} />
            ))}
          </ul>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </>
      </div>
    </div>
  );
}

// "use client";
//

// import { useState, useEffect } from "react";
// import { SearchRounded } from "@mui/icons-material";
// import TableHeader from "@/components/TableHeader";
// import DescriptionCard from "@/components/DescriptionCard";
// import { useInventoryDescriptionList } from "@/app/hooks/inventorydescriptions/useInventoryDescriptionList";
// import { InventoryDescriptionInterface } from "@/types/InventoryInterface";
// import SearchInput from "@/components/SearchBox";
// import Loading from "@/app/loading";
// import Pagination from "@/components/Pagination";

// export default function Inventory() {
//   const options = ["Option 1", "Option 2", "Option 3"];
//   const [authKey, setAuthKey] = useState<string | null>(null);
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const itemsPerPage = 10;
//   const [searchTerm, setSearchTerm] = useState<string>("");

//   const [result, setResult] = useState<InventoryDescriptionInterface[]>([]);

//   const {
//     data,
//     error: inventoryError,
//     isLoading: inventoryLoading,
//   } = useInventoryDescriptionList(authKey || "", { isFromDispatch: true });

//   const { data: inventoryList, totalCount } = data || {
//     data: [],
//     totalCount: 0,
//   };

//   const [totalPages, setTotalPages] = useState<number>(
//     Math.ceil(totalCount / itemsPerPage)
//   );

//   useEffect(() => {
//     const key = localStorage.getItem("authKey") as string;
//     setAuthKey(key);
//   }, []);

//   useEffect(() => {
//     if (inventoryList) {
//       setResult(inventoryList);
//     }
//   }, [inventoryList]);

//   useEffect(() => {
//     const filteredData = inventoryList?.filter((category) =>
//       category.Description.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     setResult(filteredData ? filteredData : []);
//   }, [searchTerm, inventoryList]);

//   if (inventoryLoading || !inventoryList) {
//     return <Loading />;
//   }

//   if (inventoryError) {
//     <div>Error Loading Data</div>;
//   }
//   return (
//     <div className="inventory pb-6 px-4 md:px-6 flex flex-col gap-4">
//       <div className="searchSort flex flex-col md:flex-row justify-between items-center md:items-end">
//         <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
//         {/* <div className="sortDropdown w-40">
//           <p className="sortText">Filter By:</p>
//           <div className="DropdownMenu">
//               <Dropdown
//                 options={options}
//                 onSelect={handleSelect}
//                 placeholder="Filter"
//               />
//             </div>
//         </div> */}
//       </div>
//       <div className="inventorySection">
//         <>
//           <ul className="flex flex-col gap-1">
//             <h1 className="text-text font-bold text-xl">
//               Out of Stock Inventory
//             </h1>
//             <TableHeader tableTitle="Description" />
//             {result.map((inventory) => (
//               <DescriptionCard key={inventory.Id} description={inventory} />
//             ))}
//           </ul>
//           <Pagination
//             currentPage={currentPage}
//             totalPages={totalPages}
//             onPageChange={(page) => setCurrentPage(page)}
//           />
//         </>
//       </div>
//     </div>
//   );
// }
