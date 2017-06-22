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
  
  console.log('webapp 配置模式');
  
  fis.config.merge(config);
  
  // 项目基础配置
  var statics = fis.get('project.statics');
  
  // 模块化方案配置
  // 禁用fis3默认的components
  fis.unhook('components');
  
  // fis3-hook-commonjs 启用commonjs, 使用mod.js作为模块化框架
  fis.hook('commonjs', {
    extList: ['.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.ts', '.tsx', '.js', '.jsx', '.json']
  });
  
  // fis3-hook-node_modules 启用node_modules
  fis.hook('node_modules');
  
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
    //fis3-postprocessor-autoprefixer
    postprocessor: fis.plugin('autoprefixer')
  });
  
  // 匹配所有less文件
  fis.match('*.less', {
    // fis3-parser-less-2.x
    parser: fis.plugin('less-2.x')
  });
  
  // 移动端的适配 https://www.npmjs.com/package/fis3-parser-rem
  // fis.match('*.less', {
  //     parser: [
  //         fis.plugin('less-2.x'),
  //         fis.plugin('rem', {
  //             rem: 32,
  //             min: 12,
  //             exclude: ['font-size']
  //         })
  //     ]
  // });
  
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
    useHash: true,
    preprocessor: [
      // fis3-preprocessor-js-require-css
      fis.plugin('js-require-css'),
      // fis3-preprocessor-js-require-file
      fis.plugin('js-require-file')
    ]
  });
  
  // 匹配所有typeScript文件
  fis.match('*.{ts,tsx}', {
    // fis3-parser-typescript
    parser: fis.plugin('typescript', {
      //sourceMap: true
    })
  });
  
  // 匹配所有javaScript文件
  fis.match('*.{js,jsx}', {
    //useSameNameRequire: true,
    // 解析es6, jsx  babel-5.x babelx-5.x babel-core
    // parser: fis.plugin('typescript'),
    //fis-parser-babel-5.x
    parser: fis.plugin('babel-5.x', {
      stage: 0,
      blacklist: ['regenerator'],
      optional: ['es7.decorators', 'es7.classProperties'],
      // TODO:
      // sourceMaps: true
    }),
    
    // babel 6
    //parser: fis.plugin('babeljs', {
    //    "presets": ["es2015", "react", "stage-0"]
    //}),
    
    //parser: fis.plugin('typescript', {
    //module: 1,
    //target: 2,
    //sourceMap: true
    //
    //}),
  });
  
  // 模块化静态资源配置
  
  // 生态模块配置
  // package.main || index.js
  // var antd = require('antd')
  // => node_modules/antd/{package.main}.js | node_modules/antd/index.js
  fis.match('/node_modules/(**).js', {
    // id支持简写,去掉modules和.js后缀中间的部分
    id: '$1',
    isMod: true,
    useSameNameRequire: true,
    // 生态的js不做编译
    parser: null,
    // 生态的js不做文件处理
    preprocessor: null
  });
  
  // 生态模块中的资源发布到lib目录
  fis.match('/node_modules/(**)', {
    release: '${project.statics}/lib/$1'
  });
  
  // 应用库配置
  // subpath.js || subpath/index.js || subpath/subpath.js
  // require('../home') => ../home/index.js | ../home/home.js
  // require('/modules/abc'); 全路径
  fis.match('/{app,module}/(**).{js,jsx,ts,tsx}', {
    // id支持简写,去掉modules和.js后缀中间的部分
    id: '$1',
    // 标记文件为组件化文件。被标记成组件化的文件会入map.json表。并且会对js文件进行组件化包装。
    isMod: true,
    // skipBrowserify 默认模块化的 js 都会进行 browserify 处理，如果文件的这个属性设置成了 true, 则会跳过
    skipBrowserify: true,
    // 增加lint脚本
    lint: plugin.lint.eslint
  });
  
  fis.match('/{app,module}/(**).{css,less,scss}', {
    lint: plugin.lint.stylelint
  });
  
  // 应用库配置
  fis.match('/{app,module}/**', {
    release: '${project.statics}/$&'
  });
  
  // 非模块化静态资源配置
  fis.match('/lib/**.js', {
    isMod: false,
    parser: null,
    preprocessor: null
  });
  
  // 非模块化资源发布配置
  fis.match('/({lib,data}/**)', {
    release: '${project.statics}/$1'
  });
  
  // 动态资源配置
  fis.match('/server/(**)', {
    isMod: false,
    useHash: false,
    useCompile: false,
    release: false, // '/server/$1'
  }, true);
  
  // 不发布的文件
  fis.match('{package.json,yarn.lock}', {
    release: false
  });
  
  // ## 二、打包阶段(package)
  
  fis.match('::package', {
    // fis3-packager-deps-pack
    // packager: fis.plugin('deps-pack'),
    // https://github.com/fex-team/fis3-packager-map
    // packager: fis.plugin('map'),
    packager: getDepsPackager(fis.get('project.useSourceMap')),
    
    // 图片精灵的方案被iconfont代替,暂时不需要
    // spriter: fis.plugin('csssprites', {
    //     layout: 'matrix',
    //     // scale: 0.5, // 移动端二倍图用
    //     margin: '10'
    // }),
    
    // fis3-postpackager-loader-sync
    postpackager: fis.plugin('loader-sync', {
      // 打包类型为mod.js
      resourceType: 'mod',
      // 用来控制 resourcemap, 如果需要异步加载js资源,则生成resourcemap;如果有打包配置,推荐不要生成resourcemap,减少资源大小
      resoucemap: false,
      // 是否将 resoucemap 作为内嵌脚本输出
      useInlineMap: false,
      //resoucemap: statics + '/pkg/${filepath}-map.js',
      // 配置是否合并零碎资源,此模式下不要使用此功能,不用收集，零碎资源比较少，要加也是特殊需求不需要合并的时候才会加，例如ueditor这类零碎资源收集后会报错
      allInOne: false
    })
  });
  
  // ## 三、部署阶段
  fis.match('*', {
    deploy: util.getDeployTask()
  });
  
  // 测试环境 | 生产环境 优化配置
  var environment = fis.get('environment');
  Object.keys(environment)
    .forEach(function (env) {
      var o = environment[env];
      
      var domain = o.domain;
      
      var isOptimizer = o.optimizer;
      var isPackager = o.packager;
      
      fis.media(env)
      // 部署配置
        .match('*', {
          deploy: util.getDeployTask(env, true)
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
        })
        // 配置图片压缩
        .match('*.png', {
          optimizer: isOptimizer ? fis.plugin('png-compressor') : null
        })
        // 打包配置
        .match('::package', {
          packager: isPackager ? getDepsPackager(false) : null
        });
    });
  
  util.setUEditorTask(fis.get('project.ueditorRoot'));
};

