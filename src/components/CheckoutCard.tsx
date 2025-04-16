// // // "use client";

// // // import { CheckoutCardPropsInterface } from "@/types/ComponentInterface";

// // // import {
// // //   KeyboardArrowDownRounded,
// // //   KeyboardArrowUpRounded,
// // //   LaunchRounded,
// // // } from "@mui/icons-material";
// // // import Link from "next/link";
// // // import { useState } from "react";

// // // const CheckoutCard: React.FC<CheckoutCardPropsInterface> = ({
// // //   description,
// // //   onAddToCheckout,
// // // }) => {
// // //   const [isAccordionOpen, setIsAccordionOpen] = useState(false);

// // //   const handleAccordionToggle = () => {
// // //     setIsAccordionOpen(!isAccordionOpen);
// // //   };

// // //   return (
// // //     <>
// // //       <div
// // //         className={`rounded-xl ${
// // //           isAccordionOpen ? " border-2 border-primary" : ""
// // //         }`}
// // //       >
// // //         <div
// // //           className={`checkoutCard text-sm bg-background text-text ${
// // //             isAccordionOpen ? "rounded-t-xl" : "rounded-xl"
// // //           } ${description.Stock ? "hover:bg-secondary hover:text-white" : ""}`}
// // //         >
// // //           <div className="cardText flex justify-between items-center gap-2 group p-2">
// // //             <p className="w-full text-center">{description.ManufacturerName}</p>
// // //             <p className="description font-bold truncate w-full">
// // //               {description.Description}
// // //             </p>
// // //             <p className="w-full text-center">{description.ShortName}</p>
// // //             <p className="w-full text-center">{description.Stock}</p>
// // //             <p className="w-full text-center">{description.OnHold}</p>
// // //             <p className="w-full text-center">
// // //               {description.AvailableQty}
// // //             </p>
// // //             <div className="flex w-full gap-1 items-center">
// // //               {description.AvailableQty ? (
// // //                 <div className="checkoutBtn w-full z-10 flex justify-center">
// // //                   <button
// // //                     className="w-full rounded-xl bg-success hover:bg-successAccent text-white px-2 py-1"
// // //                     onClick={() => onAddToCheckout?.(description)}
// // //                     title="Add item to checkout"
// // //                   >
// // //                     Add to checkout
// // //                   </button>
// // //                 </div>
// // //               ) : (
// // //                 <div className="checkoutBtn w-full z-10 flex justify-center">
// // //                   <div
// // //                     className="w-full rounded-xl bg-error text-white text-center px-2 py-1"
// // //                     title="Item Out of Stock"
// // //                   >
// // //                     Out of Stock
// // //                   </div>
// // //                 </div>
// // //               )}
// // //             </div>
// // //           </div>
// // //         </div>
// // //         {/* {isAccordionOpen && (
// // //           <div className="additionalDetails p-2 bg-background rounded-b-xl flex flex-col gap-2 justify-center items-center">
// // //             <hr className="border-primary border-2 w-5/6 mx-auto" />
// // //             <div className="title">
// // //               <p className="text-center text-primary font-bold">
// // //                 {description.ManufacturerName}
// // //               </p>
// // //               <p className="text-center text-text font-bold text-xl">
// // //                 {description.Description} (<span>{description.ShortName}</span>)
// // //               </p>
// // //             </div>

// // //             <h1 className="text-text">Inventory Status:</h1>
// // //             <div className="flex justify-center gap-4">
// // //               <p className="text-center text-primary font-semibold">
// // //                 Total Stock:{" "}
// // //                 <span className="text-text">{description.Stock}</span>
// // //               </p>
// // //               <p className="text-center text-primary font-semibold">
// // //                 Inventory On Hold:{" "}
// // //                 <span className="text-highlight">{description.OnHold}</span>
// // //               </p>
// // //               <p className="text-center text-primary font-semibold">
// // //                 Available for Checkout:{" "}
// // //                 <span className="text-success">
// // //                   {description.AvailableQuantity}
// // //                 </span>
// // //               </p>
// // //             </div>

