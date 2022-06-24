const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const delay = require("../../../functions/delay");
const random = require("../../../functions/get/random-number");

const manager = require("../../../functions/database");

/**
 * @file Slots Command
 * @author StormPacer
 * @version 1.0.0
 */

module.exports = {
    data: new SlashCommandBuilder()
        .setName("slots")
        .setDescription("Play a game of slots for currency!")
        .addNumberOption((option) =>
            option
                .setName("amount")
                .setDescription("The amount you want to bet.")
                .setRequired(true)
        ),
    async execute(interaction) {

        // Get the currency from the database.
        const currency = manager.getConfigFile().settings.currency

        // Get a random number in the range of 0-3 of the previous number.
        function getNumber(number) {
            let num
            if (number > 3) {
                num = num1 + randomRangeL[arrayRandom];
            }
            else if (number <= 3) {
                num = num1 + randomRangeH[arrayRandom];
            }
            return num;
        }

        // Our constants for the random number in the getNumber function.
        const arrayRandom = Math.floor(Math.random() * 4);
        const randomRangeL = [-3, -2, -1, 0];
        const randomRangeH = [0, 1, 2, 3];

        // Get the amount of currency the user wants to bet and the user.
        const amount = interaction.options.getNumber("amount");
        const gambler = interaction.user;

        const userDB = manager.getUserDB();

        // Check if the user exists in the database.
        let user = userDB.find((f) => f.user_id == gambler.id);

        // If the user is new (doesn't exist yet) then create a new user.
        if (!user) {
            // @ts-ignore Non-existent object, created for the sake of properties!
            user = {
                user_id: gambler.id,
                balance: 0,
                won_times: 0,
                items: {},
            };
        }

        // Check if the user has enough currency to bet.
        if (amount > user.balance) {
            interaction.reply({ content: "You don't have enough currency!" });
            return;
        }

        // Get the random numbers for the slots.
        interaction.reply({ content: "Starting to spin..." });
        await delay(2000)

        let currentState = "";
        const num1 = random(1, 7);
        const num2 = getNumber(num1);
        const num3 = random(1, 7);

        const numbers = [num1, num2, num3];

        // Loop through all the numbers and change the message state accordingly.
        for (let i = 0; i < 3; i++) {
            await delay(1500);
            if (numbers[i] == 1) {
                currentState += " 🍒"
                interaction.editReply({ content: currentState });
            }
            else if (numbers[i] == 2) {
                currentState += " 🍌"
                interaction.editReply({ content: currentState });
            }
            else if (numbers[i] == 3) {
                currentState += " 🍇"
                interaction.editReply({ content: currentState });
            }
            else if (numbers[i] == 4) {
                currentState += " 🍊"
                interaction.editReply({ content: currentState });
            }
            else if (numbers[i] == 5) {
                currentState += " 🍓"
                interaction.editReply({ content: currentState });
            }
            else if (numbers[i] == 6) {
                currentState += " 🍋"
                interaction.editReply({ content: currentState });
            }
            else if (numbers[i] == 7) {
                currentState += " 💸"
                interaction.editReply({ content: currentState });
            }
        }

        // Check if the user won or lost.

        let embed = new MessageEmbed()

        if (num1 == num2 == num3) {
            embed.setTitle("You won!")
            embed.setColor("GREEN")
            if (num1 == 7) {
                embed.setDescription(`**You got the jackpot! You won \`${amount * 10}\` ${currency.name} ${currency.emoji}!**\nYour slots rolled: \`${currentState}\``);
                embed.setFooter({ text: `You now have ${user.balance += amount * 10} ${currency.name}` });

                interaction.editReply({ embeds: [embed] });

                userDB.indexOf(user) != -1
                    ? (userDB[userDB.indexOf(user)] = user)
                    : userDB.push(user);
                manager.putUserDB(userDB);
            }

            else if (num1 != 7) {
                embed.setDescription(`**You won \`${amount * 5}\` ${currency.name} ${currency.emoji}!**\nYour slots rolled: \`${currentState}\``);
                embed.setFooter({ text: `You now have ${user.balance += amount * 5} ${currency.name}` });

                interaction.editReply({ embeds: [embed] });

                userDB.indexOf(user) != -1
                    ? (userDB[userDB.indexOf(user)] = user)
                    : userDB.push(user);
                manager.putUserDB(userDB);
            }
        }

        if (num1 == num2 || num2 == num3 || num1 == num3) {
            embed.setTitle("You won!")
            embed.setColor("GREEN")
            embed.setDescription(`**You won \`${amount * 2}\` ${currency.name} ${currency.emoji}!**\nYour slots rolled: \`${currentState}\``);
            embed.setFooter({ text: `You now have ${user.balance += amount * 2} ${currency.name}` });

            interaction.editReply({ embeds: [embed] });

            userDB.indexOf(user) != -1
                ? (userDB[userDB.indexOf(user)] = user)
                : userDB.push(user);
            manager.putUserDB(userDB);
        }

        else {
            embed.setTitle("You lost!")
            embed.setColor("RED")
            embed.setDescription(`**You lost \`${amount}\` ${currency.name} ${currency.emoji}!**\nYour slots rolled: \`${currentState}\``);
            embed.setFooter({ text: `You now have ${user.balance -= amount} ${currency.name}` });

            interaction.editReply({ embeds: [embed] });

            userDB.indexOf(user) != -1
                ? (userDB[userDB.indexOf(user)] = user)
                : userDB.push(user);

            manager.putUserDB(userDB);
        }
    }
}