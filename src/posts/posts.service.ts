import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  //create a post
  async create(createPostDto: {
    title: string;
    description: string;
    authorId: string;
  }): Promise<Post> {
    const { title, description, authorId } = createPostDto;
    const createdPost = new this.postModel({
      title,
      description,
      author: authorId,
    });
    try {
      const savedPost = await createdPost.save();
      return savedPost;
    } catch (error) {
      console.error('Service: Error saving post:', error);
      throw error;
    }
  }

  //find post of a user
  async findAllByAuthorId(authorId: string): Promise<Post[]> {
    try {
      const posts = await this.postModel
        .find({ author: authorId })
        .populate('author', 'username _id createdAt')
        .exec();
      return posts;
    } catch (error) {
      console.error('Service: Error fetching posts for author:', error);
      throw error;
    }
  }

  //find posts for timeline
  async findAllByAuthorsIds(authorsIds: string[]): Promise<Post[]> {
    try {
      const posts = await this.postModel
        .find({ author: { $in: authorsIds } })
        .populate('author', 'username _id createdAt')
        .sort({ createdAt: -1 })
        .exec();
      return posts;
    } catch (error) {
      console.error('Service: Error fetching posts for authors:', error);
      throw error;
    }
  }
}
