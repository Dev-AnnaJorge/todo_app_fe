import "@/styles/globals.css";
import { Toaster } from "react-hot-toast";
import type { AppProps } from "next/app";

 function App({ Component, pageProps }: AppProps) {
  return <>
  <Component {...pageProps} />;
  <Toaster position="top-center" reverseOrder={false} />
  </>
}
export default App;