// All functionality for interacting with DB.
import BlogModel from "../models/Blog.js";
import type { BlogEdits, BlogEditProps, RawBlog, Blog } from "../types/blog.js";
import type { Request, Response } from "express";
import { extractBlogEditData } from "../utils/controller-utils.js";
import mongoose from "mongoose"
const { ValidationError } = mongoose.Error;   // Not available to import as module, must be destructured.

// Get all blog entries
export async function getAllBlogs(req: Request, res: Response) {
  try {
    const blogs = await BlogModel.find();
    res.status(200).json(blogs);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    }
  }
}

export async function createBlog(req: Request, res: Response) {
  try {
    const { title, content} = req.body;
    let author: string = "anonymous";
    if ("author" in req.body) {
      author = req.body.author;
    }

    // move this to controller-utils?
    const newBlog: RawBlog = {
      title,
      content,
      author,
      publication_date: new Date().toLocaleDateString(),
    }
    const createdBlog = await BlogModel.create(newBlog);
    res.status(201).json(createdBlog);
  } catch (err: unknown) {
    console.log(err);
    if (err instanceof ValidationError) {
      res.status(400).json({ message: err.message });
    } else if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } 
  }
}

export async function getBlogById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const blog = await BlogModel.findById(id);
    if (!blog) {
      res.status(404).json({ message: "Blog not found" });
      // exit function early to ensure we don't try to send a 200 reponse after this 404.
      return 
    }
    res.status(200).json(blog);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    }
  }
}

export async function updateBlog(req: Request, res: Response) {
  try {
    const { id } = req.params;
    
    const edits: BlogEdits = extractBlogEditData(req.body);
    
    // Update blog corresponding to `id`.
    // Use `edits` existing on request body to guarantee only making new changes.
    // Return modified `blog` (not blog before edits) and enforce schema use with `runValidators`.
    // Could validate for `edit` fields: if none, don't do anything...
    const blog = await BlogModel.findByIdAndUpdate(id, edits, { returnDocument: 'after', runValidators: true });

    if (!blog) {
      res.status(404).json({ message: "Blog cannot be edited because it was not found" });

      // Ensure function exit after responding with `404`.
      // This prevents accidentally sending another response with `200` status.
      return; 
    }
    res.status(200).json(blog);

  } catch(err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message })
    }
  }
}

export async function deleteBlog(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deletedBlog = await BlogModel.findByIdAndDelete(id);
    if (!deletedBlog) {
      res.status(404).json({ message: "Blog not found" });
      return;
    }
    res.status(204).send();
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message })
    }
  }
}
