import { Post } from '../models/post.model.js';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { PostSchema } from '../utils/validations/post.js';

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find();

    return res
      .status(200)
      .json(new ApiResponse(200, posts, 'Post retrieved successfully'));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, 'Internal Server Error', error.message);
  }
};

const createPost = async (req, res) => {
  try {
    const user = req.user;
    const userId = user._id;
    const { title, description } = req.body;

    const { error } = PostSchema.validate(req.body);

    if (error) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            null,
            `Validation error: ${error.details[0].message}`
          )
        );
    }

    const post = await Post.create({ title, description, userId });
    await User.findByIdAndUpdate(userId, { $push: { posts: post._id } });

    return res
      .status(201)
      .json(new ApiResponse(201, post, 'Post created successfully'));
  } catch (error) {
    console.log(error, 'Error while creating POST');
    return res
      .status(500)
      .json(new ApiError(500, 'Internal Server Error', error.message));
  }
};

const updatePost = async (req, res) => {
  try {
    const id = req.params.postId;
    const { title, description, userId } = req.body;

    const { error } = PostSchema.validate(req.body);

    if (error) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            null,
            `Validation error: ${error.details[0].message}`
          )
        );
    }

    const post = await Post.findByIdAndUpdate(id, {
      title,
      description,
      userId,
    });
    if (!post) {
      return res.status(404).json(new ApiResponse(404, null, 'Post not found'));
    }
    await User.findByIdAndUpdate(userId, { $push: { posts: post._id } });

    return res
      .status(200)
      .json(new ApiResponse(200, null, 'Post updated successfully'));
  } catch (error) {
    console.log(error, 'Error while updating POST');
    return res
      .status(500)
      .json(new ApiError(500, 'Internal Server Error', error.message));
  }
};

const deletePost = async (req, res) => {
  try {
    const postId = req.params.postId;

    const post = await Post.findById(postId);
    if (!post) {
      throw new ApiError(404, 'Post not found');
    }

    await Post.findByIdAndDelete(postId);

    return res
      .status(200)
      .json(new ApiResponse(200, null, 'Post deleted successfully'));
  } catch (error) {
    console.error('Error while deleting post:', error);
    return res
      .status(500)
      .json(new ApiError(500, 'Internal Server Error', error.message));
  }
};

export { getPosts, createPost, deletePost, updatePost };
