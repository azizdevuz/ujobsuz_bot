// Импорт Telegraf и Markup
const { Telegraf, Markup } = require("telegraf");
// Импорт dotenv для защиты API токена
require("dotenv").config();
// Импорт нашего модуля с константами
const my_const = require("./const");
// Инициализация бота с помощью Telegraf
const bot = new Telegraf("5537312113:AAHBC0M73um0Ia9bsQYtsXOIUFVxl-4edl0");
// import ref and set from firebase in node js
const fb = require("firebase/database");
const db = require("./db");

// Обработка команды /start
bot.start((ctx) => {
  fb.set(fb.ref(db, "users/" + ctx.from.id), {
    id: ctx.from.id,
    first_name: ctx.from.first_name,
    username: ctx.from.username,
  });

  ctx.replyWithHTML(
    `Assalomu alaykum ${
      ctx.message.from.first_name
        ? "<b>" + ctx.message.from.first_name + "</b>"
        : "незнакомец"
    }`
  );
});
// Обработка команды /help
bot.help((ctx) => ctx.reply(my_const.commands));
// Обработка команды /course
bot.command("course", async (ctx) => {
  try {
    await ctx.replyWithHTML(
      "<b>Курсы</b>",
      Markup.inlineKeyboard([
        [
          Markup.button.callback("Редакторы", "btn_1"),
          Markup.button.callback("Обзоры", "btn_2"),
          Markup.button.callback("JS", "btn_3"),
        ],
      ])
    );
  } catch (e) {
    console.error(e);
  }
});
// users
bot.command("users", async (ctx) => {
  try {
    let users = [];
    fb.onChildAdded(fb.ref(db, "users"), (snapshot) => {
      users.push(snapshot.val());
    });
    await ctx.replyWithHTML("<b>Users:</b>" + users.length);
  } catch (e) {
    console.error(e);
  }
});

/**
 * Функция для отправки сообщения ботом
 * @param {String} id_btn Идентификатор кнопки для обработки
 * @param {String} src_img Путь к изображению, или false чтобы отправить только текст
 * @param {String} text Текстовое сообщение для отправки
 * @param {Boolean} preview Блокировать превью у ссылок или нет, true - блокировать, false - нет
 */
function addActionBot(id_btn, src_img, text, preview) {
  bot.action(id_btn, async (ctx) => {
    try {
      await ctx.answerCbQuery();
      if (src_img !== false) {
        await ctx.replyWithPhoto({
          source: src_img,
        });
      }
      await ctx.replyWithHTML(text, {
        disable_web_page_preview: preview,
      });
    } catch (e) {
      console.error(e);
    }
  });
}
// Обработчик кнопок с помощью функции
addActionBot("btn_1", "./img/1.jpg", my_const.text1, true);
addActionBot("btn_2", "./img/2.jpg", my_const.text2, true);
addActionBot("btn_3", false, my_const.text3, false);

// Запустить бота
bot.launch();

// Включить плавную остановку
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
