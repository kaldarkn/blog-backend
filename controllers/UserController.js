import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserModel from '../models/User.js';

export const register = async (req, res) => {
  try {
    //Запишем полученный пароль в отдельную переменную
    const password = req.body.password;
    //Генерируем соль
    const salt = await bcrypt.genSalt(10);
    //Шифруем пароль: вызываем bcrypt.hash() и передаем сам пароль и соль
    const hash = await bcrypt.hash(password, salt);

    //Создадим документ
    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    });

    //Создаём пользователя в MongoDB
    const user = await doc.save();

    //Создаём токен, в котором зашифруем id и укажем срок жизни 30 дней
    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret123',
      {
        expiresIn: '30d',
      },
    );

    //Вытащим отдельно поле passwordHash и все остальные поля
    const { passwordHash, ...userData } = user._doc;

    //Если ошибок нет, то возвращаем информацию о пользователе
    res.json({
      ...userData,
      token,
    });
  } catch (error) {
    //вернём ошибку
    console.log(error);
    res.status(500).json({
      message: 'Не удалось зарегистрироваться',
    });
  }
};

export const login = async (req, res) => {
  try {
    //Попытаемся получить юзера из БД по введенному в запросе email-у
    const user = await UserModel.findOne({ email: req.body.email });

    //Если такого пользователя нет, то останавливаем код и возвращаем сообщение об ошибке со статусом 404
    if (!user) {
      return res.status(404).json({
        message: 'Пользователь не найден',
      });
    }

    //Если же пользователь есть, то выполняется эта строка
    //Сравниваем пароли
    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

    //Если пароли не совпадают
    if (!isValidPass) {
      return res.status(400).json({
        message: 'Неверный логин или пароль',
      });
    }

    //Создаём токен, в котором зашифруем id и укажем срок жизни 30 дней
    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret123',
      {
        expiresIn: '30d',
      },
    );

    //Вытащим отдельно поле passwordHash и все остальные поля
    const { passwordHash, ...userData } = user._doc;

    //возвращаем информацию о пользователе
    res.json({
      ...userData,
      token,
    });
  } catch (error) {
    //вернём ошибку
    console.log(error);
    res.status(500).json({
      message: 'Не удалось авторизоваться',
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: 'Пользователь не найден',
      });
    }

    //Вытащим отдельно поле passwordHash и все остальные поля
    const { passwordHash, ...userData } = user._doc;

    //возвращаем информацию о пользователе
    res.json(userData);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Нет доступа',
    });
  }
};
