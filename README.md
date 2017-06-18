# efit (内测版)

易上手的前端构建工具，基于 fis3，面向业务项目，支持simple、webpage、webapp三种模式。

## 安装方法

```bash
npm install -g efit
efit -v
```

## 使用方法

### 全部配置选项

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

### simple 模式配置

```
fis.simple(config);
```

### webpage 配置模式

```
fis.webpage(config);
```

### webapp 模式配置

```
fis.webapp(config);
```

## TODO

- [ ] 说明文档
- [ ] 配置示例
- [ ] 项目示例
- [ ] 使用教程
- [ ] 测试用例

