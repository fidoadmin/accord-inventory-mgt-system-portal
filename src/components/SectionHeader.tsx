import React from "react";
import Button from "./Button";
import { SectionHeaderPropsInterface } from "@/types/ComponentInterface";

const SectionHeader: React.FC<SectionHeaderPropsInterface> = ({
  title,
  button,
  buttonClass,
  buttonText,
  buttonIcon,
  buttonHref,
}) => {
  return (
    <div
      className={`topSection flex flex-col md:flex-row items-center justify-between`}
    >
      <div className="topText mb-2 md:m-0">
        <h1 className="text-lg font-black">{title}</h1>
      </div>
      {button ? (
        buttonIcon ? (
          <Button
            href={buttonHref!}
            text={buttonText!}
            Icon={buttonIcon!}
            className={`w-full ${buttonClass!}`}
          />
        ) : (
          <Button
            href={buttonHref!}
            text={buttonText!}
            className={`w-full ${buttonClass!}`}
          />
        )
      ) : (
        <></>
      )}
    </div>
  );
};

export default SectionHeader;
