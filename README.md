# pedograph

koa 1.x 日志模块，提供中间件和格式化日志输出功能。暂不支持koa 2.x版本

[![npm](https://img.shields.io/badge/npm-v0.1.4-blue.svg)](https://www.npmjs.com/package/pedograph)

## 1. 用法

### 在项目中安装pedograph
```shell
$ npm install pedograph --save
```
### 中间件中引入
```javascript
const pedo = require('pedograph');

app.use(pedo.pedograph(format));

// 在上下文中引用
this.logger.debug('some infomation!');
```
启动你的nodejs服务器，查看日志输出
```shell
[2017-12-27 12:03:14] [GET] [/] [localhost] [INFO]  0ms
[2017-12-27 12:03:15] [GET] [/] [localhost] [DEBUG] some infomation!
[2017-12-27 12:03:15] [GET] [/] [localhost] [INFO]  514ms
```
### 应用中引入
```javascript
const logger = require('pedograph').logger;

logger.debug('some infomation!');
```
启动你的nodejs服务器，查看日志输出
```shell
[2017-12-27 12:10:00] [DEBUG] some infomation!
```

## 2. 配置

pedograph中间件接收一个格式参数format，由可配置项以空格分割，其中可配置项如下所示：

format默认为：':datetime :method :url :ip :response-time'
依次为：时间 方法 路由 请求IP 响应时间
日志级别自动显示

可选项如下：
### :datetime
日期选项，格式为YYYY-MM-DD hh:mm:ss
### :method
请求方法，格式为请求方法的大写，如：GET POST PUT
### :url
请求的路由，如：/home/page
### :response-time
相应时间，单位毫秒ms，请求到达时为0
### :user-agent
客户端（浏览器）的UA

