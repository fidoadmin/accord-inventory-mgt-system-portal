// "use client";
// import {
//   AddCircleOutlineRounded,
//   CloseRounded,
//   DeleteForeverRounded,
//   DeleteRounded,
//   RemoveCircleOutlineRounded,
// } from "@mui/icons-material";
// import Dropdown from "./Dropdown";

// import { useEffect, useState } from "react";
// import { useGenerateCheckoutList } from "@/app/hooks/checkouts/useGenerateCheckoutList";
// import emptyImg from "../../public/assets/images/empty.svg";
// import Image from "next/image";
// import {
//   CheckoutOverlayProps,
//   GenerateCheckoutListRequestInterface,
// } from "@/types/CheckoutInterface";
// import { useRouter } from "next/navigation";

// const InternalCheckoutListOverlay: React.FC<CheckoutOverlayProps> = ({
//   onOverlayClose,
//   checkoutList,
//   transfereeList,
//   onUpdateCheckoutList,
// }) => {
//   const [checkoutError, setCheckoutError] = useState<string[] | null>(null);
//   const [relays, setRelays] = useState<{ id: string; name: string }[]>(
//     JSON.parse(localStorage.getItem("internalRelays") as string) || []
//   );
//   const generateCheckoutListMutation = useGenerateCheckoutList();
//   const router = useRouter();
//   const [openDropdown, setOpenDropdown] = useState<string | null>(null);

//   const handleSetOpenDropdown = (dropdownId: string) => {
//     setOpenDropdown((prev) => (prev === dropdownId ? null : dropdownId));
//   };

//   useEffect(() => {
//     const savedRelays = localStorage.getItem("relays");
//     if (savedRelays) {
//       setRelays(JSON.parse(savedRelays));
//     }
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("internalRelays", JSON.stringify(relays));
//     if (!JSON.parse(localStorage.getItem("internalRelays") as string)?.length) {
//       localStorage.removeItem("internalRelays");
//     }
//   }, [relays]);

//   const handleRemoveFromCheckout = (id: string) => {
//     const updatedCheckoutList = checkoutList.filter((item) => item.Id !== id);
//     onUpdateCheckoutList(updatedCheckoutList);
//     localStorage.setItem(
//       "internalCheckoutList",
//       JSON.stringify(updatedCheckoutList)
//     );
//     if (
//       !JSON.parse(localStorage.getItem("internalCheckoutList") as string).length
//     ) {
//       localStorage.removeItem("internalCheckoutList");
//       localStorage.removeItem("internalRelays");
//     }
//   };

//   const handleGenerateCheckoutList = async () => {
//     const CheckoutRelay = relays?.map((relay) => {
//       return { CompanyId: relay.id };
//     });
//     const DescriptionDetails = checkoutList.map((item) => {
//       return {
//         DescriptionId: item.Id,
//         Quantity: item.Quantity,
//       };
//     });
//     const CheckoutPayload: GenerateCheckoutListRequestInterface = {
//       DescriptionDetails,
//       CheckoutRelay,
//     };
//     if (handleCheckoutError()?.length) return;
//     try {
//       const response = await generateCheckoutListMutation.mutateAsync(
//         CheckoutPayload
//       );
//       handleClearAll();
//       router.push(`/checkout/${response[0]?.CheckoutNumber}`);
//     } catch (error) {
//       console.error("Failed to generate checkout list", error);
//     }
//   };

//   const handleClearAll = () => {
//     onUpdateCheckoutList([]);
//     setRelays([]);
//     localStorage.removeItem("internalCheckoutList");
//     localStorage.removeItem("internalRelays");
//   };

//   const handleQtySelect = (
//     itemId: string,
//     option: { id: string; name: string }
//   ) => {
//     const newQty = Number(option.name);

//     const updatedList = checkoutList.map((item) =>
//       item.Id === itemId ? { ...item, Quantity: newQty } : item
//     );

//     onUpdateCheckoutList(updatedList);
//   };

//   const handleCheckoutError = () => {
//     let checkoutError: string[] = [];
//     if (!relays.at(-1)?.id) {
//       checkoutError.push("Relay");
//     }
//     setCheckoutError(checkoutError);

//     return checkoutError;
//   };

//   const handleAddRelay = () => {
//     setRelays((prevRelays) => [...prevRelays, { id: "", name: "" }]);
//   };

//   const handleRemoveRelay = (relayId: string) => {
//     setRelays((prevRelays) =>
//       prevRelays.filter((relay) => relay.id !== relayId)
//     );
//   };

//   const handleRelaySelect = (
//     index: number,
//     option: { id: string; name: string }
//   ) => {
//     setRelays((prevRelays) =>
//       prevRelays.map((relay, i) => (i === index ? option : relay))
//     );
//   };

//   const handleTransfereeSelect = (option: { id: string; name: string }) => {
//     setRelays([option]);
//   };

//   const getAvailableOptions = () => {
//     return (
//       transfereeList?.filter(
//         (transferee) => !relays?.some((relay) => relay.id === transferee.Id)
//       ) ?? []
//     );
//   };

