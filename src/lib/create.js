/*
 * @Author: daipeng
 * @Date: 2019-12-18 17:31:39
 * @LastEditors  : VSCode
 * @LastEditTime : 2019-12-18 17:47:16
 * @Description: create project
 */
const path = require('path');
const fs = require('fs-extra');
const ora = require('ora');
const chalk = require('chalk');
const ejs = require('ejs');
const downloadGitRepo  = require('download-git-repo');


const downGitRepoPromise = (url, to) => {
	return new Promise((resolve, reject) => {
		downloadGitRepo(`direct:${url}`, to, { clone: true }, function(err) {
			if (err) reject(err);
			else resolve();
		})
	})

};

const outputTemplate = async (options) => {
	try {
		const { name, dir } = options;
		await fs.copySync(path.resolve(__dirname, './template'), dir);
		const pkg = fs.readFileSync(path.resolve(__dirname, './template/package.json'));
		await fs.outputFile(path.resolve(dir, './package.json'), ejs.render(pkg.toString(), { name }));
	} catch (error) {
		Promise.reject(error);
	}
}

const create = (name, options) => {
	const spinner = ora(`create ${name}`).start();
	return new Promise((resolve, reject) => {
		try {
			let { dir, repository, force } = options;
			dir = dir ? path.join(process.cwd(), dir) : process.cwd();
			dir = path.resolve(dir, name);
			if (fs.pathExistsSync(dir) && force) fs.removeSync(dir);
			if (repository) downGitRepoPromise(repository, dir).then(resolve, reject);
			else outputTemplate({ ...options, name, dir }).then(resolve, reject);
		} catch (error) {
			reject(error);
		}
	}).then(() => {
		spinner.succeed('create successed!');
	}).catch(err => {
		spinner.stop();
		console.log(chalk.red(err));
	});
};

module.exports = create;
