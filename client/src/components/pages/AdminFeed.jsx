import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL, BACKEND_URL } from '../../config/constants';

const AdminFeed = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newPost, setNewPost] = useState({ content: '', type: '', link: '', image_url: '' });
    const [editingPost, setEditingPost] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const fetchPosts = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/feed`);
            setPosts(response.data);
        } catch (error) {
            setError('Error fetching posts');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPost({ ...newPost, [name]: value });
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        let imageUrl = newPost.image_url;

        if (selectedFile) {
            const formData = new FormData();
            formData.append('image', selectedFile);

            try {
                const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer my-super-secret-api-key`
                    }
                });
                imageUrl = response.data.imageUrl;
            } catch (error) {
                setError('Error uploading image');
                setIsSubmitting(false);
                return;
            }
        }

        try {
            const postData = { ...newPost, image_url: imageUrl };
            if (editingPost) {
                await axios.put(`${API_BASE_URL}/feed/${editingPost.id}`, postData, {
                    headers: { 'Authorization': `Bearer my-super-secret-api-key` }
                });
            } else {
                await axios.post(`${API_BASE_URL}/feed`, postData, {
                    headers: { 'Authorization': `Bearer my-super-secret-api-key` }
                });
            }
            setNewPost({ content: '', type: '', link: '', image_url: '' });
            setSelectedFile(null);
            setEditingPost(null);
            fetchPosts();
        } catch (error) {
            setError(editingPost ? 'Error updating post' : 'Error creating post');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await axios.delete(`${API_BASE_URL}/feed/${id}`, {
                    headers: { 'Authorization': `Bearer my-super-secret-api-key` }
                });
                fetchPosts();
            } catch (error) {
                setError('Error deleting post');
            }
        }
    };

    const handleEditClick = (post) => {
        setEditingPost(post);
        setNewPost({
            content: post.content || '',
            type: post.type || '',
            link: post.link || '',
            image_url: post.image_url || ''
        });
    };

    const handleCancelEdit = () => {
        setEditingPost(null);
        setNewPost({ content: '', type: '', link: '', image_url: '' });
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500 bg-red-100 p-4 rounded-md">{error}</p>;

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="container mx-auto p-4 mt-24 max-w-3xl">
                <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="p-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-6">Feed Admin Panel</h1>
                        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-50 rounded-lg">
                            <h2 className="text-xl font-semibold text-gray-700 mb-4">{editingPost ? 'Edit Post' : 'Create New Post'}</h2>
                            <textarea
                                name="content"
                                value={newPost.content}
                                onChange={handleInputChange}
                                placeholder="What's on your mind?"
                                className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:ring-2 focus:ring-blue-500 text-gray-800"
                                required
                                rows="4"
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <input
                                    type="text"
                                    name="type"
                                    value={newPost.type}
                                    onChange={handleInputChange}
                                    placeholder="Post Type (e.g., 'motivation')"
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-800"
                                    required
                                />
                                <input
                                    type="text"
                                    name="link"
                                    value={newPost.link}
                                    onChange={handleInputChange}
                                    placeholder="Link (optional)"
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-800"
                                />
                            </div>
                            <input
                                type="file"
                                name="image"
                                onChange={handleFileChange}
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            <div className="flex items-center">
                                <button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed">
                                    {isSubmitting ? 'Submitting...' : (editingPost ? 'Update Post' : 'Add Post')}
                                </button>
                                {editingPost && (
                                    <button type="button" onClick={handleCancelEdit} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md ml-4">
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Existing Posts</h2>
                            <ul className="space-y-4">
                                {posts.map(post => (
                                    <li key={post.id} className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm flex justify-between items-start">
                                        <div className="flex items-start">
                                            {post.image_url && <img src={`${BACKEND_URL}${post.image_url}`} alt={post.type} className="w-20 h-20 object-cover rounded-md mr-4"/>}
                                            <div>
                                                <p className="text-gray-800">{post.content}</p>
                                                <small className="text-gray-500">Type: {post.type}</small>
                                            </div>
                                        </div>
                                        <div className="flex-shrink-0 ml-4">
                                            <button onClick={() => handleEditClick(post)} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded-md mr-2">Edit</button>
                                            <button onClick={() => handleDelete(post.id)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-md">Delete</button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminFeed; 