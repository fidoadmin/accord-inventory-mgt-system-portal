// "use client";
// import { useEffect, useState } from "react";
// import { CloseRounded, DeleteRounded, MenuRounded } from "@mui/icons-material";
// import DashboardCalendar from "@/components/DashboardCalendar";
// import DashboardTaskList from "@/components/DashboardTaskList";
// import { getCookie } from "cookies-next";
// import { useDashboardStock } from "../hooks/dashboard/useDashboardStock";

// export default function Dashboard() {
//   const [isDrawerOpen, setDrawerOpen] = useState(false);
//   const [authKey, setAuthKey] = useState<string | null>(null);

//   useEffect(() => {
//     const key = getCookie("authKey") as string;
//     if (key) setAuthKey(key);
//   }, []);

//   const { data, isLoading, isError } = useDashboardStock(authKey ?? "");
//   const stockData = Array.isArray(data?.data)
//     ? undefined
//     : typeof data?.data === "object" &&
//       "TotalStock" in data?.data &&
//       "Expriedstock" in data?.data &&
//       "OutOfStock" in data?.data &&
//       "InvoiceNuLL" in data?.data
//     ? (data?.data as {
//         TotalStock: number;
//         Expriedstock: number;
//         OutOfStock: number;
//         InvoiceNuLL: number;
//       })
//     : undefined;

//   const toggleDrawer = () => {
//     setDrawerOpen(!isDrawerOpen);
//   };
//   const dashboardCards = stockData
//     ? [
//         {
//           title: "Total Stock",
//           value: stockData.TotalStock,
//           color: "bg-success",
//           emoji: "📦",
//         },
//         {
//           title: "Expried Stock",
//           value: stockData.Expriedstock,
//           color: "bg-error",
//           emoji: "⏰",
//         },
//         {
//           title: "Out Of Stock",
//           value: stockData.OutOfStock,
//           color: "bg-amber-900",
//           emoji: <DeleteRounded />,
//         },
//         {
//           title: "Invoice NuLL",
//           value: stockData.InvoiceNuLL,
//           color: "bg-secondary",
//           emoji: "🧾",
//         },
//       ]
//     : [];

//   return (
//     <>
//       <h1 className="text-4xl font-bold text-amber-900 underline text-left mb-10">
//         DASHBOARD
//       </h1>
//       <div className="flex flex-col items-center p-1">
//         <div className="w-full flex flex-col xl:flex-row gap-6 items-center xl:items-start">
//           <div className="flex flex-wrap justify-left gap-6 xl:flex-1">
//             {isLoading && <p>Loading...</p>}
//             {isError && <p>Error fetching data.</p>}
//             {!isLoading &&
//               !isError &&
//               dashboardCards.map((item, index) => (
//                 <div
//                   key={index}
//                   className={`${item.color} text-white p-3 sm:p-4 rounded-xl shadow-lg w-full sm:w-60 md:w-48 text-center hover:opacity-90 transition-opacity duration-300`}
//                 >
//                   <div className="text-2xl sm:text-3xl">{item.emoji}</div>
//                   <h2 className="text-base sm:text-lg font-semibold mt-2">
//                     {item.title}
//                   </h2>
//                   <p className="text-2xl sm:text-3xl font-bold">{item.value}</p>
//                 </div>
//               ))}
//           </div>

//           <div
//             className={`fixed top-0 right-0 h-full z-40 p-4 transition-transform transform duration-300 overflow-y-auto scrollbar-thin bg-surface w-72 ${
//               isDrawerOpen ? "translate-x-0" : "translate-x-full"
//             } xl:hidden`}
//           >
//             <button className="text-error" onClick={toggleDrawer}>
//               <CloseRounded />
//             </button>
//             <DashboardCalendar />
//             <DashboardTaskList />
//           </div>

//           <div className="hidden xl:flex flex-col p-2 h-full overflow-y-auto scrollbar-thin w-full max-w-72 rounded-xl bg-white shadow-md">
//             <DashboardCalendar />
//             <DashboardTaskList />
//           </div>

//           <div
//             className={`fixed top-1/2 transform -translate-y-1/2 p-4 rounded-l-full shadow-lg text-white cursor-pointer z-50 transition-all duration-300 xl:hidden ${
//               isDrawerOpen ? "bg-error right-72" : "bg-success right-0"
//             }`}
//             onClick={toggleDrawer}
//           >
//             {!isDrawerOpen ? <MenuRounded /> : <CloseRounded />}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
"use client";
export default function Dashboard() {
  return (
    <>
      <div className="flex flex-col lg:flex-row w-full justify-between gap-4 text-center mt-60 pl-48">
        <h1 className="text-5xl font-bold text-amber-900">
          DASHBOARD UNDER CONSTRUCTION !
          <p className="text-4xl mt-6">Coming Soon .......</p>
        </h1>
      </div>
    </>
  );
}
[];
