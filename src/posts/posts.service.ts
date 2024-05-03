import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import  { Model } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

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

  async findAllByAuthorId(authorId: string): Promise<Post[]> {
    console.log('Service: Fetching all posts for authorId:', authorId);
    try {
      const posts = await this.postModel
        .find({ author: authorId })
        .populate('author')
        .exec();
      return posts;
    } catch (error) {
      console.error('Service: Error fetching posts for author:', error);
      throw error;
    }
  }

  async findAllByAuthorsIds(authorsIds: string[]): Promise<Post[]> {
    console.log('Service: Fetching all posts for authors:', authorsIds);
    try {
        const posts = await this.postModel
            .find({ author: { $in: authorsIds } })
            .populate('author')
            .exec();
        return posts;
    } catch (error) {
        console.error('Service: Error fetching posts for authors:', error);
        throw error;
    }
}
  
}
