/**
 * 工具方法
 */

// 获取发布任务配置
exports.getDeployTask = function (env, isSkipPacked) {
  // 配置部署任务
  var deployTask = [];
  
  // 项目版本号,填了后自动替换源码中@VERSION@标识,不填则由ci-shell来替换,没有CI环境时必须设置
  var projectVersion = fis.get('project.version');
  if (!env && projectVersion) {
    deployTask.push(fis.plugin('replace', {
      from: '@VERSION@',
      to: projectVersion
    }));
  }
  
  // 项目调试的服务环境:(local|dev|sit|uat|prd),填了后自动替换源码中@ENV@标识,不填则不替换
  var projectDebugEnv = fis.get('project.debugEnv');
  if (!env && projectDebugEnv) {
    deployTask.push(fis.plugin('replace', {
      from: '@ENV@',
      to: projectDebugEnv
    }));
  }
  
  // fis3-deploy-skip-packed 过滤掉已经被打包的资源,配合deps-pack使用,其他情况慎用,会报错
  if (env && isSkipPacked) {
    deployTask.push(fis.plugin('skip-packed', {
      // 默认被打包了 js 和 css 以及被 css sprite 合并了的图片都会在这过滤掉
      // 但是如果这些文件满足下面的规则，则依然不过滤
      ignore: []
    }));
  }
  
  deployTask.push(fis.plugin('local-deliver'));
  
  return deployTask;
};

// 获取UE编辑器构建任务
exports.setUEditorTask = function (ueditorRoot) {
  
  if (!ueditorRoot) {
    return;
  }
  
  // 编辑器的代码处理
  fis.match(ueditorRoot + '**', {
    isMod: false,
    useHash: false,
    parser: null,
    optimizer: null,
    domain: null
  });
  
  fis.match(ueditorRoot + '*.js', {
    useHash: true
  });
  
  //第三方的库不需要处理
  fis.match(ueditorRoot + 'third-party/**', {
    useCompile: false
  });
  
  var environment = fis.get('environment');
  Object.keys(environment)
    .forEach(function (env) {
      var o = environment[env];
      
      var domain = o.domain;
      
      fis.media(env)
      
      // 编辑器根目录下的js要做cdn加速
        .match(ueditorRoot + '*.js', {
          useHash: true,
          optimizer: fis.plugin('uglify-js'),
          domain: domain
        })
        
        // 子目录中的资源在js中使用,不能inspect使用cdn加速和hash
        .match(ueditorRoot + '{content,dialogs,themes,example,lang}/**.css', {
          optimizer: fis.plugin('clean-css')
        })
        
        // 子目录中的资源在js中使用,不能使用cdn加速和hash
        .match(ueditorRoot + '{content,dialogs,example,lang}/**.js', {
          optimizer: fis.plugin('uglify-js')
        })
        // 此处
        .match(ueditorRoot + 'third-party/jquery-1.10.2.min.js', {
          domain: domain
        });
    });
  
};
