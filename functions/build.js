/**
 * @file Application Initialization Build Wizard
 * @author Naman Vrati
 * @since 2.0.0
 * @version 2.0.0
 */

// Import required modules.

const fs = require('fs');
const fileExists = require('./fileExists');
const delay = require('./delay');

// Find config path.

let configPath = '';
fileExists('./config-example.json')
	? (configPath = './config-example.json')
	: (configPath = './config.json');

// Import console-related modules.

const readline = require('readline');
const chalk = require('chalk');

// Initialize LeeksLazyLogger

const Logger = require('leekslazylogger');
// @ts-ignore
const log = new Logger({ keepSilent: true });

// Create a readline interface.

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	terminal: false,
	prompt: ' > ',
});

require('../functions/banner')();
console.log(
	`${chalk.bgGreenBright.blackBright.bold(
		'**********************************************************************',
	)}\n`,
);

log.info('NamVr Chat Economy | Creation Wizard!');
log.info('Please answer all questions step by step to complete your config!\n');

// Read the required config file.

try {
	var jsonString = fs.readFileSync(configPath, {
		encoding: 'utf-8',
	});
} catch (error) {}

// Parse the required config file.

try {
	/**
	 * @type {import('../typings').ConfigurationFile}
	 */
	var config = JSON.parse(jsonString);
} catch (error) {
	log.error(error);
	process.exit(1);
}

// Create multiple questions to be asked.

const question1 = () => {
	return new Promise((resolve, reject) => {
		rl.question(
			`${chalk.bgWhite.black.bold('[Q]:')} ${chalk.redBright.bold(
				'What is your bot token: ',
			)}`,
			(answer) => {
				config.internal.token = answer;
				resolve();
			},
		);
	});
};

const question2 = () => {
	return new Promise((resolve, reject) => {
		rl.question(
			`${chalk.bgWhite.black.bold('[Q]:')} ${chalk.redBright.bold(
				'What is your discord user ID: ',
			)}`,
			(answer) => {
				config.internal.owner_id = answer;
				resolve();
			},
		);
	});
};

const question3 = () => {
	return new Promise((resolve, reject) => {
		rl.question(
			`${chalk.bgWhite.black.bold('[Q]:')} ${chalk.redBright.bold(
				'What is your client (bot) ID: ',
			)}`,
			(answer) => {
				config.internal.client_id = answer;
				resolve();
			},
		);
	});
};

const question4 = () => {
	return new Promise((resolve, reject) => {
		rl.question(
			`${chalk.bgWhite.black.bold('[Q]:')} ${chalk.redBright.bold(
				'What is your guild (server) ID: ',
			)}`,
			(answer) => {
				config.internal.guild_id = answer;
				resolve();
			},
		);
	});
};

// This will happen when .close() is called.

rl.on('close', async function () {
	// Write to the config file.

	fs.writeFile(configPath, JSON.stringify(config, null, 2), (err) => {
		// IF ERROR BOT WILL BE TERMINATED!

		if (err) {
			log.error('Error writing file:', err);
			return process.exit(1);
		}
	});

	// Shows output!

	console.log('\n');
	console.log(
		`${chalk.bgGreenBright.blackBright.bold(
			'**********************************************************************',
		)}\n`,
	);
	log.success('Configuration Created Successfully! Good Luck!\n');
	console.log(
		`${chalk.bgMagenta.black(
			`Run ${chalk.bold(
				'npm start',
			)} to start your bot, and setup your server settings using ${chalk.bold(
				'/settings',
			)} command, or edit ${chalk.bold('config.json')} directly!`,
		)}`,
	);
});

// Happens when exit signal is caught.

process.on('SIGINT', function () {
	console.log('\n');
	log.error('Configuration Wizard was interrupted. Come back anytime! :)');
	process.exit();
});

// Main file function.

const main = async () => {
	// Check config file and rename if needed.

	if (fileExists('./config-example.json')) {
		fs.rename('./config-example.json', './config.json', (err) => {
			if (err) throw err;
			log.success('[RENAMED] config-example.json >> config.json.');
		});
	} else {
		if (fileExists('./config.json')) {
			log.info('[CHECK] Configuration file already exists.');
		} else {
			log.warn('A REQUIRED FILE IS MISSING!');
			log.error(
				`ERROR: CAN'T FIND CONFIGURATION FILE (config-example.json) Please make sure it exists!`,
			);
		}
	}

	// Check database folder, rename if needed.

	if (fileExists('./database-example')) {
		fs.rename('./database-example', './database', (err) => {
			if (err) throw err;
			log.success('[RENAMED] /database-example >> /database.');
		});
	} else {
		if (fileExists('./database')) {
			log.info('[CHECK] Database directory already exists.');
		} else {
			log.warn('A REQUIRED FOLDER IS MISSING!');
			log.error(
				`ERROR: CAN'T FIND DATABASE DIRECTORY (/database-example) Please make sure it exists!`,
			);
		}
	}

	// Call out a delay to complete these operations / output.
	await delay(5000);

	// Call out all questions.
	await question1();
	await question2();
	await question3();
	await question4();

	// Close the connection and call rl.close().
	rl.close();
};

// Execute the main function.

main();
