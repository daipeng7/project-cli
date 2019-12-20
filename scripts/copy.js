/*
 * @Author: daipeng
 * @Date: 2019-12-19 09:05:00
 * @LastEditors  : VSCode
 * @LastEditTime : 2019-12-19 09:18:21
 * @Description:
 */
const fs = require('fs-extra');
const path = require('path');
const resolve = dir => path.resolve(__dirname, '../', dir);

const TEMPLATE_PATH = resolve('./src/lib/template');
const copy = function() {
	fs.copySync(TEMPLATE_PATH, resolve('./lib/template'));
};

copy();
