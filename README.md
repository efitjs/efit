# efit (内测版)

易上手的前端构建工具，基于 fis3，面向业务项目和业务组件，支持simple、webpage、webapp、component四种模式。

## 安装方法

```bash
npm install -g efit
efit -v
```

## 使用方法

使用方法和[fis3](http://fis.baidu.com/fis3/docs/api/config.html)一致，此外提供四种模式整套配置。

### 脚手架使用

使用规则：
```
efit init <github username>/<github project>@<version>
```

简写：
```
efit init component 等价于 efit install efitjs/component@latest
efit init react 等价于 efit install efitjs/react@latest
efit init vue 等价于 efit install efitjs/vue@latest
```

### 默认配置选项

```
var config = {
  project: {
    // 项目名称
    name: '',

    // 项目版本号,填了后自动替换源码中@VERSION@标识,不填则由ci-shell来替换,没有CI环境时必须设置
    version: '',

    // 静态资源部署目录
    statics: '/asset',

    // 业务入口, 入口的设置方式决定了打包的方式
    // entry(直接设置文件入口路径): '/app/m/index.js' => /asset/pkg/app.js /asset/pkg/app.css
    // entry(设置app/单业务入口标识)-推荐: ['m'] =>  /asset/pkg/lib.js /asset/pkg/lib.css /asset/pkg/app.js /asset/pkg/app.css
    // entry(设置app/多业务入口标识)-推荐: ['marketing', 'platform'] /asset/pkg/lib.js /asset/pkg/lib.css /asset/pkg/common.js /asset/pkg/common.css /asset/pkg/{entry}.js /asset/pkg/{entry}.css
    entry: [],

    // 项目调试的服务环境:(local|dev|sit|uat|prd),填了后自动替换源码中@ENV@标识,不填则不替换
    debugENV: '',

    // 是否在调试模式下(非media)合并后开启 SourceMap 功能,启用后watch状态要3s+生效,相对比较慢,但方便调试
    useSourceMap: false,

    // eslint配置文件 http://eslint.org/
    eslintrc: {},

    // stylelint配置文件 https://stylelint.io/
    stylelintrc: {}
  },
  environment: {
    // 开发环境
    development: {
      // 静态资源的域名
      domain: '',

      // 是否优化
      optimizer: true,

      // 是否打包
      packager: true
    },
    // 测试环境
    testing: {
      // 静态资源的域名
      domain: '',

      // 是否优化
      optimizer: true,

      // 是否打包
      packager: true
    },
    // 生产环境
    production: {
      // 静态资源的域名
      domain: '',

      // 是否优化
      optimizer: true,

      // 是否打包
      packager: true
    }
  }
};
```

### simple 配置模式

```
fis.simple(config);
```

### webpage 配置模式

```
fis.webpage(config);
```

### webapp 配置模式

```
fis.webapp(config);
```

### component 配置模式

```
var pkg = require('./package');
var eslintrc = require('./.eslintrc');
var stylelintrc = fis.util.readJSON('./.stylelintrc');

// 项目基础配置
fis.component({
    project: {
        // 项目名称
        name: pkg.name,
        // 项目版本号,填了后自动替换源码中@VERSION@标识,不填则由ci-shell来替换,没有CI环境时必须设置
        version: pkg.version,
        // eslint配置文件 http://eslint.org/
        eslintrc: eslintrc,
        // stylelint配置文件 https://stylelint.io/
        stylelintrc: stylelintrc
    }
});
```

### 配置示例

fis-conf.js
```
var pkg = require('./package');

// 项目基础配置
fis.webapp({
    project: {
        // 项目名称
        name: pkg.name,
        // 业务入口
        entry: ['m'],
        // eslint配置文件
        eslintrc: fis.util.readJSON('./.eslintrc'),
        // stylelint配置文件
        stylelintrc: fis.util.readJSON('./.stylelintrc')
    },
    environment: {
        // 开发环境
        development: {
            domain: ''
        },
        // 测试环境
        testing: {
            domain: ''
        },
        // 生产环境
        production: {
            domain: 'http://cdn.xxx.com/${project.name}'
        }
    }
});

// 项目拓展配置

```

## TODO

- [ ] 说明文档
- [ ] 配置示例
- [ ] 项目示例
- [ ] 使用教程
- [ ] 测试用例

