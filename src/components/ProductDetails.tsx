import React, { useState } from "react";
import PieChart from "./PieChart";
import { ProductDetailsInterface } from "@/types/DashboardInterface";

const ProductDetails = ({
  productDetailsData,
}: {
  productDetailsData: ProductDetailsInterface[];
}) => {
  const data = productDetailsData;
  return <PieChart data={data} />;
};

export default ProductDetails;
