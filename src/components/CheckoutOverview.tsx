import React from "react";
import {
  BackHandRounded,
  CancelRounded,
  MoveUpRounded,
  OpenInNewRounded,
  SendRounded,
} from "@mui/icons-material/";
import { CheckoutOverviewInterface } from "@/types/DashboardInterface";

// Main component
const CheckoutOverview = ({
  checkoutOverviewData,
}: {
  checkoutOverviewData: CheckoutOverviewInterface;
}) => {
  // Array of icons for Checkout Types
  const CheckoutTypesIcons: { icon: React.ElementType; color: string }[] = [
    { icon: OpenInNewRounded, color: "primary" },
    { icon: SendRounded, color: "accent" },
  ];
  const CheckoutStatusIcons: { icon: React.ElementType; color: string }[] = [
    { icon: CancelRounded, color: "error" },
    { icon: BackHandRounded, color: "highlight" },
    { icon: MoveUpRounded, color: "success" },
  ];

  return (
    <div className="checkout-overview bg-surface rounded-xl p-4 flex flex-col text-center w-full drop-shadow-md text-sm h-full">
      <div className="title mb-2">
        <h1 className="font-bold text-lg">Today Checkout Overview</h1>
      </div>

      {/* Grid layout for the categories */}
      <div className="flex flex-col gap-4">
        {/* Category 1: Checkout Types */}
        <div className="flex flex-col md:flex-row justify-around gap-2">
          {checkoutOverviewData?.CheckoutTypes.map((type, idx) => {
            const IconComponent = {
              icon: CheckoutTypesIcons[idx]?.icon,
              color: CheckoutTypesIcons[idx]?.color,
            }; // Access the component

            return (
              <div
                key={type.CheckoutType}
                className="flex flex-col items-center bg-background rounded-xl w-full gap-2 p-2.5"
              >
                <span className="icon-container flex justify-center items-center">
                  {/* Dynamically render the icon component */}
                  {IconComponent && (
                    <IconComponent.icon
                      className={`text-${IconComponent.color}`}
                    />
                  )}
                </span>
                <div className="flex-1 txt">
                  <h3 className="title font-bold">{type.CheckoutType}</h3>
                  <p className="qty text-sm">Quantity: {type.CheckoutCount}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Category 2: Checkout Status */}
        <div className="flex flex-col md:flex-row justify-around gap-2">
          {checkoutOverviewData?.CheckoutStatus.map((status, idx) => {
            const IconComponent = {
              icon: CheckoutStatusIcons[idx]?.icon,
              color: CheckoutStatusIcons[idx]?.color,
            }; // Access the component

            return (
              <div
                key={status.CheckoutStatus}
                className="flex flex-col items-center bg-background rounded-xl w-full gap-2 p-2.5"
              >
                <span className="icon-container flex justify-center items-center">
                  {/* Dynamically render the icon component */}
                  {IconComponent && (
                    <IconComponent.icon
                      className={`text-${IconComponent.color}`}
                    />
                  )}
                </span>
                <div className="flex-1 txt">
                  <h3 className="title font-bold">{status.CheckoutStatus}</h3>
                  <p className="qty text-sm">
                    Quantity: {status.CheckoutCount}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CheckoutOverview;
