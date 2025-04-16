"use client";
import React from "react";

const Loading = () => {
  return (
    <>
      <div className="h-full flex justify-center items-center">
        <div className="relative w-16 h-16 rounded-full">
          {/* First rotating element */}
          <div
            className="absolute w-full h-full rounded-full border-b-[3px] border-primary"
            style={{
              animation: "rotate-one 1s linear infinite",
              transformOrigin: "center",
            }}
          ></div>

          {/* Second rotating element */}
          <div
            className="absolute w-full h-full rounded-full border-r-[3px] border-text"
            style={{
              animation: "rotate-two 1s linear infinite",
              transformOrigin: "center",
            }}
          ></div>

          {/* Third rotating element */}
          <div
            className="absolute w-full h-full rounded-full border-t-[3px] border-accent"
            style={{
              animation: "rotate-three 1s linear infinite",
              transformOrigin: "center",
            }}
          ></div>
        </div>

        {/* CSS animations */}
        <style jsx>{`
          @keyframes rotate-one {
            0% {
              transform: rotateX(35deg) rotateY(-45deg) rotateZ(0deg);
            }
            100% {
              transform: rotateX(35deg) rotateY(-45deg) rotateZ(360deg);
            }
          }
          @keyframes rotate-two {
            0% {
              transform: rotateX(50deg) rotateY(10deg) rotateZ(0deg);
            }
            100% {
              transform: rotateX(50deg) rotateY(10deg) rotateZ(360deg);
            }
          }
          @keyframes rotate-three {
            0% {
              transform: rotateX(35deg) rotateY(55deg) rotateZ(0deg);
            }
            100% {
              transform: rotateX(35deg) rotateY(55deg) rotateZ(360deg);
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default Loading;
