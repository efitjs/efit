/**
 * webpage 配置模式
 */

var util = require('../util');
var plugin = {
  lint: {
    eslint: require('../plugin/lint-eslint'),
    stylelint: require('../plugin/lint-stylelint')
  }
};

module.exports = function (config) {
  
  console.log('webpage 配置模式');
  
  fis.config.merge(config);
  
  // 项目基础配置
  var statics = fis.get('project.statics');
  
  // ## 一、编译阶段(compile)
  
  // html
  fis.match('*.md', {
    release: false
  });
  
  // image
  fis.match('::image', {
    useHash: true,
    release: '${project.statics}/$&'
  });
  
  // 站点图标文件
  fis.match('/favicon.{ico,png}', {
    useHash: false,
    release: '/$0'
  }, true);
  
  // style
  fis.match('*.{css,less,scss}', {
    rExt: 'css',
    useHash: true,
    useSprite: true,
    postprocessor: fis.plugin('autoprefixer'), //fis3-postprocessor-autoprefixer
    release: '${project.statics}/$&',
    lint: plugin.lint.stylelint
  });
  
  // 匹配所有less文件
  fis.match('*.less', {
    parser: fis.plugin('less-2.x')
  });
  
  // less的mixin文件无需发布
  fis.match('*.mixin.less', {
    release: false
  }, true);
  
  fis.match('_*.less', {
    release: false
  }, true);
  
  // 匹配所有sass文件,sass平台兼容性太差,而且下载编译慢,废弃
  // fis.match('*.scss', {
  //     parser: fis.plugin('node-sass') //fis-parser-node-sass
  // });
  
  // script
  fis.match('*.js', {
    useHash: true,
    release: '${project.statics}/$&'
  });
  
  // es\ts
  fis.match('*.{jsx,es,ts,tsx}', {
    rExt: '.js',
    useHash: true,
    // fis3-parser-typescript
    parser: fis.plugin('typescript'),
    release: '${project.statics}/$&',
    lint: plugin.lint.eslint
  });
  
  fis.match('/asset/(**)', {
    release: '${project.statics}/$1'
  });
  
  // ## 二、打包阶段(package)
  
  fis.match('::package', {
    
    // 图片精灵的方案被iconfont代替,暂时不需要
    spriter: fis.plugin('csssprites', {
      layout: 'matrix',
      // scale: 0.5, // 移动端二倍图用
      margin: '10'
    }),
    
    // fis3-postpackager-loader-sync
    postpackager: fis.plugin('loader-sync', {
      // 配置是否合并零碎资源,此模式下不要使用此功能
      allInOne: {
        js: function (file) {
          return statics + '/pkg/' + getFileFullName(file) + '.js';
        },
        css: function (file) {
          return statics + '/pkg/' + getFileFullName(file) + '.css';
        },
        // 如果不希望部分文件被 all in one 打包，请设置 ignore 清单。
        ignore: []
      }
    })
  });
  
  // ## 三、部署阶段
  fis.match('*', {
    deploy: util.getDeployTask()
  });
  
  // 测试环境 | 生产环境 优化配置
  var environment = fis.get('environment');
  
  var statics = fis.get('project.statics');
  
  Object.keys(environment)
    .forEach(function (env) {
      var o = environment[env];
      
      var domain = o.domain;
      
      var isOptimizer = o.optimizer !== false;
      
      fis.media(env)
      // 部署配置
        .match('*', {
          deploy: util.getDeployTask(env)
        })
        // html结构不规范时候会报错,慎用
        .match('/*.html', {
          // fis-optimizer-html-minifier
          optimizer: isOptimizer ? fis.plugin('html-minifier') : null
        })
        .match('*.{js,jsx,es,ts,tsx}', {
          domain: domain,
          useHash: true,
          optimizer: isOptimizer ? fis.plugin('uglify-js') : null
        })
        .match('*.{css,less,scss}', {
          domain: domain,
          useHash: true,
          useSprite: true,
          optimizer: isOptimizer ? fis.plugin('clean-css') : null
        })
        .match('::image', {
          domain: domain
        });
    });
};

// 获取文件名称
function getFileFullName(file) {
  if (file.id) {
    return file.id.replace('.html', '').replace(/\//g, '-');
  } else {
    return file.filename;
  }
}
