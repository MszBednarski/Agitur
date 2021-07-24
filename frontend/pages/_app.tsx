import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Grommet } from "grommet";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Grommet full>
      <Component {...pageProps} />
    </Grommet>
  );
}
export default MyApp;
