import { getPost } from '@/api/posts';

export default async function Post() {
    const post = await getPost('test');
    return (
        <div>
            <h1>{post.title}</h1>
            <pre>{post.content}</pre>
        </div>
    );
}
