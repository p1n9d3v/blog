import { getAllPosts, getFeaturedPosts } from '@/api/posts';
import HeroCarousel from '@/components/HeroCarousel';
import PostCarousel from '@/components/PostCarousel';
import PostGrid from '@/components/PostGrid';

export default async function Home() {
    const allPosts = await getAllPosts();
    const featuredPosts = await getFeaturedPosts();
    // const [featuredPosts, setFeaturedPosts] = useState([]);
    // const [allPosts, setAllPosts] = useState([]);
    //
    // useEffect(() => {
    //     getFeaturedPosts().then((posts) => setFeaturedPosts(posts));
    //     getAllPosts().then((posts) => setAllPosts(posts));
    // }, []);

    return (
        <div className="h-full">
            <section>
                <HeroCarousel images={['/heros/boostcamp.png']} />
            </section>

            <section className="flex flex-col gap-y-4 py-4">
                <h2>Feature Posts</h2>
                <PostGrid posts={featuredPosts} cardSize="lg" />
            </section>
            {/**/}
            <section className="flex flex-col gap-y-4 py-4">
                <h2>Most Recent</h2>
                <PostCarousel posts={allPosts} />
            </section>
        </div>
    );
}
