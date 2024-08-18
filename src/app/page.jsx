'use client';

import { getAllPosts, getFeaturedPosts } from '@/api/posts';
import Carousel from '@/components/Carousel';
import PostGrid from '@/components/PostGrid';
import { useEffect, useState } from 'react';

export default function Home() {
    const [featuredPosts, setFeaturedPosts] = useState([]);

    useEffect(() => {
        getFeaturedPosts().then((posts) => setFeaturedPosts(posts));
    }, []);

    return (
        <div className="h-full">
            <section>
                <Carousel images={['/heros/boostcamp.png']} />
            </section>

            <section className="py-4">
                <PostGrid posts={featuredPosts} title="Feature Posts" cardSize="lg" />
            </section>

            <section></section>
        </div>
    );
}
