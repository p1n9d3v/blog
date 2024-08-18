'use client';

import Carousel from '@/components/Carousel';
import Image from 'next/image';

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
export default function HeroCarousel({ images }) {
    return (
        <Carousel
            responsive={responsive}
            infinite
            autoPlay
            ssr
            autoPlaySpeed={3000}
            removeArrowOnDeviceType={['sm', 'md', 'lg', 'xl', '2xl']}
            className="h-96 2xl:overflow-hidden 2xl:rounded-xl"
        >
            {images.map((image, index) => (
                <div className="relative h-96" key={index}>
                    <Image
                        src={image}
                        alt={`hero-${index}`}
                        className="object-cover object-center"
                        priority
                        fill
                    />
                </div>
            ))}
        </Carousel>
    );
}
