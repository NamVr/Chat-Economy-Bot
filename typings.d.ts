import * as Discord from 'discord.js';
import * as Builders from '@discordjs/builders';

/**
 * Represents a chat-based Message Command.
 */
export interface LegacyCommand {
	/**
	 * The name of the command.
	 */
	name: string;

	/**
	 * Aliases or similar names for the command.
	 */
	aliases?: string[];

	/**
	 * The description of the command.
	 */
	description?: string;

	/**
	 * The usage of the command.
	 */
	usage?: string;

	/**
	 * The permissions required by a discord user to run this command.
	 */
	permissions?: Discord.PermissionResolvable;

	/**
	 * Whether this command is only a guild-based command.
	 */
	guildOnly?: boolean;

	/**
	 * Whether this command requires arguments.
	 */
	args?: boolean;

	/**
	 * The cooldown in seconds of this command.
	 */
	cooldown?: number;

	/**
	 * Whether this command is only a bot owner-based command.
	 */
	ownerOnly?: boolean;

	/**
	 * The command executor when it is called by the template handler.
	 * @param message The message that triggered this command.
	 * @param args The message arguments of the command (seperated by spaces (' ') in an array, this excludes prefix and command/alias itself).
	 */
	execute(
		message: Discord.Message & { client: Client },
		args: string[],
	): void | Promise<void>;
}

/**
 * Represents an Application Command (Slash Command).
 */
export interface SlashInteractionCommand {
	/**
	 * The data of Application Command Interaction (Slash Command).
	 */
	data: Builders.SlashCommandBuilder;
	options: Array<
		| Builders.SlashCommandStringOption
		| Builders.SlashCommandNumberOption
		| Builders.SlashCommandRoleOption
		| Builders.SlashCommandUserOption
		| Builders.SlashCommandBooleanOption
		| Builders.SlashCommandChannelOption
		| Builders.SlashCommandIntegerOption
	>;

	/**
	 * Represents whether this command is an owner only command.
	 */
	ownerOnly: boolean;

	/**
	 * The interaction executor when it is called by the template handler.
	 * @param interaction The interaction that triggered this command.
	 */
	execute(
		interaction: Discord.CommandInteraction & { client: Client },
	): void | Promise<void>;
}

/**
 * Represents a Button Interaction.
 */
export interface ButtonInteractionCommand {
	/**
	 * The custom ID of the button which was interacted with.
	 */
	id: string;

	/**
	 * The interaction executor when it is called by the template handler.
	 * @param interaction The interaction that triggered this command.
	 */
	execute(
		interaction: Discord.ButtonInteraction & { client: Client },
	): void | Promise<void>;
}

/**
 * Represents a Select Interaction.
 */
export interface SelectInteractionCommand {
	/**
	 * The custom ID of the select (menu option) which was interacted with.
	 */
	id: string;

	/**
	 * The interaction executor when it is called by the template handler.
	 * @param interaction The interaction that triggered this command.
	 */
	execute(
		interaction: Discord.SelectMenuInteraction & { client: Client },
	): void | Promise<void>;
}

/**
 * The data of Context Menu Interaction Command.
 */
export interface ContextInteractionCommandData {
	/**
	 * The name of the context (menu option) which was interacted with.
	 */
	name: string;

	/**
	 * The type of the context (menu option) which was interacted with.
	 * 2: User Based Context Menu Option.
	 * 3: Message Based Context Menu Option.
	 */
	type: 2 | 3;
}

/**
 * Represents a Context Interaction.
 */
export interface ContextInteractionCommand {
	/**
	 * The data of Context Menu Interaction Command.
	 */
	data: ContextInteractionCommandData;

	/**
	 * The interaction executor when it is called by the template handler.
	 * @param interaction The interaction that triggered this command.
	 */
	execute(
		interaction: Discord.ContextMenuInteraction & { client: Client },
	): void | Promise<void>;
}

/**
 * Represents a ModalSubmit Interaction.
 */
export interface ModalInteractionCommand {
	/**
	 * The custom ID of the modal (submit) which was interacted with.
	 */
	id: string;

	/**
	 * The interaction executor when it is called by the template handler.
	 * @param interaction The interaction that triggered this command.
	 */
	execute(
		interaction: Discord.ModalSubmitInteraction & { client: Client },
	): void | Promise<void>;
}

/**
 * Represents a chat-based Trigger Command.
 */
export interface TriggerCommand {
	/**
	 * The names / aliases of the trigger command.
	 */
	name: string[];
	/**
	 * The command executor when it is called by the template handler.
	 * @param message The message that triggered this command.
	 * @param args The message arguments of the command (seperated by spaces (' ') in an array).
	 */
	execute(
		message: Discord.Message & { client: Client },
		args: string[],
	): void | Promise<void>;
}

/**
 * Modified in-built Client that includes support for command/event handlers.
 */
export interface Client extends Discord.Client {
	/**
	 * Represents a collection of chat-based Message Commands.
	 */
	commands: Discord.Collection<string, LegacyCommand>;

	/**
	 * Represents a collection of Application Commands (Slash Commands).
	 */
	slashCommands: Discord.Collection<string, SlashInteractionCommand>;

	/**
	 * Represents a collection of Button Interactions.
	 */
	buttonCommands: Discord.Collection<string, ButtonInteractionCommand>;

	/**
	 * Represents a collection of Select Interactions.
	 */
	selectCommands: Discord.Collection<string, SelectInteractionCommand>;

	/**
	 * Represents a collection of Context Interactions.
	 */
	contextCommands: Discord.Collection<string, ContextInteractionCommand>;

