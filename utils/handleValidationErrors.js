import { validationResult } from 'express-validator';

export default (req, res, next) => {
  //Здесь получаем ошибки в запросе (проверяем с помощью validationResult)
  const errors = validationResult(req);

  //Здесь проверяем наличие ошибок
  if (!errors.isEmpty()) {
    //Если ошибки есть, то возвращаем код ошибки 400 и весь массив найденных ошибок
    return res.status(400).json(errors.array());
  }

  next();
};