// fis3-packager-deps-pack 按依赖关系打包:逻辑打包
function getDepsPackager(debug) {
  
  var statics = fis.get('project.statics');
  var entry = fis.get('project.entry');
  
  // 打包配置
  var packConfig = {
    // 是否将合并前的文件路径写入注释中，方便定位代码
    useTrack: debug,
    // 是否开启 souremap 功能
    useSourceMap: debug
  };
  
  // entry(直接设置文件入口路径): '/app/m/index.js' => /asset/pkg/app.js /asset/pkg/app.css
  if (fis.util.isString(entry)) {
    packConfig[statics + '/pkg/app.js'] = packConfig[statics + '/pkg/app.css'] = [
      entry,
      entry + ':deps',
      '/app/common/**',
      '/node_modules/**',
    ];
  }
  
  if (fis.util.isArray(entry)) {
    // entry(设置app/单业务入口标识): ['m'] =>  /asset/pkg/lib.js /asset/pkg/lib.css /asset/pkg/app.js /asset/pkg/app.css
    if (entry.length == 1) {
      packConfig[statics + '/pkg/app.js'] = packConfig[statics + '/pkg/app.css'] = [
        '/app/' + entry[0] + '/index.js',
        '/app/' + entry[0] + '/index.js:deps',
        '/app/common/**',
        '!/node_modules/**',
      ];
      
      // 外部依赖库打包配置
      packConfig[statics + '/pkg/lib.js'] = packConfig[statics + '/pkg/lib.css'] = [
        '/app/' + entry[0] + '/index.js:deps',
        '/node_modules/**',
        '!/app/common/**'
      ];
    }
    
    // entry(设置app/多业务入口标识): ['marketing', 'platform'] /asset/pkg/lib.js /asset/pkg/lib.css /asset/pkg/common.js /asset/pkg/common.css /asset/pkg/{entry}.js /asset/pkg/{entry}.css
    if (entry.length > 1) {
      
      // 应用库依赖
      var entrysDeps = [];
      
      entry.forEach(function (item) {
        
        //应用场景打包配置
        packConfig[statics + '/pkg/' + item + '.js'] = packConfig[statics + '/pkg/' + item + '.css'] = [
          '/app/' + item + '/index.js',
          '/app/' + item + '/index.js:deps',
          '!/app/common/**',
          '!/node_modules/**',
        ];
        
        entrysDeps.push('/app/' + item + '/index.js:deps');
        
      });
      
      // 通用业务模块打包配置
      packConfig[statics + '/pkg/common.js'] = packConfig[statics + '/pkg/common.css'] = entrysDeps.concat([
        '/app/common/**',
        '!/node_modules/**'
      ]);
      
      // 外部依赖库打包配置
      packConfig[statics + '/pkg/lib.js'] = packConfig[statics + '/pkg/lib.css'] = entrysDeps.concat([
        '/node_modules/**',
        '!/app/common/**'
      ]);
    }
  }
  
  return fis.plugin('deps-pack', packConfig);
}
