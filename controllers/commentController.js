
const Comment = require("../models/comment");
const Blog = require("../models/blog");

exports.createComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;

        // Ensure content is provided
        if (!content) {
            return res.status(400).json({ message: 'Content is required' });
        }

        // Find the blog post
        const blog = await Blog.findByPk(id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Create the comment
        const comment = await Comment.create({
            content,
            author: req.user.id, // Use the authenticated user's ID
            blog_post_id: blog.id,
        });

        // Send a success response
        res.status(201).json({ message: 'Comment added successfully', comment });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};


exports.getAllComments = async (req, res) => {
    try {
        const { id } = req.params;
        // Find the blog post
        const blog = await Blog.findByPk(id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Find all comments associated with the blog post
        const comments = await Comment.findAll({
            where: { blog_post_id: id },
            attributes: ['id', 'content', 'createdAt', 'updatedAt'], // Select specific attributes to include in the response
            order: [['createdAt', 'DESC']] // Order comments by creation date, newest first
        });

        // Send the comments as a JSON response
        res.status(200).json({ comments });
    } catch (error) {
        console.error('Error retrieving comments:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.deleteComment = async (req, res) => {
    try {
        const { id, commentid } = req.params;

        // Find the comment
        const comment = await Comment.findOne({
            where: { id: commentid, blog_post_id: id }
        });

        // Check if the comment exists
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Delete the comment
        await comment.destroy();

        // Send a success response
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
