import type { Response } from 'express';
import type { Request } from 'express';
import Post from "../models/Post.ts";
import Profile from '../models/Profile.ts';

const PostsController = {
    createPost: async (req: Request, res: Response) => {
        try {
            const { id, content, creater } = req.body;

            // Валидация
            if (!id || !creater || id === 'null' || id === 'undefined') {
                return res.status(400).json({ error: "Owner and creator IDs are required" });
            }
            if (!content || content.trim().length === 0) {
                return res.status(400).json({ error: "Post content is required" });
            }

            // Создаем пост
            const post = new Post({
                content: content.trim(),
                owner: id,
                creater
            });

            const savedPost = await post.save();

            // ОБНОВЛЯЕМ ПРОФИЛЬ - добавляем ID поста в массив posts
            const dasdasd = await Profile.findOneAndUpdate(
                { owner: id }, // ищем профиль владельца страницы
                { $push: { posts: savedPost._id } }, // добавляем пост в массив
                { new: true, upsert: true } // upsert: true создаст профиль если не существует
            );

            res.status(200).json(savedPost);

        } catch (error) {
            console.error("Error creating post:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    },
    findPosts: async (req: Request, res: Response) => {
    try {
        
        if (!req.params.id) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const posts = await Post.find({ owner: req.params.id })
            .populate('owner', 'email fullName avatar isOnline')
            .populate('creater', 'email fullName avatar isOnline')
            .lean(); // преобразуем в plain objects

        const mappedPosts = posts.map((item: any) => ({
            ...item,
            creater: {
                ...item.creater,
                avatar: item.creater.avatar 
                    ? `${process.env.BACKEND_URL}:${process.env.PORT}/${item.creater.avatar}`
                    : null
            },
            owner: {
                ...item.owner,
                avatar: item.owner.avatar 
                    ? `${process.env.BACKEND_URL}:${process.env.PORT}/${item.owner.avatar}`
                    : null
            }
        }));

        res.status(200).json(mappedPosts);

    } catch (error) {
        console.error("Error finding posts:");
        res.status(500).json({ error: "Internal server error" });
    }
}
}

export default PostsController;