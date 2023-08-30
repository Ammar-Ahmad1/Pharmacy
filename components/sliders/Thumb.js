import { useState } from "react";
import SwiperCore, { Navigation, Thumbs } from "swiper";
import "swiper/css/thumbs";
import { Swiper, SwiperSlide } from "swiper/react";

SwiperCore.use([Navigation, Thumbs]);

const ThumbSlider = ({ product }) => {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    return (
        <div>
            <Swiper
                style={{
                    "--swiper-navigation-color": "#fff",
                    "--swiper-pagination-color": "#fff",
                }}
                
                spaceBetween={10}
                navigation={true}
                thumbs={{ swiper: thumbsSwiper }}
                className="mySwiper2"
            >
                {product.gallery?.map((item) => (
                    <SwiperSlide>
                        <img src={item.thumb } />
                        {/* <Zoom
                            img={item.thumb}
                            zoomScale={5}
                            width={500}
                            height={500}
                            ransitionTime={0.5}
                        /> */}
                    </SwiperSlide>
                ))}
            </Swiper>
            <Swiper
                onSwiper={setThumbsSwiper}
                
                spaceBetween={10}
                slidesPerView={4}
                freeMode={true}
                watchSlidesProgress={true}
                className="mySwiper"
            >
                {
                    product.gallery ? (product.gallery.map((item) => (
                        <SwiperSlide>
                            <img src={item.thumb} />
                        </SwiperSlide>
                    ))):(
                        <SwiperSlide>
                            <img src="https://lh3.googleusercontent.com/a/AAcHTtci6RJekFINCdibq0iNLKa9rfOSIFl04lh86s2ITxUu=s96-c" />
                        </SwiperSlide>
                    )


                }
                {/* {product.gallery?.map((item) => (
                    <SwiperSlide>
                        <img src={item.thumb} />
                    </SwiperSlide>
                ))} */}
            </Swiper>
        </div>
    );
};

export default ThumbSlider;
