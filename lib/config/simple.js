/**
 * simple 配置模式
 */

var util = require('../util');

module.exports = function (config) {
  
  console.log('simple 配置模式');
  
  fis.config.merge(config);
  
  // 使用相对路径,多个互动游戏部署在同一个域名下面,所以使用相对路径来构建
  fis.hook('relative');
  
  fis.match('*', {
    // 让所有文件，都使用相对路径。
    relative: true,
    deploy: util.getDeployTask()
  });
  
  fis.match('::image', {
    // 很多js代码中未对图片做处理,此处默认把图片的md5后缀去掉,防止项目报错
    useHash: false
  });
  
  var environment = fis.get('environment');
  
  Object.keys(environment)
    .forEach(function (env) {
      var o = environment[env];
      
      fis.media(env)
      // 部署配置
        .match('*', {
          deploy: util.getDeployTask(env)
        })
        .match('*.js', {
          // 不要开启md5后缀,老项目中的依赖关系是用requirejs处理的,开启md5后缀后路径引用会出差
          useHash: false,
          optimizer: fis.plugin('uglify-js')
        })
        .match('*.css', {
          useHash: true,
          optimizer: fis.plugin('clean-css')
        });
    });
};
