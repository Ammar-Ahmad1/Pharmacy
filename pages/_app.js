import { useEffect, useState } from "react";
// import "react-input-range/lib/css/index.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import { Provider as ReduxProvider } from "react-redux";
import { ToastContainer } from 'react-toastify';
import { SessionProvider } from "next-auth/react";
import Provider from '../components/Provider'
import 'react-toastify/dist/ReactToastify.css';
// import "slick-carousel/slick/slick-theme.css";
// import "slick-carousel/slick/slick.css";
import "react-responsive-modal/styles.css";
// import WOW from 'wowjs';
// Swiper Slider
import "swiper/css";
import "swiper/css/navigation";
import StorageWrapper from "../components/ecommerce/storage-wrapper";
import "../public/assets/css/main.css";
import store from "../redux/store";
import Preloader from "./../components/elements/Preloader";
import { ClerkProvider } from "@clerk/nextjs";

function MyApp({ Component, pageProps }) {

    // Preloader useState + Function

    // const [loading, setLoading] = useState(false);
    // useEffect(() => {
    //     setLoading(true);
    //     setTimeout(() => {
    //         setLoading(false);
    //     }, 2000);

    //     // new WOW.WOW({
    //     //     live: false
    //     //   }).init()
    // }, []);

    
    return (
        <>
            <ReduxProvider store={store}>
                <StorageWrapper>
                    <Provider>
                        <ClerkProvider {...pageProps}>
                        <Component {...pageProps} />
                        <ToastContainer />
                        </ClerkProvider>
                    </Provider>
                </StorageWrapper>
            </ReduxProvider>
        </>
    );
}

export default MyApp;


// Page with image preloader

// {!loading ? (
//     <ReduxProvider store={store}>
//         <StorageWrapper>
//                 <Provider>
//                 <Component {...pageProps} />
//                 <ToastContainer />
//                 </Provider>
//         </StorageWrapper>
//     </ReduxProvider>
// ) : (
//     <Preloader />
// )}