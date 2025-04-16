
"use client";
import Checkout from "@/components/Checkout";

const CheckoutPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="py-4 rounded-bl-3xl rounded-tr-3xl">
        <Checkout />
      </div>
    </div>
  );
};

export default CheckoutPage;
