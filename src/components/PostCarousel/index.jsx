import ReactCarousel from 'react-multi-carousel';
import Image from 'next/image';
import PostCard from '@/components/PostCard';

const responsive = {
    '2xl': {
        breakpoint: { max: Number.MAX_SAFE_INTEGER, min: 1280 },
        items: 4,
    },
    xl: {
        breakpoint: { max: 1535, min: 1280 },
        items: 4,
    },
    lg: {
        breakpoint: { max: 1279, min: 1024 },
        items: 4,
    },
    md: {
        breakpoint: { max: 1023, min: 768 },
        items: 4,
    },
    sm: {
        breakpoint: { max: 767, min: 640 },
        items: 3,
    },
    xs: {
        breakpoint: { max: 639, min: 0 },
        items: 2,
    },
};
export default function PostCarousel({ posts }) {
    return (
        <ReactCarousel
            responsive={responsive}
            swipeable
            infinite
            autoPlay
            autoPlaySpeed={3000}
            removeArrowOnDeviceType={['xs', 'sm']}
            className="h-96 2xl:overflow-hidden 2xl:rounded-xl"
            sliderClass="flex gap-4"
        >
            {posts.map((post, idx) => (
                <PostCard post={post} size="sm" key={idx} />
            ))}
        </ReactCarousel>
    );
}
