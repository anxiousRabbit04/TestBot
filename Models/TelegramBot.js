import { Context, Telegraf } from "telegraf";
import { help as helpCommand } from "../TextAnswers/Answers.js";

export function launchTelegramBot(Token) {
    const bot = new Telegraf(Token);

    bot.command('start', (ctx) => {
        ctx.reply("Welcome")
    })

    bot.command('help', (ctx) => {
        ctx.reply(helpCommand)
    })

    bot.command('dice', (ctx) => {
        ctx.replyWithDice({ emoji: "🎲" })
    })

    bot.hears(['phone', 'Phone'], (ctx) => {
        bot.telegram.sendMessage(ctx.chat.id, 'Can we get access to your phone number?', requestPhoneKeyboard);
    }).on("contact", (ctx) => {
        console.log(ctx.message.contact);
        ctx.reply("Thanks", {
            "reply_markup": {remove_keyboard: true}
        })
    })

    bot.hears(["location", "Location"], (ctx) => {
        bot.telegram.sendMessage(ctx.chat.id, 'Can we access your location?', requestLocationKeyboard);
    }).on("location", (ctx) => {
        console.log(ctx.message.location);
        ctx.reply("Thanks", {
            "reply_markup": {remove_keyboard: true}
        })
    })

    const requestPhoneKeyboard = {
        "reply_markup": {
            "one_time_keyboard": true,
            "keyboard": [
                [{
                    text: "My phone number",
                    request_contact: true,
                    one_time_keyboard: true
                }],
                ["Cancel"]
            ]
        }
    };
    
    const requestLocationKeyboard = {
        "reply_markup": {
            "one_time_keyboard": true,
            "keyboard": [
                [{
                    text: "My location",
                    request_location: true,
                    one_time_keyboard: true
                }],
                ["Cancel"]
            ]
        }

    }

    bot.command('test', ctx => {
        const animalMessage = `great, here are pictures of animals you would love`;

        ctx.reply(animalMessage, {
            reply_markup: {
                inline_keyboard: [
                    [{
                        text: "dog",
                        callback_data: 'dog'
                    },
                    {
                        text: "cat",
                        callback_data: 'cat'
                    }
                    ],

                ]
            }
        })
    }).action('dog', ctx => {
        console.log(ctx);
        ctx.reply("dog")
    }).action('cat', ctx => {
        ctx.reply("cat")
    })

    bot.launch()
    bot.telegram.getMe().then((info) => console.log("Start", info.username));
}