// // //             <Link
// // //               href={`/inventory/details/${description.Id}`}
// // //               className="bg-primary hover:opacity-80 text-white rounded-xl px-2 py-1 w-48 text-center"
// // //             >
// // //               More Details{" "}
// // //               <span>
// // //                 <LaunchRounded />
// // //               </span>
// // //             </Link>
// // //           </div>
// // //         )} */}
// // //       </div>
// // //     </>
// // //   );
// // // };

// // // export default CheckoutCard;
// // "use client";

// // import { CheckoutCardPropsInterface } from "@/types/ComponentInterface";
// // import {
// //   KeyboardArrowDownRounded,
// //   KeyboardArrowUpRounded,
// //   LaunchRounded,
// // } from "@mui/icons-material";
// // import Link from "next/link";
// // import { useState } from "react";

// // const CheckoutCard: React.FC<CheckoutCardPropsInterface> = ({
// //   description,
// //   onAddToCheckout,
// // }) => {

// //   const [isChecked, setIsChecked] = useState(false); // State for checkbox

// //   const handleCheckboxChange = () => {
// //     const newCheckedState = !isChecked;
// //     setIsChecked(newCheckedState);

// //     // Call the onAddToCheckout function if checked
// //     if (newCheckedState) {
// //       onAddToCheckout?.(description);
// //     }
// //   };

// //   return (
// //     <>

// //           <div className="cardText flex justify-between items-center gap-2 group p-2">
// //             <p className="w-full text-center">{description.ManufacturerName}</p>
// //             <p className="description font-bold truncate w-full">
// //               {description.Description}
// //             </p>
// //             <p className="w-full text-center">{description.ShortName}</p>
// //             <p className="w-full text-center">{description.Stock}</p>
// //             <p className="w-full text-center">{description.OnHold}</p>
// //             <p className="w-full text-center">{description.AvailableQty}</p>
// //             <div className="flex w-full gap-1 items-center">

// //               <input
// //                 type="checkbox"
// //                 checked={isChecked}
// //                 onChange={handleCheckboxChange}
// //                 disabled={!description.AvailableQty} // Disable if out of stock
// //                 title="Add item to checkout"
// //               />
// //               {description.AvailableQty ? (
// //                 <div className="checkoutBtn w-full z-10 flex justify-center">
// //                   <button
// //                     className="w-full rounded-xl bg-success hover:bg-successAccent text-white px-2 py-1"
// //                     onClick={() => onAddToCheckout?.(description)}
// //                     title="Add item to checkout"
// //                   >
// //                     Add to checkout
// //                   </button>
// //                 </div>
// //               ) : (
// //                 <div className="checkoutBtn w-full z-10 flex justify-center">
// //                   <div
// //                     className="w-full rounded-xl bg-error text-white text-center px-2 py-1"
// //                     title="Item Out of Stock"
// //                   >
// //                     Out of Stock
// //                   </div>
// //                 </div>
// //               )}
// //             </div>
// //           </div>

// //     </>
// //   );
// // };

// // export default CheckoutCard;
"use client";

import { CheckoutCardPropsInterface } from "@/types/ComponentInterface";

const CheckoutCard: React.FC<CheckoutCardPropsInterface> = ({
  description,
  onAddToCheckout,
}) => {
  return (
    <div className="rounded-xl">
      {/* <div
        className={checkoutCard text-sm bg-background text-text rounded-xl ${
          description.Stock ? "hover:bg-secondary hover:text-white" : ""
        }}
      > */}
      <div className="cardText flex justify-between items-center gap-2 group p-2 hover:bg-primary">
        <p className="p-2 text-center">
          <input
            type="checkbox"
            onClick={() => onAddToCheckout?.(description)}
          />
        </p>

        <p className="w-full text-center">{description.ShortName}</p>
        <p className="description font-bold truncate w-full">
          {description.CompanyName}
        </p>
        <p className="w-full text-center">{description.BranchName}</p>
        <p className="w-full text-center">{description.Stock}</p>
        <p className="w-full text-center">{description.AvailableQty}</p>
      </div>
    </div>
  );
};

export default CheckoutCard;
