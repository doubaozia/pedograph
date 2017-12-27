'use strict';

const chalk = require('chalk');

const DEFAULT_FORMAT = ':datetime :method :url :ip';
const SYS_FORMAT = ':datetime';

const utils = {
  wrap(text) {
    return `[${text}]`;
  },
  checkText(text) {
    return typeof text === 'object' ? JSON.stringify(text) : text;
  },
  fillZero(num) {
    return num < 10 ? `0${num}` : num;
  },
  formatDate(format) {
    const date = new Date();
    const Y = date.getFullYear();
    const M = utils.fillZero(date.getMonth() + 1);
    const D = utils.fillZero(date.getDate());
    const h = utils.fillZero(date.getHours());
    const m = utils.fillZero(date.getMinutes());
    const s = utils.fillZero(date.getSeconds());
  
    if (!format) {
      return `${Y}-${M}-${D} ${h}:${m}:${s}`;
    }
  
    return format
      .replace(/Y+/, Y)
      .replace(/M+/, M)
      .replace(/D+/, D)
      .replace(/h+/, h)
      .replace(/m+/, m)
      .replace(/s+/, s);
  }
};

const logger = {
  debug(text) {
    const log = parseFormat.call(this, DEFAULT_FORMAT)(`[DEBUG] ${utils.checkText(text)}`);
    console.log(chalk.green(log));
  },
  info(text) {
    const log = parseFormat.call(this, DEFAULT_FORMAT)(`[INFO]  ${utils.checkText(text)}`);
    console.log(chalk.blue(log));
  },
  warning(text) {
    const log = parseFormat.call(this, DEFAULT_FORMAT)(`[WARN]  ${utils.checkText(text)}`);
    console.log(chalk.yellow(log));
  },
  error(text) {
    const log = parseFormat.call(this, DEFAULT_FORMAT)(`[ERROR] ${utils.checkText(text)}`);
    console.log(chalk.red(log));
  }
};

exports.logger = {
  debug(text) {
    const log = parseFormat.call(this, SYS_FORMAT)(`[DEBUG] ${utils.checkText(text)}`);
    console.log(chalk.green(log));
  },
  info(text) {
    const log = parseFormat.call(this, SYS_FORMAT)(`[INFO]  ${utils.checkText(text)}`);
    console.log(chalk.blue(log));
  },
  warning(text) {
    const log = parseFormat.call(this, SYS_FORMAT)(`[WARN]  ${utils.checkText(text)}`);
    console.log(chalk.yellow(log));
  },
  error(text) {
    const log = parseFormat.call(this, SYS_FORMAT)(`[ERROR] ${utils.checkText(text)}`);
    console.log(chalk.red(log));
  }
}

exports.pedograph = function (format) {
  let fmt = format;

  if (!fmt) {
    fmt = `${DEFAULT_FORMAT} :response-time`;
  }

  return function*(next) {
    this.logger = {};
    this.logger.debug = logger.debug.bind(this);
    this.logger.info = logger.info.bind(this);
    this.logger.warning = logger.warning.bind(this);
    this.logger.error = logger.error.bind(this);

    const startTime = new Date().getTime();
    console.log('sss');
    this.logger.info('0ms');
    yield next;
    const endTime = new Date().getTime();
    this.logger.info(`${endTime - startTime}ms`);
  }
}

function parseFormat(format, responseTime) {
  const me = this;
  const formatArr = format.split(' ');
  const parsedStr = formatArr.map(val => getCaseLog.call(me, val, responseTime)).join(' ');
  return function (text) {
    const newText = text;
    if (typeof text === 'object') {
      newText = JSON.stringify(newText);
    }
    return `${parsedStr} ${newText}`;
  }
}

function getCaseLog(caseString, responseTime) {
  const me = this;
  let caseLog = '';

  switch(caseString) {
    case ':datetime':
      caseLog = utils.wrap(utils.formatDate());
      break;
    case ':url':
      caseLog = utils.wrap(me.url);
      break;
    case ':method':
      caseLog = utils.wrap(me.method);
      break;
    case ':ip':
      caseLog = utils.wrap(me.request.header['x-forwarded-for'] || 'localhost');
      break;
    case ':response-time':
      caseLog = utils.wrap(`${responseTime}ms`);
      break;
    case ':user-agent':
      caseLog = utils.wrap(me.request.header['user-agent']);
      break;
    default:
      caseLog = '';
  }
  return caseLog;
}
