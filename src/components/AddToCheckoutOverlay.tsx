// "use client";
// import { CalendarMonthRounded, CloseRounded } from "@mui/icons-material";
// import { useEffect, useState } from "react";
// import Dropdown from "./Dropdown";
// import { useContainers } from "@/app/hooks/containers/useContainerList";
//

// import DatePicker from "react-datepicker";
// import { AddToCheckoutOverlayProps } from "@/types/CheckoutInterface";
// import Loading from "@/app/loading";
// import BranchInventoryDescriptionInformation from "./DeficitQtyModal";

// const AddToCheckoutOverlay: React.FC<AddToCheckoutOverlayProps> = ({
//   onOverlayClose,
//   inventory,
//   handleAddToCheckout,
//   companyDetails,
//   branchDetails,
// }) => {
//   const [quantity, setQuantity] = useState<number>(0);
//   const [complementaryQuantity, setComplementaryQuantity] = useState<
//     number | null
//   >(null);
//   const [isOpenBox, setIsOpenBox] = useState<boolean>(true);
//   const [qtyWarning, setQtyWarning] = useState<string | null>(null);
//   const [hasFOC, setHasFOC] = useState<boolean>(false);
//   const [authKey, setAuthKey] = useState<string | null>(null);
//   const [specificDate, setSpecificDate] = useState<string | null>(null);
//   const [isPreCheckInRequest, setIsPreCheckInRequest] =
//     useState<boolean>(false);
//   const [showDeficitOptions, setShowDeficitOptions] = useState<boolean>(false);
//   const [showBranchTransfer, setShowBranchTransfer] = useState<boolean>(false);

//   useEffect(() => {
//     const key = localStorage.getItem("authKey") as "";
//     setAuthKey(key);
//   }, []);

//   const {
//     data: containerList,
//     error: containerError,
//     isLoading: containerLoading,
//   } = useContainers(authKey || "", { categoryId: inventory?.CategoryId });

//   if (containerLoading || !containerList) {
//     return <Loading />;
//   }

//   if (containerError)
//     return <div>Error loading check-in form: {containerError.message}</div>;

//   const handleAddClick = () => {
//     if (!(Number(quantity) + (Number(complementaryQuantity)! || 0))) {
//       setQtyWarning("Quantity + FOC Quantity cannot be 0!");
//       return;
//     }

//     if (
//       Number(quantity) + (Number(complementaryQuantity)! || 0) >
//       inventory?.Stock
//     ) {
//       setShowDeficitOptions(true);
//     } else {
//       handleAddToCheckout(
//         inventory?.Id,
//         quantity,
//         isOpenBox,
//         hasFOC,
//         complementaryQuantity,
//         specificDate!,
//         isPreCheckInRequest!
//       );
//     }
//   };

//   const handleOverlayClick = (e: React.MouseEvent) => {
//     e.stopPropagation();
//   };

//   const handleSpecificDateSelect = (date: Date | null) => {
//     const setDate =
//       date?.getFullYear() +
//       "-" +
//       ((date?.getMonth() as number) + 1).toString().padStart(2, "0") +
//       "-" +
//       date?.getDate().toString()?.padStart(2, "0");
//     setSpecificDate(setDate);
//   };

//   const handleBack = () => {
//     if (showBranchTransfer) {
//       setShowBranchTransfer(false);
//       setShowDeficitOptions(true);
//     } else {
//       setShowDeficitOptions(false);
//       setShowBranchTransfer(false);
//     }
//   };

//   const handleNotify = () => {
//     setIsPreCheckInRequest(true);
//     handleAddToCheckout(
//       inventory?.Id,
//       inventory?.Stock,
//       isOpenBox,
//       hasFOC,
//       complementaryQuantity,
//       specificDate!,
//       true
//     );
//     setShowDeficitOptions(false);
//   };

//   return (
//     <>
//       <div
//         className="fixed inset-0 h-screen flex items-center justify-center bg-black bg-opacity-20 backdrop-blur-md z-20"
//         onClick={onOverlayClose}
//       />
//       <div
//         className="fixed w-1/2 top-10 right-1/2 translate-x-2/3 text-sm bg-surface border border-primary text-text rounded-3xl z-40 max-h-screen scrollbar-thin overflow-y-auto"
//         onClick={handleOverlayClick}
//       >
//         {!showDeficitOptions && !showBranchTransfer ? (
//           <>
//             <div className="flex justify-between px-6 py-4">
//               <div className="flex-1">
//                 <h1 className="font-bold text-primary text-center">
//                   {inventory?.ManufacturerName}
//                 </h1>
//                 <p className="text-center font-semibold text-lg">
//                   {inventory?.Description} ({inventory?.ShortName})
//                 </p>
//               </div>

