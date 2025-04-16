"use client";
import React from "react";
import Image from "next/image";
import { HomeRounded, KeyboardArrowLeftRounded } from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/navigation";

const NotFound: React.FC = () => {
  const router = useRouter();
  return (
    <>
      <div className="h-full flex flex-col">
        <div className="backBtn w-full flex px-4 mx-auto items-center text-error">
          <button type="button" onClick={() => router.back()}>
            <span>
              <KeyboardArrowLeftRounded />
            </span>
            Go Back
          </button>
        </div>
        <div className="flex-1 flex flex-col justify-center items-center">
          <Image
            src="/assets/images/lost.svg"
            width={250}
            height={250}
            alt="Error: 404 Not Found"
          />
          <h1 className="text-4xl font-bold text-error">Page Not Found</h1>
          <p className="mt-4 text-lg text-text">
            Oops! The page you are looking for does not exist.
          </p>
          <Link
            href="/"
            className="mt-6 px-6 py-2 bg-success hover:bg-successAccent text-black rounded-3xl shadow-md"
          >
            <HomeRounded className="mr-2" />
            Go to Home
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotFound;
