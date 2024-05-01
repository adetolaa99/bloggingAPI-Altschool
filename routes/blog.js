const express = require("express");
const BlogModel = require("../models/blog");
const BlogRoute = express.Router();
const authMiddleware = require("../middleware/auth");

//READ- List all blogs
BlogRoute.get("/", async (req, res) => {
  try {
    const blogs = await BlogModel.find({ state: "published" });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//CREATE- Create a new blog
BlogRoute.post("/", authMiddleware, async (req, res) => {
  const blog = new BlogModel({
    ...req.body,
    author: req.user.userid,
    state: "draft",
  });
  try {
    const savedBlog = await blog.save();
    res.status(201).json(savedBlog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//UPDATE- Update a blog
BlogRoute.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const blog = await BlogModel.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    if (blog.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }
    const updatedBlog = await BlogModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res.json(updatedBlog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//DELETE- Delete a blog
BlogRoute.delete('/:id', authMiddleware, async (req, res) => {
    try {
       const blog = await BlogModel.findById(req.params.id);
       if (!blog) {
         return res.status(404).json({ message: 'Blog not found' });
       }
       if (blog.author.toString() !== req.user.userId) {
         return res.status(403).json({ message: 'Not authorized' });
       }
       await blog.remove();
       res.json({ message: 'Blog deleted' });
    } catch (err) {
       res.status(500).json({ message: err.message });
    }
   });

module.exports = BlogRoute;