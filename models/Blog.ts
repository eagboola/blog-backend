import { Schema, model } from "mongoose";

const blogSchema = new Schema(
  {
    title: {
      type: String, required: true
    },
      content: {
        type: String, required: true
    },
      author: {
        // Defaults to "anonymous"...
        // Default value can be 'set' in front-end:
        // if no `author` submitted, use `"anonymous"`
        type: String, required: true
    },
      publication_date: {
        type: String, required: true
    }
  },
  { timestamps: true,
    versionKey: false,
    // toJSON: {
    //   transform: function (doc, ret) {
    //     ret.id = ret._id;
    //     delete ret._id;
    //     return ret;
    //   }
    // }
   },
);

const BlogModel = model('Blog', blogSchema);

export default BlogModel;