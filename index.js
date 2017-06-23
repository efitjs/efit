var fis = module.exports = require('fis3');
var pkg = require('./package');
var webapp = require('./lib/config/webapp');
var webpage = require('./lib/config/webpage');
var simple = require('./lib/config/simple');
var component = require('./lib/config/component');

fis.require.prefixes.unshift(pkg.name);
fis.cli.name = pkg.name;
fis.cli.info = pkg;
fis.cli.version = require('./lib/version');

// 全局配置 http://fis.baidu.com/fis3/docs/api/config-props.html
fis.config.merge({
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
    stylelintrc: {},
    
    charset: 'utf8',
    // 文件MD5戳长度
    md5Length: 6,
    
    md5Connector: '.',
    
    // 设置项目源码文件过滤器
    files: ['**'],
    
    // 排除某些文件
    ignore: ['node_modules/**', 'output/**', '.git/**', 'fis-conf.js']
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
});

// simple 配置模式
fis.simple = simple;

// webpage 配置模式
fis.webpage = webpage;

// webapp 配置模式
fis.webapp = webapp;

// component 配置模式
fis.component = component;

// register command plugins
// [].forEach(function(name){
//   fis.require._cache['command-' + name] = require('./plugin/command/' + name);
// });
