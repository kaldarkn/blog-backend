import CommentModel from '../models/Comment.js';

//Создание комментария
export const create = async (req, res) => {
  try {
    const doc = new CommentModel({
      user: req.userId,
      post: req.body.postId,
      text: req.body.text,
    });

    const comment = await doc.save();

    res.json(comment);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось написать комментарий',
      error: error,
    });
  }
};

//Получение комментарий по ID поста
export const getPostComments = async (req, res) => {
  try {
    const postId = req.params.id;

    const comments = await CommentModel.find({ post: postId })
      .populate('user')
      .populate('post')
      .exec();
    res.json(comments);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'не удалось получить комментарии',
    });
  }
};
