/**
 * @file Halloween Game Event
 * @author Maghish
 * @since 3.1.0
 * @version 3.1.0
 */

const Discord = require('discord.js');

/**
 * @type {import('../typings').ChatTriggerEvent}
 */
module.exports = {
	name: 'Halloween Game',
	alias: 'halloween_game',

	async execute(message) {
		const noOfTokens = Math.floor(Math.random() * 5) + 1;

		// Insert the event token emoji here
		const EVENT_TOKEN_EMOJI = '';

		const baseEmbedDescription = `Press the button below to claim ${noOfTokens}x ${EVENT_TOKEN_EMOJI}!`;

		const embed = new Discord.EmbedBuilder()
			.setTitle('Happy Halloween!')
			.setDescription(baseEmbedDescription)
			.setFooter({
				text: 'Winner will be randomly picked from the button pressed players',
			});

		const row = new Discord.ActionRowBuilder().addComponents(
			new Discord.ButtonBuilder()
				.setCustomId('event-halloween-clicker')
				.setLabel('Claim')
				.setStyle(Discord.ButtonStyle.Secondary),
		);

		let msg;
		if (!message.channel.isSendable()) return;

		msg = await message.channel.send({
			embeds: [embed],
			// @ts-ignore
			components: [row],
		});

		const collector = msg.createMessageComponentCollector({
			componentType: Discord.ComponentType.Button,
			time: 15000,
		});

		/** @type {String[]} */
		const pressed = [];

		// @ts-ignore
		collector.on('collect', async (i) => {
			// only handle the claim button
			if (i.customId !== 'event-halloween-clicker') return;

			try {
				if (pressed.includes(i.user.id)) {
					await i.deferUpdate();
				} else {
					pressed.push(i.user.id);

					embed.setDescription(
						baseEmbedDescription +
							`\n> **${pressed
								.map((f) => `<@${f}>`)
								.join(', ')} are trying to claim...**`,
					);

					await msg.edit({
						embeds: [embed],
						// @ts-ignore
						components: [row],
					});
					await i.deferUpdate();
				}
			} catch (err) {
				// Interaction may have already been acknowledged or expired — log and ignore
				console.error(
					'Failed to reply to interaction in halloween-game:',
					err,
				);
			}
		});

		// @ts-ignore
		collector.on('end', async () => {
			// disable the button so clicking after timeout doesn't produce an error
			try {
				const disabledRow =
					new Discord.ActionRowBuilder().addComponents(
						new Discord.ButtonBuilder()
							.setLabel('Claim')
							.setDisabled(true)
							.setCustomId('event-halloween-clicker')
							.setStyle(Discord.ButtonStyle.Secondary),
					);

				if (pressed.length === 0) {
					embed.setDescription(
						baseEmbedDescription +
							'\n> **No one claimed on time!**',
					);

					await msg.edit({
						embeds: [embed],
						// @ts-ignore
						components: [disabledRow],
					});
				} else {
					const winner =
						pressed[Math.floor(Math.random() * pressed.length)];

					if (pressed.length === 1) {
						embed.setDescription(
							baseEmbedDescription +
								`\n> **<@${winner}> claimed ${noOfTokens}x ${EVENT_TOKEN_EMOJI}**`,
						);
					} else {
						const nonWinners =
							pressed.length === 2
								? `<@${pressed.filter((f) => f !== winner)[0]}>`
								: pressed
										.map((f) => {
											if (f === winner) return;
											return `<@${f}>`;
										})
										.join(', ');

						embed.setDescription(
							baseEmbedDescription +
								`\n> **<@${winner}> fought off against ${nonWinners} and claimed ${noOfTokens}x ${EVENT_TOKEN_EMOJI}**`,
						);
					}

					await msg.edit({
						embeds: [embed],
						// @ts-ignore
						components: [disabledRow],
					});
				}
			} catch (err) {
				// log edit errors but don't crash
				console.error(
					'Failed to edit halloween-game message on collector end:',
					err,
				);
			}
		});
	},
};
