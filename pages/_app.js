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

import Head from "next/head";
import Script from "next/script";

function MyApp({ Component, pageProps }) {

    // Preloader useState + Function

    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 1000);

        // new WOW.WOW({
        //     live: false
        //   }).init()
    }, []);


    return (

        <>
            {!loading ? (
                <ReduxProvider store={store}>
                    <StorageWrapper>
                        <Provider>

                            <Head>
                                <meta name="viewport" content="width=device-width, initial-scale=1" />
                                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossOrigin="anonymous" />
                            </Head>
                            <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossOrigin="anonymous" />

                            <Component {...pageProps} />
                            <ToastContainer 
                        autoClose={1000}
                        />
                        </Provider>
                    </StorageWrapper>
                </ReduxProvider>
            ) : (
                <Preloader />
            )}
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