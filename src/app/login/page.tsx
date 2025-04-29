"use client";
import Image from "next/image";
import type React from "react";

import { useRouter } from "next/navigation";
import {
  AdjustRounded,
  CloseRounded,
  LoginRounded,
  RefreshRounded,
  VisibilityOffRounded,
  VisibilityRounded,
} from "@mui/icons-material";
import Link from "next/link";
import logoImg from "../../../public/assets/images/Logo/fidoLogoNoBG.png";
import { useLogin } from "../hooks/auth/useLogin";
import { useEffect, useState } from "react";
import { setCookie } from "cookies-next";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const loginMutation = useLogin();

  useEffect(() => {
    const savedEmail = (document.getElementById("email") as HTMLInputElement)
      ?.value;
    const savedPassword = (
      document.getElementById("password") as HTMLInputElement
    )?.value;

    if (savedEmail) setEmail(savedEmail);
    if (savedPassword) setPassword(savedPassword);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setError(null);
      const response = await loginMutation.mutateAsync({
        EmailAddress: email,
        Password: password,
        Source: "web",
      });

      setCookie("authKey", response.AuthKey, { path: "/" });
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="min-h-screen bg-fido from-indigo-950 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="w-full md:w-1/2 bg-gradient-to-br from-cyan-600 to-cyan-800 p-8 py-12 flex flex-col items-center justify-center text-white relative min-h-[500px]">
          <div className="w-full max-w-md mx-auto mb-8">
            <svg
              viewBox="0 0 500 400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto drop-shadow-lg"
            >
              <circle cx="250" cy="200" r="150" fill="#1E40AF" />
              <circle cx="250" cy="200" r="120" fill="#2563EB" />

              <rect
                x="175"
                y="100"
                width="150"
                height="250"
                rx="20"
                fill="#F8FAFC"
              />
              <rect
                x="185"
                y="110"
                width="130"
                height="230"
                rx="15"
                fill="#E2E8F0"
              />

              <rect
                x="195"
                y="120"
                width="110"
                height="210"
                rx="8"
                fill="#F8FAFC"
              />

              <rect
                x="235"
                y="170"
                width="30"
                height="90"
                rx="4"
                fill="#3B82F6"
              />
              <rect
                x="205"
                y="200"
                width="90"
                height="30"
                rx="4"
                fill="#3B82F6"
              />

              <path
                d="M120 220C120 220 150 220 170 240C190 260 190 300 190 300"
                stroke="#93C5FD"
                strokeWidth="8"
                strokeLinecap="round"
              />
              <path
                d="M120 220C120 220 120 200 140 200C160 200 160 220 160 220"
                stroke="#93C5FD"
                strokeWidth="8"
                strokeLinecap="round"
              />
              <circle cx="120" cy="220" r="15" fill="#BFDBFE" />

              <ellipse cx="350" cy="150" rx="25" ry="15" fill="#EF4444" />
              <ellipse cx="350" cy="150" rx="15" ry="8" fill="#FCA5A5" />

              <ellipse
                cx="380"
                cy="200"
                rx="25"
                ry="15"
                transform="rotate(45 380 200)"
                fill="#FBBF24"
              />
              <ellipse
                cx="380"
                cy="200"
                rx="15"
                ry="8"
                transform="rotate(45 380 200)"
                fill="#FDE68A"
              />

              <ellipse
                cx="330"
                cy="250"
                rx="25"
                ry="15"
                transform="rotate(-30 330 250)"
                fill="#F9FAFB"
              />
              <ellipse
                cx="330"
                cy="250"
                rx="15"
                ry="8"
                transform="rotate(-30 330 250)"
                fill="#F3F4F6"
              />

              <circle cx="400" cy="280" r="20" fill="#FBBF24" />
              <circle cx="400" cy="280" r="15" fill="#F59E0B" />
              <circle cx="400" cy="280" r="10" fill="#FBBF24" />
              <path
                d="M395 280H405M400 275V285"
                stroke="#F59E0B"
                strokeWidth="2"
              />

              <circle cx="370" cy="320" r="15" fill="#FBBF24" />
              <circle cx="370" cy="320" r="10" fill="#F59E0B" />
              <path
                d="M367 320H373M370 317V323"
                stroke="#FBBF24"
                strokeWidth="2"
              />
            </svg>
          </div>

          <div className="text-center z-10">
            <div className="flex justify-center items-center">
              <AdjustRounded className="text-white text-4xl" />
              <h1 className="text-4xl font-bold text-white">FOCUS</h1>
            </div>
            <h2 className="text-blue-100 text-xs tracking-widest font-light uppercase mt-2">
              Fido Order & Chain Unified System
            </h2>
            <h1 className="text-xl text-white font-bold mt-6 uppercase">
              A Complete Supply Chain Management Solution
            </h1>
          </div>

          <div className="mt-8 flex items-center justify-center">
            <span className="text-blue-100 mr-2 text-xl">Developed By</span>
            <Link
              href="https://www.fidoitsol.com"
              className="bg-white rounded-full p-1 hover:opacity-40 transition-colors"
            >
              <Image
                src={logoImg || "/placeholder.svg"}
                alt="Fido IT Solutions Logo"
                width={60}
                height={60}
                className="h-auto w-auto"
                title="Fido IT Solution"
                priority
              />
            </Link>
          </div>

          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-10 w-20 h-20 rounded-full border-4 border-blue-400/30"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full border-4 border-blue-400/20"></div>
            <div className="absolute top-1/2 right-5 w-10 h-10 rounded-full bg-blue-300/20"></div>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-8 md:p-12">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
              <p className="text-gray-600 mt-2">Login to your Accord account</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={visible ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setVisible(!visible)}
                  >
                    {visible ? <VisibilityRounded /> : <VisibilityOffRounded />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-lg text-gray-700"
                  >
                    Remember me
                  </label>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-lg text-primary hover:opacity-40"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full bg-fido hover:opacity-45 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                disabled={loginMutation.isPending}
              >
                {!loginMutation.isPending ? (
                  <>
                    <LoginRounded fontSize="small" className="mr-2" />
                    Login
                  </>
                ) : (
                  <>
                    <RefreshRounded
                      fontSize="small"
                      className="mr-2 animate-spin"
                    />
                    Logging in...
                  </>
                )}
              </button>
            </form>

            <div className="mt-8"></div>

            <p className="mt-8 text-center text-lg text-black">
              Don&apos;t have an account?{" "}
              <a
                href="#"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
          <div className="bg-white border-l-4 border-error rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-4 bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800">Error</h2>
              <button
                onClick={() => setError(null)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <CloseRounded />
              </button>
            </div>
            <div className="p-6">
              <p className="text-error">{error}</p>
            </div>
            <div className="bg-gray-50 px-6 py-3">
              <button
                onClick={() => setError(null)}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
// "use client";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import {
//   AdjustRounded,
//   CloseRounded,
//   LoginRounded,
//   RefreshRounded,
//   VisibilityOffRounded,
//   VisibilityRounded,
// } from "@mui/icons-material";
// import Link from "next/link";
// import logoImg from "../../../public/assets/images/Logo/fidoLogoNoBG.png";
// import loginImg from "../../../public/assets/images/undraw_deliveries.svg";
// import { useLogin } from "../hooks/auth/useLogin";
// import { useEffect, useState } from "react";

// export default function Login() {
//   const router = useRouter();
//   const [email, setEmail] = useState<string>("");
//   const [password, setPassword] = useState<string>("");
//   const [error, setError] = useState<string | null>(null);
//   const [visible, setVisible] = useState<boolean>(false);
//   const loginMutation = useLogin();

//   useEffect(() => {
//     const savedEmail = (document.getElementById("email") as HTMLInputElement)
//       ?.value;
//     const savedPassword = (
//       document.getElementById("password") as HTMLInputElement
//     )?.value;

//     if (savedEmail) setEmail(savedEmail);
//     if (savedPassword) setPassword(savedPassword);
//   }, []);

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     try {
//       setError(null);
//       const response = await loginMutation.mutateAsync({
//         EmailAddress: email,
//         Password: password,
//         Source: "web",
//       });

//       localStorage.setItem("authKey", response.AuthKey);
//       localStorage.setItem("IsVerified", response.IsVerified.toString());

//       if (!response.IsVerified) {
//         router.push("/changepassword");
//       } else {
//         router.push("/dashboard");
//       }
//     } catch (err) {
//       if (err instanceof Error) {
//         setError(err.message);
//       } else {
//         setError("An unexpected error occurred");
//       }
//     }
//   };

//   return (
//     <div className="mainContainer min-h-screen max-h-screen flex flex-col md:flex-row gap-8 justify-center md:justify-between items-center px-4 md:px-16">
//       <div className="leftContent text-center md:w-1/2">
//         <div className="hero">
//           <div className="logo mb-5">
//             <div className="flex justify-center items-center">
//               <AdjustRounded className="text-primary text-7xl" />
//               <h1 className="text-7xl font-black text-primary">FOCUS</h1>
//             </div>
//             <h2 className="text-secondary text-xs tracking-widest font-light uppercase">
//               Fido Order & Chain Unified System
//             </h2>
//           </div>
//           <div className="inventoryGraphic max-w-96 h-auto w-2/3 md:w-11/12 mx-auto mb-5 md:mb-0">
//             <Image
//               src={loginImg}
//               alt="Inventory Management Software Graphic"
//               priority={true}
//               className="mx-auto h-auto"
//             />
//           </div>
//           <h1 className="md:text-2xl text-black dark:text-white font-black mt-5 uppercase">
//             A Complete Supply Chain Management Solution
//           </h1>

//           <h1 className="flex items-center justify-center">
//             <span>by </span>

//             <Link href="https://www.fidoitsol.com">
//               <Image
//                 src={logoImg}
//                 alt="Fido IT Solutions Logo"
//                 width={50}
//                 height={50}
//                 className="h-auto w-auto"
//                 title="Fido IT Solution"
//                 priority
//               />
//             </Link>
//           </h1>
//         </div>
//       </div>
//       <div className="rightContent md:w-1/2 w-full md:flex justify-evenly items-center">
//         <div className="divider h-0.5 w-[80vw] bg-primary md:hidden my-5 mx-auto"></div>
//         <div className="divider h-[60vh] w-0.5 bg-primary hidden md:block"></div>
//         <div className="login">
//           <div className="loginTitle text-center">
//             <h1 className="font-black text-text md:text-2xl">Login</h1>
//           </div>
//           <div className="loginForm mt-2 md:mt-5 px-2">
//             <form
//               className="w-fit mx-auto space-y-2 flex flex-col justify-around items-center"
//               onSubmit={handleSubmit}
//             >
//               <div>
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   autoComplete="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                   placeholder="Enter your email address"
//                   className="w-80 px-3 py-2 rounded-3xl shadow-xl text-sm"
//                 />
//               </div>
//               <div className="relative">
//                 <input
//                   id="password"
//                   name="password"
//                   type={visible ? "text" : "password"}
//                   autoComplete="current-password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                   placeholder="Enter your password"
//                   className="w-80 px-3 py-2 rounded-3xl shadow-xl text-sm"
//                 />
//                 <span
//                   className="absolute right-4 top-1.5 cursor-pointer"
//                   onClick={() => {
//                     setVisible(!visible);
//                   }}
//                 >
//                   {visible ? <VisibilityRounded /> : <VisibilityOffRounded />}
//                 </span>
//               </div>
//               <button
//                 type="submit"
//                 className="w-48 px-4 py-2 font-medium bg-success hover:opacity-90 text-white rounded-xl text-sm flex items-center justify-center"
//               >
//                 {!loginMutation.isPending && (
//                   <LoginRounded
//                     fontSize="small"
//                     className={`mr-2 ${
//                       loginMutation.isPending ? "hidden" : ""
//                     }`}
//                   />
//                 )}
//                 {loginMutation.isPending && (
//                   <RefreshRounded
//                     fontSize="small"
//                     className={`mr-2 animate-spin ${
//                       loginMutation.isPending ? "" : "hidden"
//                     }`}
//                   />
//                 )}
//                 {loginMutation.isPending ? "Logging in..." : "Login"}
//               </button>
//               <Link href="/forgot-password" className="text-error mt-2">
//                 Forgot Your Password?
//               </Link>
//             </form>
//             {error && (
//               <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md">
//                 <div className="w-96 bg-surface border border-primary text-error p-6 rounded-xl">
//                   <div className="flex justify-between items-center">
//                     <h2 className="text-2xl font-black">Error</h2>
//                     <button
//                       onClick={() => setError(null)}
//                       className=" px-3 py-2 rounded"
//                     >
//                       <CloseRounded />
//                     </button>
//                   </div>
//                   <hr className="my-4" />
//                   <p>{error}</p>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
