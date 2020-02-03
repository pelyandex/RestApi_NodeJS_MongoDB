# RestFull Api with MongoDB
- Домен frontend: https://www.pelyan.ru https://www.pelyan.online
- Домен backend: http://www.api.pelyan.ru http://www.api.pelyan.online
- Ip машины: 84.201.146.185

> В проекте реализовано:
- Подьем REST.Api на Node JS
- Подключение MondoDB и маршрутизация посредством Mongoose
- Большинство видов http-запросов
- Логирование действий на сервере
- Авторизация и аутентификация пользователей
- JWT-токен в cookies


> Взаимодействие с БД
- GET /users — возвращает всех пользователей
- GET /users/:userId - возвращает пользователя по _id
- POST /users — создаёт пользователя
- GET /cards — возвращает все карточки
- POST /cards — создаёт карточку
- DELETE /cards/:cardId — удаляет карточку по идентификатору
- PATCH /users/me — обновляет профиль
- PATCH /users/me/avatar — обновляет аватар
- PUT /cards/:cardId/likes — поставить лайк карточке
- DELETE /cards/:cardId/likes — убрать лайк с карточки

> Инструкция на развертывания проекта:
- Скачать локальный репозиторий `git-clone`
- Установить требуемые пакеты из `package.json` через `npm`;
- Запустить сервер командами `npm run start` или `npm run dev`
