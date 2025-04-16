"use client";
import Image from "next/image";
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
import loginImg from "../../../public/assets/images/undraw_deliveries.svg";
import { useLogin } from "../hooks/auth/useLogin";
import { useEffect, useState } from "react";

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

      localStorage.setItem("authKey", response.AuthKey);
      localStorage.setItem("IsVerified", response.IsVerified.toString());

      if (!response.IsVerified) {
        router.push("/changepassword");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="mainContainer min-h-screen max-h-screen flex flex-col md:flex-row gap-8 justify-center md:justify-between items-center px-4 md:px-16">
      <div className="leftContent text-center md:w-1/2">
        <div className="hero">
          <div className="logo mb-5">
            <div className="flex justify-center items-center">
              <AdjustRounded className="text-primary text-7xl" />
              <h1 className="text-7xl font-black text-primary">FOCUS</h1>
            </div>
            <h2 className="text-secondary text-xs tracking-widest font-light uppercase">
              Fido Order & Chain Unified System
            </h2>
          </div>
          <div className="inventoryGraphic max-w-96 h-auto w-2/3 md:w-11/12 mx-auto mb-5 md:mb-0">
            <Image
              src={loginImg}
              alt="Inventory Management Software Graphic"
              priority={true}
              className="mx-auto h-auto"
            />
          </div>
          <h1 className="md:text-2xl text-black dark:text-white font-black mt-5 uppercase">
            A Complete Supply Chain Management Solution
          </h1>

          <h1 className="flex items-center justify-center">
            <span>by </span>

            <Link href="https://www.fidoitsol.com">
              <Image
                src={logoImg}
                alt="Fido IT Solutions Logo"
                width={50}
                height={50}
                className="h-auto w-auto"
                title="Fido IT Solution"
                priority
              />
            </Link>
          </h1>
        </div>
      </div>
      <div className="rightContent md:w-1/2 w-full md:flex justify-evenly items-center">
        <div className="divider h-0.5 w-[80vw] bg-primary md:hidden my-5 mx-auto"></div>
        <div className="divider h-[60vh] w-0.5 bg-primary hidden md:block"></div>
        <div className="login">
          <div className="loginTitle text-center">
            <h1 className="font-black text-text md:text-2xl">Login</h1>
          </div>
          <div className="loginForm mt-2 md:mt-5 px-2">
            <form
              className="w-fit mx-auto space-y-2 flex flex-col justify-around items-center"
              onSubmit={handleSubmit}
            >
              <div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email address"
                  className="w-80 px-3 py-2 rounded-3xl shadow-xl text-sm"
                />
              </div>
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
                  className="w-80 px-3 py-2 rounded-3xl shadow-xl text-sm"
                />
                <span
                  className="absolute right-4 top-1.5 cursor-pointer"
                  onClick={() => {
                    setVisible(!visible);
                  }}
                >
                  {visible ? <VisibilityRounded /> : <VisibilityOffRounded />}
                </span>
              </div>
              <button
                type="submit"
                className="w-48 px-4 py-2 font-medium bg-success hover:opacity-90 text-white rounded-xl text-sm flex items-center justify-center"
              >
                {!loginMutation.isPending && (
                  <LoginRounded
                    fontSize="small"
                    className={`mr-2 ${
                      loginMutation.isPending ? "hidden" : ""
                    }`}
                  />
                )}
                {loginMutation.isPending && (
                  <RefreshRounded
                    fontSize="small"
                    className={`mr-2 animate-spin ${
                      loginMutation.isPending ? "" : "hidden"
                    }`}
                  />
                )}
                {loginMutation.isPending ? "Logging in..." : "Login"}
              </button>
              <Link href="/forgot-password" className="text-error mt-2">
                Forgot Your Password?
              </Link>
            </form>
            {error && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md">
                <div className="w-96 bg-surface border border-primary text-error p-6 rounded-xl">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-black">Error</h2>
                    <button
                      onClick={() => setError(null)}
                      className=" px-3 py-2 rounded"
                    >
                      <CloseRounded />
                    </button>
                  </div>
                  <hr className="my-4" />
                  <p>{error}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
