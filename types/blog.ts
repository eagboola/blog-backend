export interface RawBlog {
  title: string,
  content: string,
  author: string,
  publication_date: string,
}

export interface Blog {
  id: string,
  title: string,
  content: string,
  author: string, 
  publication_date: string,
}

export interface BlogEdits {
  title?: string;
  content?: string;
  author?: string;
}

export type BlogEditProps = "title" | "content" | "author";