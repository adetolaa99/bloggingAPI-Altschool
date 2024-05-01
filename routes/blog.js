const express = require("express");
const BlogModel = require("../models/blog");
const BlogRoute = express.Router();
const authMiddleware = require("../middleware/auth");

//READ- List all blogs
BlogRoute.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      state,
      author,
      title,
      tags,
      sortField,
      sortOrder,
    } = req.query;

    const skip = (page - 1) * limit;

    const sort = {};
    if (sortField && sortOrder) {
      sort[sortField] = sortOrder === "asc" ? 1 : -1;
    }

    // Defining the filter object based on the query parameters
    const filter = {};
    if (state) filter.state = state;
    if (author) filter.author = author;
    if (title) filter.title = title;
    if (tags) filter.tags = { $in: tags.split(",") };

    // Finding blogs with the specified filter, sort, and pagination
    const blogs = await BlogModel.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);

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
BlogRoute.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const blog = await BlogModel.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    if (blog.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }
    await blog.remove();
    res.json({ message: "Blog deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = BlogRoute;
