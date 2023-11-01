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
       
        {product.image.map((image, index) => (
          <SwiperSlide key={index}>
            <img src={image} alt={product.alt} />
          </SwiperSlide>
        )
        )}
      </Swiper>

      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={6}
        freeMode={true}
        watchSlidesProgress={true}
        className="mySwiper"
      >
       
        {product.gallery ? (
          product.gallery.map((item, index) => (
            <SwiperSlide key={index} className="border border-5 border-black">
              <img src={item.thumb} alt={item.alt} />
            </SwiperSlide>
          ))
        ) : (
          product.image.map((image, index) => (
            <SwiperSlide key={index} className="border border-5 border-black">
              <img src={image} alt={product.alt} />
            </SwiperSlide>
          )))}
      </Swiper>
    </div>
  );
};

export default ThumbSlider;
