'use client';

import { cn } from '@/utils';
import Image from 'next/image';
import { TypeAnimation } from 'react-type-animation';

export default function Thumbnail({ src, title, desc }) {
    return (
        <div className="relative min-h-[400px] w-full overflow-hidden rounded-lg lg:min-h-[800px]">
            <TypeAnimation
                style={{
                    display: 'block',
                    zIndex: 1,
                    fontSize: '3rem',
                    color: 'white',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                }}
                sequence={[title]}
                speed={40}
                repeat={Infinity}
            />
            <Image
                src={src}
                alt={title}
                fill
                className="brightness-70 h-full w-full object-cover blur-sm"
            />
        </div>
    );
}
