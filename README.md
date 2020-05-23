# Домашка по локализации

* **Как приложение узнает, какой язык выбран у пользователя?**
      
Воспользовался библиотекой [i18next-browser-languageDetector](https://github.com/i18next/i18next-browser-languageDetector). Она позволяет определить язык пользователя одним из следующих способов: *querystring*, *cookie*, *localStorage*, *navigator*, *htmlTag*, *path*, *subdomain*.

* **Какие типы контента поддерживают переключение языка и как вы это реализовали**

В приложении не так уж много типов контента, который требует локализации. Только текст и даты. Переводы лежат в папке `client/src/locales/`. Для переключения между ними используется функция `t` из **react-i18next** и **i18next**.

* **Как переводы попадают на клиент? как изменилась сборка приложения?**
      
Приложения сделано с помощью CRA и я никак не вмешивался в процесс сборки. К сожалению, в текущем варианте пользователю будут доставляться тексты сразу на обоих языках :(

**Версия Node — 12.16.2**

## Установка и запуск CI-сервера и клиента

**Сервер:**

Перед запуском необходимо создать файл `.env` в папке `ci-server` и записать там свой токен для авторизации в виде `TOKEN=...` (Bearer писать не нужно)

[Ссылка для получения токена](https://hw.shri.yandex/)
```
cd ci-server && npm i
npm run build
npm run server
```
**Клиент:**
```
cd client && npm i && npm start
```

## Установка и запуск билд-сервера

**Предварительно необходимо записать свой apiToken в _./build-server/server-conf.json_**
```
cd build-server && npm i && npm start
```

## Установка и запуск билд-агента

```
cd build-agent && npm i && npm start
```

Запускать очередной билд-агент можно так-же, через `npm start`. Сервер автоматически подберёт свободный порт.


## Тесты

**После миграции проекта на TypeScript тесты могли перестать правильно работать**

Установка:

```
cd tests && npm i
npm i -g selenium-standalone
selenium-standalone install
```

**Модульные**

Для написания модульных тестов был использован фреймворк [Jest](https://jestjs.io/).

Запуск:

```
npm run test
```

**Интеграционные**

Для написания интеграционных тестов был использован фреймворк [Hermione](https://yandex.ru/dev/hermione/).

- Предварительно надо запустить сервер и клиент (инструкции выше)

- В папку `tests` скопировать `.env` из папки `server`

- Запустить selenium в отдельной вкладке терминала

      `selenium-standalone start`

- Запуск тестов:

      `npm run hermione`

Можно также запустить тесты из gui:

    `npm run gui`
