// "use client";

// import { useEffect, useState } from "react";
// import { useSearchParams } from "next/navigation";
// import { NewCheckoutInterface } from "@/types/ComponentInterface";

// const AddToCheckout: React.FC = () => {
//   const searchParams = useSearchParams();
//   const [selectedItems, setSelectedItems] = useState<NewCheckoutInterface[]>(
//     []
//   );
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     const items = searchParams.get("items");
//     if (items) {
//       try {
//         const decodedItems: NewCheckoutInterface[] = JSON.parse(
//           decodeURIComponent(items)
//         );
//         setSelectedItems(decodedItems);
//       } catch (error) {
//         console.error("Error decoding items:", error);
//       }
//     }
//     setLoading(false);
//   }, [searchParams]);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Current Checkout List</h1>
//       {selectedItems.length === 0 ? (
//         <p>No items selected.</p>
//       ) : (
//         <table className="min-w-full border border-gray-300">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="border border-gray-300 p-2">Company Name</th>
//               <th className="border border-gray-300 p-2">Branch Name</th>
//               <th className="border border-gray-300 p-2">Short Name</th>
//               <th className="border border-gray-300 p-2">Description</th>
//               <th className="border border-gray-300 p-2">Stock</th>
//               <th className="border border-gray-300 p-2">Available Qty</th>
//               <th className="border border-gray-300 p-2">On Hold</th>
//             </tr>
//           </thead>
//           <tbody>
//             {selectedItems.map((item, index) => (
//               <tr key={index}>
//                 <td className="border border-gray-300 p-2">
//                   {item.CompanyName}
//                 </td>
//                 <td className="border border-gray-300 p-2">
//                   {item.BranchName}
//                 </td>
//                 <td className="border border-gray-300 p-2">{item.ShortName}</td>
//                 <td className="border border-gray-300 p-2">
//                   {item.Description}
//                 </td>
//                 <td className="border border-gray-300 p-2">{item.Stock}</td>
//                 <td className="border border-gray-300 p-2">
//                   {item.AvailableQty}
//                 </td>
//                 <td className="border border-gray-300 p-2">{item.OnHold}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//       <div className="mt-8 line">
//         <hr className="h-px bg-black border-black" />
//       </div>
//       <div className="flex flex-row items-center justify-center gap-2 px-4 py-2 rounded-xl">
//         <select className="px-4 py-2 mt-4 font-bold border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-black">
//           <option value="" disabled selected>
//             Select Customer
//           </option>
//           <option value="customer1">Customer 1</option>
//           <option value="customer2">Customer 2</option>
//           <option value="customer3">Customer 3</option>
//           <option value="customer4">Customer 4</option>
//           <option value="customer5">Customer 5</option>
//         </select>

//         <input
//           type="text"
//           placeholder="Enter PO"
//           className="px-4 py-2 mt-4 border-2 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-black"
//         />

//         <input
//           type="text"
//           placeholder="Remark"
//           className="w-full px-4 py-2 mt-4 border-2 font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
//         />
//         <button
//           type="button"
//           className="flex px-4 py-2 mt-4 font-bold border-2 cursor-pointer btn rounded-xl flex-end hover:bg-success focus:ring-2 focus:ring-black"
//         >
//           Generate Checkout List
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AddToCheckout;
