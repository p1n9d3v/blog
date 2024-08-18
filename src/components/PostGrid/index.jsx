import PostCard from '@/components/PostCard';
import { cn } from '@/utils';

export default function PostGrid({ posts, cardSize }) {
    return (
        <div
            className={cn(
                'grid gap-4',
                'grid-cols-1 place-items-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
            )}
        >
            {posts.map((post, idx) => (
                <PostCard post={post} size={cardSize} key={idx} />
            ))}
        </div>
    );
}
