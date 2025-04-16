"use client";
import ReturnOverlay from "@/components/Return";
import { useRouter } from "next/navigation";

interface ReturnCheckoutPageProps {
  params: {
    checkoutNumber: string;
  };
}

const ReturnCheckoutPage = ({ params }: ReturnCheckoutPageProps) => {
  const { checkoutNumber } = params;
  const router = useRouter();

  return (
    <div className="p-4">
      <ReturnOverlay
        checkoutNumber={checkoutNumber}
        closeOverlay={() => router.back()}
      />
    </div>
  );
};

export default ReturnCheckoutPage;
