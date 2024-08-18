import { cn } from '@/utils';
import { cva } from 'class-variance-authority';
import { Card } from 'flowbite-react';
import Image from 'next/image';

export default function PostCard({ post, size }) {
    const cardVariant = cva('group cursor-pointer', {
        variants: {
            size: {
                sm: 'max-w-sm',
                md: 'max-w-md',
                lg: 'max-w-lg',
                xl: 'max-w-xl',
                full: 'max-w-full',
            },
        },
        defaultVariants: {
            size: 'md',
        },
    });

    return (
        <Card
            className={cn(cardVariant({ size }))}
            renderImage={() => (
                <div className="overflow-hidden">
                    <Image
                        src={post.thumbnail}
                        className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                        alt={`${post.title} thumbnail`}
                        width={500}
                        height={500}
                    />
                </div>
            )}
        >
            <h4 className="line-clamp-1">{post.title}</h4>
            <p className="line-clamp-1">{post.description}</p>
        </Card>
    );
}
