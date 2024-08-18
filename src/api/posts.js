import fs from 'fs/promises';
import path from 'path';

export const getAllPosts = async () => {
    const filePath = path.join(process.cwd(), 'data', 'posts', 'metadata.json');

    return fs.readFile(filePath, 'utf-8').then(JSON.parse);
};

export const getFeaturedPosts = async () => {
    const allPosts = await getAllPosts();

    return allPosts.filter((post) => post.featured);
};

export const getPost = async (fileName) => {
    const filePath = path.join(process.cwd(), 'data', 'posts', fileName.concat('.md'));
    const metadata = (await getAllPosts()).find((post) => post.fileName === fileName);

    if (!metadata) throw new Error('Not found');

    const content = await fs.readFile(filePath, 'utf-8');

    return {
        metadata,
        content,
    };
};
