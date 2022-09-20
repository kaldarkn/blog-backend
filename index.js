import express from 'express';
import multer from 'multer';
import cors from 'cors';
import mongoose from 'mongoose';

import { registerValidation, loginValidation, postCreateValidation } from './validations.js';

import { handleValidationErrors, checkAuth } from './utils/index.js';

import { UserController, PostController, CommentController } from './controllers/index.js';

//Подключаемся к нашей БД MongoDBs
mongoose
  .connect(
    'mongodb+srv://admin:wwwwww@cluster0.kawdza6.mongodb.net/blog?retryWrites=true&w=majority',
  )
  .then(() => console.log('DB ok'))
  .catch((err) => console.log('DB error', err));

const app = express();

//Создаем хранилище
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

//Говорим экспрессу использовать json
app.use(express.json());
//Отключаем cors-ы
app.use(cors());
//Если придёт запрос на /uploads, нужно дальше этот запрос отправлять в папку uploads (чтобы express понимал, что GET запрос на получение статичного файла)
app.use('/uploads', express.static('uploads'));

//РОУТЫ
//Обработка POST запроса на загрузку файла
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});
//обработка POST запроса на авторизацию
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
//Обработка POST запроса на регистрацию
//Третий параметр callback запускается, если второй параметр registerValidation валидировал правильно
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
//Обработка GET запроса на получение информации о пользователе
app.get('/auth/me', checkAuth, UserController.getMe);
//Обработка запросов статей
app.get('/tags', PostController.getLastTags);
app.get('/posts', PostController.getAll);
app.get('/posts/tags', PostController.getLastTags);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.get('/posts/:id', PostController.getOne);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch(
  '/posts/:id',
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.update,
);
//Создание комментария
app.post('/comments', checkAuth, CommentController.create);
//Получение всех комментариев по ID поста
app.get('/comments/:id', CommentController.getPostComments);

//Запускаем наш сервер на порте 4444 и в случае ошибки запуск выводим информацию в консоль
app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log('Server OK');
});
