#!/usr/bin/env node
/*
 * @Author: daipeng
 * @Date: 2019-12-18 15:56:53
 * @LastEditors  : VSCode
 * @LastEditTime : 2019-12-18 16:11:48
 * @Description:
 */
const program = require('commander');
const packageConfig = require('../../package.json');
const chalk = require('chalk');
const didYouMean = require('didyoumean');

const cmdName = Object.keys(packageConfig.bin)[0];

didYouMean.threshold = 0.6

function camelize (str) {
	return str.replace(/-(\w)/g, (_, c) => c ? c.toUpperCase() : '')
}

function cleanArgs (cmd) {
	const args = {}
	cmd.options.forEach(o => {
		const key = camelize(o.long.replace(/^--/, ''))
		if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
			args[key] = cmd[key]
		}
	})
	return args
}

function suggestCommands (unknownCommand) {
	const availableCommands = program.commands.map(cmd => {
	  	return cmd._name
	})

	const suggestion = didYouMean(unknownCommand, availableCommands)
	if (suggestion) {
	  	console.log(`  ` + chalk.red(`Did you mean ${chalk.yellow(suggestion)}?`))
	}
}

program
	.version(`create project cli ${packageConfig.version}`)
	.usage('<command> [options]')

// create command
program
	.command('create <project-name>')
	.description('create a new project')
	.option('-d, --dir <relative path>', 'path relative to current directory for the project， default .')
	.option('-r, --repository <url>', 'Use specified git repository')
	.option('-f, --force', 'Overwrite target directory if it exists')
	.allowUnknownOption()
	.action((name, cmd) => {
		const options = cleanArgs(cmd);
		require('../lib/create')(name, options);
	})

program.on('--help', () => {
  console.log()
  console.log(`  Run ${chalk.cyan(`${cmdName} <command> --help`)} for detailed usage of given command.`)
  console.log()
})

program
	.arguments('<command>')
	.action((cmd) => {
		program.outputHelp()
		console.log(`  ` + chalk.red(`Unknown command ${chalk.yellow(cmd)}.`))
		console.log()
		suggestCommands(cmd)
	})

program.commands.forEach(c => c.on('--help', () => console.log()))

program.parse(process.argv);

if (!process.argv.slice(2).length) {
	program.outputHelp()
}