//               <button className="text-error" onClick={onOverlayClose}>
//                 <CloseRounded />
//               </button>
//             </div>
//             <div className="dateSelector w-fit relative mx-auto">
//               <DatePicker
//                 name="ExpirationDate"
//                 value={specificDate!}
//                 autoComplete="off"
//                 placeholderText="Need specific expiry date?"
//                 onChange={(date) => handleSpecificDateSelect(date)}
//                 minDate={new Date()}
//                 wrapperClassName="w-full"
//                 showYearDropdown
//                 className="input mb-2 w-80 rounded-xl px-4 py-2 bg-transparent text-sm text-text placeholder:text-text border border-primary  focus:outline-primary focus:ring-0 focus:outline-none"
//               />
//               <span>
//                 <CalendarMonthRounded className="absolute right-2 top-1.5" />
//               </span>
//             </div>
//             <div className="px-6 pb-6 rounded-b-3xl space-y-2">
//               <div className="additionalDetails text-text flex justify-between">
//                 <p>
//                   Stock: <span className="text-text">{inventory?.Stock}</span>
//                 </p>
//                 <p>
//                   On Hold:{" "}
//                   <span className="text-highlight">{inventory?.OnHold}</span>
//                 </p>
//                 <p>
//                   Available Quantity:{" "}
//                   <span className="text-success">
//                     {inventory?.AvailableQuantity}
//                   </span>
//                 </p>
//               </div>
//               <div className="actionDiv flex items-center justify-around gap-8">
//                 <div className="qtyInput w-full">
//                   <input
//                     type="number"
//                     placeholder="Enter Quantity"
//                     autoComplete="off"
//                     name="Quantity"
//                     onChange={(e: any) => {
//                       setQuantity(e.target.value);
//                     }}
//                     className={`input w-full rounded-xl px-4 py-2 bg-transparent text-sm border focus:ring-0 focus:outline-none ${
//                       qtyWarning
//                         ? "placeholder:text-error border-error text-error focus:outline-error"
//                         : "placeholder:text-text border-primary text-text focus:outline-primary"
//                     }`}
//                   />
//                 </div>
//               </div>

//               <div className="pt-2 w-full text-center">
//                 <button
//                   onClick={() => setHasFOC(!hasFOC)}
//                   className={`px-4 py-2 rounded-xl hover:opacity-80 ${
//                     hasFOC
//                       ? "bg-primary text-white"
//                       : "text-primary bg-transparent border-2 border-primary"
//                   }`}
//                 >
//                   Add Complementary Items? (FOC)
//                 </button>
//               </div>
//               {hasFOC && (
//                 <div className="qtyInput w-full">
//                   <input
//                     type="number"
//                     placeholder="Enter Complementary Quantity"
//                     autoComplete="off"
//                     name="Complementary Quantity"
//                     onChange={(e: any) => {
//                       setComplementaryQuantity(e.target.value);
//                     }}
//                     className={`input w-full rounded-xl px-4 py-2 bg-transparent text-sm border focus:ring-0 focus:outline-none ${
//                       qtyWarning
//                         ? "placeholder:text-error border-error text-error focus:outline-error"
//                         : "placeholder:text-text border-primary text-text focus:outline-primary"
//                     }`}
//                   />
//                 </div>
//               )}
//               {qtyWarning && (
//                 <p className="text-sm text-error text-center">{qtyWarning}</p>
//               )}
//               <div className="pt-2 w-full text-center">
//                 <button
//                   onClick={handleAddClick}
//                   className="bg-success text-white px-4 py-2 rounded-xl hover:opacity-80"
//                 >
//                   Add to Checkout
//                 </button>
//               </div>
//             </div>
//           </>
//         ) : (
//           <BranchInventoryDescriptionInformation
//             inventoryDescription={inventory}
//             currentCompany={companyDetails!}
//             currentBranch={branchDetails!}
//             onNotify={handleNotify}
//             onBack={handleBack}
//           />
//         )}
//       </div>
//     </>
//   );
// };

// export default AddToCheckoutOverlay;
