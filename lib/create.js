"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

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

const downloadGitRepo = require('download-git-repo');

const downGitRepoPromise = (url, to) => {
  return new Promise((resolve, reject) => {
    downloadGitRepo(`direct:${url}`, to, {
      clone: true
    }, function (err) {
      if (err) reject(err);else resolve();
    });
  });
};

const outputTemplate =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(function* (options) {
    try {
      const {
        name,
        dir
      } = options;
      yield fs.copySync(path.resolve(__dirname, './template'), dir);
      const pkg = fs.readFileSync(path.resolve(__dirname, './template/package.json'));
      yield fs.outputFile(path.resolve(dir, './package.json'), ejs.render(pkg.toString(), {
        name
      }));
    } catch (error) {
      Promise.reject(error);
    }
  });

  return function outputTemplate(_x) {
    return _ref.apply(this, arguments);
  };
}();

const create = (name, options) => {
  const spinner = ora(`create ${name}`).start();
  return new Promise((resolve, reject) => {
    try {
      let {
        dir,
        repository,
        force
      } = options;
      dir = dir ? path.join(process.cwd(), dir) : process.cwd();
      dir = path.resolve(dir, name);
      if (fs.pathExistsSync(dir) && force) fs.removeSync(dir);
      if (repository) downGitRepoPromise(repository, dir).then(resolve, reject);else outputTemplate(_objectSpread({}, options, {
        name,
        dir
      })).then(resolve, reject);
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