import ReactCarousel from 'react-multi-carousel';
import Image from 'next/image';

const images = ['/boostcamp.png'];
const responsive = {
    '2xl': {
        breakpoint: { max: Number.MAX_SAFE_INTEGER, min: 1280 },
        items: 1,
    },
    xl: {
        breakpoint: { max: 1535, min: 1280 },
        items: 1,
    },
    lg: {
        breakpoint: { max: 1279, min: 1024 },
        items: 1,
    },
    md: {
        breakpoint: { max: 1023, min: 768 },
        items: 1,
    },
    sm: {
        breakpoint: { max: 767, min: 640 },
        items: 1,
    },
};
export default function Carousel() {
    return (
        <ReactCarousel
            responsive={responsive}
            swipeable
            infinite
            autoPlay
            autoPlaySpeed={3000}
            removeArrowOnDeviceType={['sm', 'md', 'lg', 'xl', '2xl']}
            className="2xl:overflow-hidden 2xl:rounded-xl"
        >
            {images.map((image, index) => (
                <div className="relative h-96" key={index}>
                    <Image
                        src={image}
                        alt={`hero-${index}`}
                        className="object-cover object-center"
                        fill
                    />
                </div>
            ))}
        </ReactCarousel>
    );
}
