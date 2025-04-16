// "use client";

// import AgentsMaintenanceContainer from "@/components/Maintenance/Agents/AgentsMaintenanceContainer";
// import BranchesMaintenanceContainer from "@/components/Maintenance/Branches/BranchesMaintenanceContainer";
// import CategoriesMaintenanceContainer from "@/components/Maintenance/Categories/CategoriesMaintenanceContainer";
// import CompaniesMaintenanceContainer from "@/components/Maintenance/Companies/CompaniesMaintenanceContainer";
// import ContainersMaintenanceContainer from "@/components/Maintenance/Containers/ContainersMaintenanceContainer";
// import InventoryDescriptionMaintenanceContainer from "@/components/Maintenance/InventoryDescriptions/InventoryDescriptionMaintenanceContainer";
// import MaintenanceNavigation from "@/components/Maintenance/MaintenanceNavigation";
// import UserMaintenanceContainer from "@/components/Maintenance/Users/UserMaintenanceContainer";

// import React, { useState } from "react";

// const MaintenancePage: React.FC = () => {
//   const [selectedId, setSelectedId] = useState<number | null>(null);

//   return (
//     <div className="w-full h-full pb-6 flex flex-col items-center gap-2">
//       <MaintenanceNavigation setSelectedId={setSelectedId} currentRoute={0} />

//       {selectedId === 0 && <InventoryDescriptionMaintenanceContainer />}

//       {selectedId === 1 && <CategoriesMaintenanceContainer />}

//       {selectedId === 2 && <BranchesMaintenanceContainer />}

//       {selectedId === 3 && <CompaniesMaintenanceContainer />}

//       {selectedId === 4 && <ContainersMaintenanceContainer />}

//       {selectedId === 5 && <AgentsMaintenanceContainer />}
//       {selectedId === 6 && <UserMaintenanceContainer />}

//       {/* {selectedId === null && (
//         <div className="w-full text-center font-bold">
//           <h1> Please select an element for maintenance </h1>
//         </div>
//       )} */}
//     </div>
//   );
// };

// export default MaintenancePage;
