import Aos from "aos";
import { useEffect } from "react";
import SrollTop from "../components/common/ScrollTop";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/scrollbar";
import "swiper/css/effect-cards";
import "aos/dist/aos.css";
import "../styles/index.scss";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../app/store";
import ReactQueryProvider from "../providers/ReactQueryProvider";
import { appWithTranslation } from "next-i18next";

if (typeof window !== "undefined") {
  require("bootstrap/dist/js/bootstrap");
}

function App({ Component, pageProps }) {
  useEffect(() => {
    Aos.init({
      duration: 1200,
      once: true,
    });
  }, []);

  return (
    <main>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ReactQueryProvider>
            <Component {...pageProps} />
            <SrollTop />
          </ReactQueryProvider>
        </PersistGate>
      </Provider>
    </main>
  );
}

export default appWithTranslation(App);
