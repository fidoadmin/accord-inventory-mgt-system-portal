import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "../../styles/globals.css";
import type { Viewport } from "next";
import ReactQueryProvider from "@/utils/providers/ReactQueryProvider";
import Layout from "@/components/Layout";
import { Flip, ToastContainer } from "react-toastify";
import { Providers } from "./providers";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const open_sans = Open_Sans({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FOCUS - Your Supply Chain Partner",
  description: "Seamlessly manage your organizational inventory with FLOW",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${open_sans.className} bg-background min-h-screen text-text`}
      >
        <Providers>
          <ReactQueryProvider>
            <Layout>
              <ToastContainer
                stacked
                position="top-right"
                autoClose={5000}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick
                pauseOnHover={false}
                pauseOnFocusLoss={false}
                toastClassName={`bg-black text-white border border-primary`}
                transition={Flip}
              />
              {children}
            </Layout>
          </ReactQueryProvider>
        </Providers>
      </body>
    </html>
  );
}
