import "@/styles/globals.css";
import { Toaster } from "react-hot-toast";
import type { AppProps } from "next/app";
import { Inter, Poppins } from "next/font/google";
import { observer } from "mobx-react-lite";
import fetchStore from "@/stores/fetchStore";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-poppins",
});

const App = observer(({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    fetchStore.loadUser();
  }, []);

  useEffect(() => {
    const innerWindowWidth = window.innerWidth;
    const outerWindowWidth = window.outerWidth;

    console.log({window});
    
  }, []);

  return (
    <div className={`${inter.variable} ${poppins.variable} font-poppins`}>
      <Component {...pageProps} store={fetchStore} />
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
});

export default App;
