'use client';
import ReactCarousel from 'react-multi-carousel';

export default function Carousel({ children, ...rest }) {
    return <ReactCarousel {...rest}>{children}</ReactCarousel>;
}
