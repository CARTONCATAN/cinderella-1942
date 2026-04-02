const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const POSTS_FILE = path.join(__dirname, '..', 'data', 'posts.json');
const REPO_DIR = path.join(__dirname, '..');

function readPosts() {
    const raw = fs.readFileSync(POSTS_FILE, 'utf-8');
    return JSON.parse(raw);
}

function writePosts(data) {
    fs.writeFileSync(POSTS_FILE, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

function gitPush(commitMessage) {
    execSync('git add data/posts.json', { cwd: REPO_DIR });
    execSync(`git commit -m "${commitMessage}"`, { cwd: REPO_DIR });
    execSync('git push', { cwd: REPO_DIR });
}

function getNextId(posts) {
    if (posts.length === 0) return 1;
    return Math.max(...posts.map(p => p.id)) + 1;
}

function todayISO() {
    return new Date().toISOString().split('T')[0];
}

const TAG_ICONS = {
    'Competition': 'fas fa-trophy',
    'Build Season': 'fas fa-robot',
    'Season Kickoff': 'fas fa-rocket',
    'Community': 'fas fa-handshake',
    'Team': 'fas fa-users',
    'Outreach': 'fas fa-graduation-cap',
    'Awards': 'fas fa-medal',
    'Event': 'fas fa-calendar-star',
};

async function addPost({ title, summary, tag, icon, image, author, readTime }) {
    const data = readPosts();

    const newPost = {
        id: getNextId(data.posts),
        title,
        tag,
        icon: icon || TAG_ICONS[tag] || 'fas fa-newspaper',
        date: todayISO(),
        author: author || 'Team 1942',
        readTime: readTime || '2 min read',
        summary,
        image: image || '',
    };

    data.posts.push(newPost);
    writePosts(data);
    gitPush(`Add post: ${title}`);
    return newPost;
}

async function listPosts() {
    const data = readPosts();
    return data.posts.sort((a, b) => new Date(b.date) - new Date(a.date));
}

async function deletePost(id) {
    const data = readPosts();
    const index = data.posts.findIndex(p => p.id === id);
    if (index === -1) return null;

    const removed = data.posts.splice(index, 1)[0];
    writePosts(data);
    gitPush(`Delete post: ${removed.title}`);
    return removed;
}

async function editPost(id, updates) {
    const data = readPosts();
    const post = data.posts.find(p => p.id === id);
    if (!post) return null;

    if (updates.title) post.title = updates.title;
    if (updates.summary) post.summary = updates.summary;
    if (updates.tag) post.tag = updates.tag;
    if (updates.icon) post.icon = updates.icon;
    if (updates.image !== undefined) post.image = updates.image;

    writePosts(data);
    gitPush(`Edit post: ${post.title}`);
    return post;
}

module.exports = { addPost, listPosts, deletePost, editPost };
