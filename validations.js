import { body } from 'express-validator';

//Валидация полей авторизации
export const loginValidation = [
  //Первый парамметр это свойство, которое проверяется, второй параметр информация об ошибке
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должен быть минимум 5 символов').isLength({ min: 5 }),
];

//Валидация полей регистрации
export const registerValidation = [
  //Первый парамметр это свойство, которое проверяется, второй параметр информация об ошибке
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должен быть минимум 5 символов').isLength({ min: 5 }),
  body('fullName', 'Укажите имя').isLength({ min: 3 }),
  body('avatarUrl', 'Неверная ссылка на автарку').optional().isURL(),
];

//Валидация на создание статьи
export const postCreateValidation = [
  //Первый парамметр это свойство, которое проверяется, второй параметр информация об ошибке
  body('title', 'Введите заголовок статьи').isLength({ min: 3 }).isString(),
  body('text', 'Введите текст статьи').isLength({ min: 3 }).isString(),
  body('tags', 'Неверный формат тэгов (укажите массив)').optional().isArray(),
  body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
];
