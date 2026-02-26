import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";

describe("GET /api/blogs", () => {
  it("returns 200 with empty array if no blogs exist", async () => {
    const response = await request(app).get('/api/blogs');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  })
});

describe("POST /api/blogs", () => {

  // Creating and return a new blog when all fields supplied
  it("creates a new blog, responds '201' with new blog, and defaults `author` to `'anonymous'`", async () => {
    const res = await request(app)
      .post("/api/blogs")
      .send({ title: "Something", content: "someone wrote this" });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe("Something");
    expect(res.body.content).toBe("someone wrote this");
    expect(res.body.author).toBe("anonymous");
  });

  // When no `author` field supplied, defaults to `"anonymous"`
  it("creates a new blog, responds '201' with new blog, and defaults `author` to `'anonymous'`", async () => {
    const res = await request(app)
      .post("/api/blogs")
      .send({ title: "Something", content: "someone wrote this" });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe("Something");
    expect(res.body.content).toBe("someone wrote this");
    expect(res.body.author).toBe("anonymous");
  });

});

describe("GET /api/blogs/:id", () => {
  it("returns 404 if no blog exists by given `id`", async () => {
    const res = await request(app)
      .get("/api/blogs/0123456789");

    expect(res.status).toBe(404);
  })
  
  it("returns a blog (as JSON) if blog corresponding to `id` exists", async () => {
    const dummyBlog = await request(app)
      .post('/api/blogs')
      .send({ title: "TEST", content: "TEST CONTENT" });
    
    const res = await request(app)
      .get(`/api/blogs/${dummyBlog.body._id}`);
    
    expect(res.status).toBe(200);
    expect(res.body._id).toBe(dummyBlog.body._id);
      
  })
});

describe("PATCH /api/blogs/:id", () => {
  it("updates only specified fields of a blog", async () => {
    const created = await request(app)
      .post('/api/blogs')
      .send({
        title: "Original",
        content: "Original Content",
    })
    const res = await request(app)
      .patch(`/api/blogs/${created.body._id}`)
      .send({ title: "Updated" })
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Updated");
    expect(res.body.content).toBe("Original Content");
  })
  
  it("returns 404 for non-existent id", async () => {
    const res = await request(app)
      .patch("/api/blogs/non-existent")
      .send({ title: "random title"})
    expect(res.status).toBe(404)
  })
})
