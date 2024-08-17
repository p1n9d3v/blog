'use client';

import Carousel from '@/components/Carousel';
import PostCard from '@/components/PostCard';
import { Card } from 'flowbite-react';
import Image from 'next/image';

export default function Home() {
    return (
        <div className="h-full">
            <section>
                <Carousel />
            </section>

            <section>
                <h2>Posts</h2>
                <PostCard
                    post={{
                        title: 'Post 1',
                        description: 'Post 1 description',
                        thumbnail:
                            'https://flowbite-react.com/_next/image?url=%2Fimages%2Fblog%2Fimage-1.jpg&w=640&q=75',
                    }}
                    size="md"
                />
            </section>
        </div>
    );
}
