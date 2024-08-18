export const getAllPosts = async () => {
    const response = await fetch('posts.json');

    return response.json();
};

export const getFeaturedPosts = async () => {
    const allPosts = await getAllPosts();

    return allPosts.filter((post) => post.featured);
};
