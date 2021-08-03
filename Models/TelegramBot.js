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
        ctx.deleteMessage();
        ctx.reply("Choose emoji", requestDiceKeyboard)
    }).action(arrayDiceEmoji, ctx => {
        ctx.deleteMessage();
        ctx.replyWithDice({ emoji: ctx.update.callback_query.data }).then(message => {
            const indexEmoji = arrayDiceEmoji.indexOf(message.dice.emoji);
            if (indexEmoji < 3) {
                ctx.reply(`Value: ${message.dice.value}`)    
            } else if (indexEmoji == 5)
            {
                const value = message.dice.value - 1;
                const arr = [value%4]
                arr.push(((value/4)|0)%4);
                arr.push((value/16)|0);
                arr.forEach(element => {
                    console.log(element);
                });
            }
        })
    })

    bot.hears(['phone', 'Phone'], (ctx) => {
        ctx.reply('Can we get access to your phone number?', requestPhoneKeyboard);
    }).on("contact", (ctx) => {
        console.log(ctx.message.contact);
        ctx.reply("Thanks", {
            "reply_markup": { remove_keyboard: true }
        })
    })

    bot.hears(["location", "Location"], (ctx) => {
        ctx.reply('Can we access your location?', requestLocationKeyboard);
    }).on("location", (ctx) => {
        console.log(ctx.message.location);
        ctx.reply("Thanks", {
            "reply_markup": { remove_keyboard: true }
        })
    })

    bot.command('test', ctx => {
        const animalMessage = `great, here are pictures of animals you would love`;

        ctx.reply(animalMessage, {
            reply_markup: {
                inline_keyboard: [
                    [{
                        text: "dogs",
                        callback_data: 'dog',
                    }],
                    [{
                        text: "cats",
                        callback_data: 'cat'
                    }],
                ]
            }
        })
    }).action(['dog', 'cat'], ctx => {
        console.log(ctx.update.callback_query);
        ctx.reply(ctx.update.callback_query.data)
    })

    bot.launch()
    bot.telegram.getMe().then((info) => console.log("Start", info.username));
}

const arrayDiceEmoji = ["🎲", "🎯", "🎳", "🏀", "⚽", "🎰",]
const requestDiceKeyboard = {
    reply_markup: {
        inline_keyboard: [
            [
                {
                    text: arrayDiceEmoji[0],
                    callback_data: arrayDiceEmoji[0]
                },
                {
                    text: arrayDiceEmoji[1],
                    callback_data: arrayDiceEmoji[1]
                },
                {
                    text: arrayDiceEmoji[2],
                    callback_data: arrayDiceEmoji[2]
                }
            ],

            [
                {
                    text: arrayDiceEmoji[3],
                    callback_data: arrayDiceEmoji[3]
                },
                {
                    text: arrayDiceEmoji[4],
                    callback_data: arrayDiceEmoji[4]
                }
            ],

            [
                {
                    text: arrayDiceEmoji[5],
                    callback_data: arrayDiceEmoji[5]
                }
            ]
        ]
    }
};

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
};