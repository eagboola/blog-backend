// All functionality for interacting with DB.
import BlogModel from "../models/Blog.ts";
import type { BlogEdits, BlogEditProps, RawBlog, Blog } from "../types/blog.ts";
import type { Request, Response } from "express";

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
    const newBlog: RawBlog = {
      title,
      content,
      author,
      publication_date: new Date().toLocaleDateString(),
    }
    const createdBlog = await BlogModel.create(newBlog);
    res.status(201).json(createdBlog);
  } catch (err: unknown) {
    if (err instanceof Error) {
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
    
    // <--
    // Export to utils
    const edits: BlogEdits = {};
    const props: Array<BlogEditProps> = ['title', 'content', 'author'];
    
    for (let i = 0; i < props.length; i += 1) {
      let prop = props[i];
      if (prop in req.body) {
        edits[prop] = req.body[prop];
      }
    }
    // -->
    
    // Update blog corresponding to `id`.
    // Use `edits` existing on request body to guarantee only making new changes.
    // Return modified `blog` (not blog before edits) and enforce schema use with `runValidators`.
    const blog = await BlogModel.findByIdAndUpdate(id, edits, { returnDocument: 'after', runValidators: true });

    if (!blog) {
      res.status(404).json({ message: "Blog cannot be edited because it was not found" });
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
    }
    res.status(204).send();
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message })
    }
  }
}