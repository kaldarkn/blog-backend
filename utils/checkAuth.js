import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  //из запроса получаем токен и вырезаем строку Bearer
  const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

  //Если токен есть
  if (token) {
    try {
      //Расшифруем токен
      const decoded = jwt.verify(token, 'secret123');
      //в req положим расшифрованный id пользователя
      req.userId = decoded._id;
      //Вызываем next()
      next();
    } catch (error) {
      return res.status(403).json({
        message: 'Нет доступа',
      });
    }
  } else {
    return res.status(403).json({
      message: 'Нет доступа',
    });
  }
};
