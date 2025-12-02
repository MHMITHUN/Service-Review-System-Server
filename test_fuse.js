import Fuse from 'fuse.js';
console.log('Type of Fuse:', typeof Fuse);
console.log('Fuse value:', Fuse);
try {
    const fuse = new Fuse([], { keys: ['title'] });
    console.log('Fuse instantiation success');
} catch (error) {
    console.error('Fuse instantiation failed:', error.message);
}