	/**
	 * Represents a collection of ModalSubmit Interactions.
	 */
	modalCommands: Discord.Collection<string, ModalInteractionCommand>;

	/**
	 * Represents cooldown collection for Legacy Commands.
	 */
	cooldowns: Discord.Collection<string, Discord.Collection<string, number>>;

	/**
	 * Represents a collection of chat-based Trigger Commands.
	 */
	triggers: Discord.Collection<string, TriggerCommand>;

	/**
	 * Represents a collection of autocomplete interactions.
	 */
	autocompleteInteractions: Discord.Collection<
		string,
		AutocompleteInteraction
	>;

	/**
	 * Represents Economy Cache Handling.
	 */
	economy: {
		/**
		 * Represents Cache Heat.
		 */
		heat: number;
	};
}

// Custom Typings for NamVr Chat Economy!

/**
 * Represents a Autocomplete Interaction.
 */
export interface AutocompleteInteraction {
	/**
	 * The command name of the autocomplete interaction which was interacted with.
	 */
	name: string;

	/**
	 * The interaction executor when it is called by the template handler.
	 * @param interaction The interaction that triggered this command.
	 */
	execute(
		interaction: Discord.AutocompleteInteraction & { client: Client },
	): void | Promise<void>;
}

/**
 * Represents an Item of Shop Database.
 */
export interface ShopItem {
	/**
	 * Name of the item
	 */
	name: string;

	/**
	 * Price/Cost of the item (10-100000)
	 */
	price: number;

	/**
	 * Description of the item
	 */
	description: string;
}

/**
 * Represents a User of User Database.
 */
export interface UserItem {
	/**
	 * User ID of the User.
	 */
	user_id: Discord.Snowflake;

	/**
	 * Balance of the User.
	 */
	balance: number;

	/**
	 * Number of times the user has won a chat event.
	 */
	won_times: number;

	/**
	 * Timestamp of the last daily "command" claim.
	 */
	last_daily: number;

	/**
	 * Storage of Quantity of Items (item_name: number)
	 */
	items: Object;
}

/**
 * Represents User Database (Users Array).
 */
export interface UserDatabase extends Array<UserItem> {}

/**
 * Represents Shop Database (Items Array).
 */
export interface ShopDatabase extends Array<ShopItem> {}

/**
 * Represents Configuration File (config.json).
 */
export interface ConfigurationFile {
	/**
	 * Represents internal configuration of the application.
	 */

	internal: {
		/**
		 * Token of the application.
		 */

		token: string;

		/**
		 * Owner ID of the application.
		 */
		owner_id: Discord.Snowflake;

		/**
		 * Client ID of the application.
		 */
		client_id: Discord.Snowflake;

		/**
		 * Guild ID of the application.
		 */
		guild_id: Discord.Snowflake;
	};

	/**
	 * Represents Economy/Bot based configuration of the application.
	 */
	settings: {
		/**
		 * Prefix of the application.
		 */
		prefix: string;

		/**
		 * Amount of maximum heat (trigger).
		 */
		heat_max: number;

		/**
		 * Amount of heat per message (to be added).
		 */
		heat_per_msg: number;

		/**
		 * Cooldown of Legacy Commands (in ms).
		 */
		cooldown: number;

		/**
		 * Chat Channel ID (Heat Channel).
		 */
		chat_channel: Discord.Snowflake;

		/**
		 * Bot Channel ID (Ecoshop Channel).
		 */
		bot_channel: Discord.Snowflake;

		/**
		 * Maximum currency awarded to event winner.
		 */
		win_max: number;

		/**
		 * Minimum currency awarded to event winner.
		 */
		win_min: number;

		/**
		 * Represents bot's currency settings.
		 */
		currency: {
			/**
			 * Name of your server's currency.
			 */
			name: string;

			/**
			 * Emoji (symbol) of your server's currency.
			 */
			emoji: Discord.EmojiResolvable;
		};
	};

	/**
	 * Represents specific command settings for the application.
	 */
	commands: {
		/**
		 * Represents Daily Command Settings.
		 */
		daily: {
			/**
			 * Amount to be credited daily.
			 */
			amount: number;
		};
	};

	/**
	 * Represents API Link/Keys for the application.
	 */
	apis: {
		/**
		 * API Link for Wordnik (Unscramble The Word)
		 */
		wordnik: string;
	};

	/**
	 * Represents Modules toggles (enabled or disabled).
	 */
	modules: {
		/**
		 * Whether Math Equation Module is enabled or not.
		 */
		math_equation: boolean;

		/**
		 * Whether Speed Clicker Module is enabled or not.
		 */
		speed_clicker: boolean;

		/**
		 * Whether Speed Typer Module is enabled or not.
		 */
		speed_typer: boolean;

		/**
		 * Whether Unscramble The Word Module is enabled or not.
		 */
		unscramble_the_word: boolean;
	};
}

/**
 * Represents a Wordnik Response Object.
 */
export interface WordnikResponseObject {
	/**
	 * The ID (Index).
	 */
	id: number;

	/**
	 * The Random Word.
	 */
	word: string;
}

/**
 * Represents a Wordnik Response Data.
 */
export interface WordnikResponse extends Array<WordnikResponseObject> {}

/**
 * Represents a Chat-Event (Trigger).
 */
export interface ChatTriggerEvent {
	/**
	 * The event name of the chat-trigger which was interacted with.
	 */
	name: string;

	/**
	 * The config name of the chat-trigger which was interacted with.
	 * Generally `variable_case` version of `name` property.
	 */
	alias: string;

	/**
	 * The event executor when it is called by the template handler.
	 * @param message The message that triggered this command.
	 */
	execute(
		message: Discord.Message & { client: Client },
	): void | Promise<void>;
}