//   return (
//     <>
//       <div
//         className="fixed inset-0 h-screen flex items-center justify-center bg-black bg-opacity-20 backdrop-blur-md z-20"
//         onClick={onOverlayClose}
//       />
//       <div className="fixed w-2/3 md:w-1/2 p-6 top-10 right-1/2 translate-x-2/3 text-xs md:text-sm bg-surface border border-primary text-text rounded-3xl z-40 space-y-2">
//         <div className="flex justify-between items-center">
//           <h3 className="font-bold text-lg mb-2 flex-1 text-center">
//             Checkout Items
//           </h3>
//           <button className="text-error" onClick={onOverlayClose}>
//             <CloseRounded />
//           </button>
//         </div>
//         {checkoutList.length ? (
//           <div className="mainContent space-y-4">
//             <div className="transfereeSelector space-y-4">
//               <div className="primaryTransferee flex items-center gap-2 mt-2">
//                 <Dropdown
//                   label="Company"
//                   showLabel={false}
//                   options={getAvailableOptions().map((transferee) => ({
//                     id: transferee.Id,
//                     name: transferee.Name,
//                     external: transferee.IsExternal,
//                   }))}
//                   isOpen={openDropdown === "transferee"}
//                   setIsOpen={() => handleSetOpenDropdown("transferee")}
//                   required
//                   value={
//                     relays?.length > 0
//                       ? relays[0].name
//                       : "Select a company to transfer to"
//                   }
//                   onSelect={handleTransfereeSelect}
//                   placeholder="Select a company to transfer to"
//                 />
//               </div>

//               <div className="relay">
//                 {relays?.length >= 0 && (
//                   <button
//                     className="flex gap-2 items-center text-success hover:text-successAccent disabled:text-text disabled:opacity-60"
//                     onClick={handleAddRelay}
//                     disabled={!relays?.at(-1)?.id}
//                   >
//                     <AddCircleOutlineRounded />
//                     <span>Add a relay</span>
//                   </button>
//                 )}

//                 {relays?.slice(1).map((relay, index) => (
//                   <div key={index} className="flex items-center gap-2 mt-2">
//                     <Dropdown
//                       label="Company"
//                       showLabel={false}
//                       options={getAvailableOptions().map((transferee) => ({
//                         id: transferee.Id,
//                         name: transferee.Name,
//                         external: transferee.IsExternal,
//                       }))}
//                       isOpen={openDropdown === `relay${index}`}
//                       setIsOpen={() => handleSetOpenDropdown(`relay${index}`)}
//                       onSelect={(option) =>
//                         handleRelaySelect(index + 1, option)
//                       }
//                       required
//                       value={relay.name}
//                       placeholder="Select a relay company"
//                     />

//                     <RemoveCircleOutlineRounded
//                       className="cursor-pointer text-error"
//                       onClick={() => handleRemoveRelay(relay.id)}
//                     />
//                   </div>
//                 ))}
//               </div>
//             </div>
//             <div className="tableDiv">
//               <table className="w-full outline outline-primary text-center rounded-lg">
//                 <thead className="bg-primary text-white">
//                   <tr className="">
//                     <th className=" lg:px-2">Description</th>
//                     <th className=" lg:px-2">Manufacture</th>
//                     <th className=" lg:px-2">Quantity</th>
//                     <th className=" lg:px-2">
//                       <button
//                         className="text-error"
//                         title="Remove all items from checkout"
//                         onClick={handleClearAll}
//                       >
//                         <DeleteForeverRounded className="hover:text-errorAccent" />
//                       </button>
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {checkoutList.map((item, index) => (
//                     <tr key={item.Id} className="my-2">
//                       <td className=" lg:px-2 text-center">
//                         {item.Description}
//                       </td>
//                       <td className=" lg:px-2 text-center">
//                         {item.ManufacturerName}
//                       </td>
//                       <td className=" lg:px-2 text-center">[Stock]</td>
//                       <td className="">
//                         <button
//                           className="flex w-full justify-center text-error"
//                           title="Remove item from checkout"
//                           onClick={() => handleRemoveFromCheckout(item.Id)}
//                         >
//                           <DeleteRounded className="hover:text-errorAccent" />
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//             <div className="flex justify-end">
//               <button
//                 className="bg-success hover:opacity-80 disabled:border disabled:bg-transparent disabled:border-primary disabled:opacity-40 disabled:text-primary text-white rounded-3xl px-4 py-2"
//                 disabled={!checkoutList.length || !relays?.at(-1)?.id}
//                 onClick={handleGenerateCheckoutList}
//               >
//                 Generate Checkout List
//               </button>
//             </div>
//           </div>
//         ) : (
//           <div className="text-center space-y-2">
//             <div className="h-32 w-32 mx-auto">
//               <Image
//                 src={emptyImg}
//                 alt="Fido IT Solutions Logo"
//                 priority={true}
//                 className="mx-auto h-auto"
//               />
//             </div>
//             <h1 className="font-bold text-error">Checkout list is empty</h1>
//             <h1 className="text-text">
//               Please add items to proceed with the checkout!
//             </h1>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default InternalCheckoutListOverlay;
