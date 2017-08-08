/**
 * webapp 配置模式
 */

var util = require('../util');
var plugin = {
  lint: {
    eslint: require('../plugin/lint-eslint'),
    stylelint: require('../plugin/lint-stylelint')
  }
};

module.exports = function (config) {
  
  console.log('component 配置模式');
  
  fis.config.merge(config);
  
  // 使用相对路径
  fis.hook('relative');
  
  fis.match('*', {
    relative: true
  });
  
  // style
  fis.match('*.{css,less,scss}', {
    rExt: 'css',
    //fis3-postprocessor-autoprefixer
    postprocessor: fis.plugin('autoprefixer'),
    lint: plugin.lint.stylelint
  });
  
  // 匹配所有less文件
  fis.match('*.less', {
    // fis3-parser-less-2.x
    parser: fis.plugin('less-2.x')
  });
  
  // less的mixin文件无需发布
  fis.match('*.mixin.less', {
    release: false
  });
  
  fis.match('_*.less', {
    release: false
  });
  
  // 匹配所有sass文件,sass平台兼容性太差,而且下载编译慢,废弃
  // fis.match('*.scss', {
  //     parser: fis.plugin('node-sass') //fis-parser-node-sass
  // });
  
  // script
  fis.match('*.{js,jsx,ts,tsx}', {
    rExt: '.js',
    preprocessor: [
      // fis3-preprocessor-js-require-css
      fis.plugin('js-require-css'),
      // fis3-preprocessor-js-require-file
      fis.plugin('js-require-file')
    ],
    
    parser: fis.plugin('babel-5.x', {
      stage: 0,
      blacklist: ['regenerator'],
      optional: ['es7.decorators', 'es7.classProperties']
    }),
    
    // TODO:测试中
    // parser: fis.plugin('babel-6.x', {
    //   // 注意一旦这里在这里添加了 presets 配置，则会覆盖默认加载的 preset-2015 等插件，因此需要自行添加所有需要使用的 presets
    //   "presets": ["es2015", "react", "stage-0"]
    // })
    
    // 增加lint脚本
    lint: plugin.lint.eslint
  });
  
};
