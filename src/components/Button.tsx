import React from "react";
import Link from "next/link";
import { ButtonPropsInterface } from "@/types/ComponentInterface";

const Button: React.FC<ButtonPropsInterface> = ({
  href,
  text,
  Icon,
  className,
}) => {
  return (
    <Link href={href} className={``}>
      <div
        className={`flex items-center py-1 px-4 md:py-2 text-xs md:text-sm text-black rounded-xl ${className}`}
      >
        <h3>{text}</h3>
        {Icon && (
          <span className="ml-2">
            {" "}
            <Icon />
          </span>
        )}
      </div>
    </Link>
  );
};

export default Button;
