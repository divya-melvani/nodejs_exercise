
const Blog = require("../models/blog");
//const User = require("../models/user");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Op } = require('sequelize');

// File filter to allow only images
const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
        return cb(null, true);
    }
    cb(new Error('Only images are allowed!'));
};

// Set up storage for Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); // Append the file extension
    }
  });
const upload = multer({ storage: storage, fileFilter: fileFilter });
  

exports.createBlog = (req, res) => {
    upload.single('image')(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to upload image' });
        }
        try {
            const { title, content, author, tags } = req.body;
            const imagename = req.file ? req.file.filename : null; // Get the filename of the uploaded image, if any
            const arrTag = tags.split(',').map(tag => tag.trim());
            const tagsString = JSON.stringify(arrTag);
            await Blog.create({
                title: title,
                content: content,
                author: req.user.id, 
                tags: tagsString,
                image: imagename
            });
            return res.json({ message: 'Record created successfully!' });
        } catch (error) {
            return res.status(500).json({ message: 'Unable to create a record!' });
        }
    });
};

exports.getAllBlogs = async (req, res) => {
    try {
      const { page = 1, limit = 10, search = '' } = req.query;
      const offset = (page - 1) * limit;
      
      // Search criteria
      const searchCriteria = {
        [Op.or]: [
          { title: { [Op.like]: `%${search}%` } },
          { content: { [Op.like]: `%${search}%` } } 
        ]
      };
  
      // Fetch Blog with pagination and search
      const blogs = await Blog.findAndCountAll({
        limit: parseInt(limit),
        offset: offset,
        where: searchCriteria// Apply search criteria only if search query is provided
      });
  
      res.status(200).json({
        totalItems: blogs.count,
        totalPages: Math.ceil(blogs.count / limit),
        currentPage: parseInt(page),
        blogs: blogs.rows
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// Get Specific blog Details
exports.getSpecificBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByPk(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateBlog = (req, res) => {
    upload.single('image')(req, res, async (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Failed to upload image' });
        }
        try {
            const { id } = req.params;
            const { title, content, tags } = req.body;
            const author = req.user.id;
            const blog = await Blog.findByPk(id);
            if (!blog) {
                return res.status(404).json({ message: 'Blog not found' });
            }
            
            let imagename = blog.image;
            if (req.file) {
                // Delete the old image file if it exists
                if (imagename) {
                    const oldImagePath = path.join(__dirname, '../uploads/', imagename);
                    fs.unlink(oldImagePath, (unlinkErr) => {
                        if (unlinkErr) console.error('Failed to delete old image:', unlinkErr);
                    });
                }
                // Set the new image filename
                imagename = req.file.filename;
            }
            
            // Update the blog with new data
            await blog.update({ title, content, author, tags, image: imagename });
            
            // Send a success response
            res.status(200).json({ message: 'Blog updated successfully', blog });
        } catch (error) {
            // Log the error and send a server error response
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    });
};

// Delete Blog
exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByPk(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    await blog.destroy();
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
