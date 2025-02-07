import "@/styles/globals.css";
import { Toaster } from "react-hot-toast";
import type { AppProps } from "next/app";
import { Inter, Poppins } from "next/font/google"; 

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-poppins" });

function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${inter.variable} ${poppins.variable} font-poppins`}>
      <Component {...pageProps} />
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}

export default App;
