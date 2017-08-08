/**
 * lint-eslint
 * project.eslintrc其他的属性和eslint的设置一模一样，增加ignoreFiles设置过滤文件,ignoreFiles:['/app/m/*.js','/app/m/page/index.js','/app/m/page/**.js'],根目录相对于fis的root目录
 */

var CLIEngine = require('eslint').CLIEngine;

// 忽略文件
function ignore(file, conf) {
  var ignored = [];
  
  if (conf.ignoreFiles) {
    var ignoreFiles = conf.ignoreFiles;
    if (typeof ignoreFiles === 'string' || fis.util.is(ignoreFiles, 'RegExp')) {
      ignored = [ignoreFiles];
    } else if (fis.util.is(ignoreFiles, 'Array')) {
      ignored = ignoreFiles;
    }
    delete conf.ignoreFiles;
  }
  
  if (ignored) {
    for (var i = 0, len = ignored.length; i < len; i++) {
      if (fis.util.filter(file.subpath, ignored[i])) {
        return true;
      }
    }
  }
  return false;
}

// 补白
function padding(str, len, type) {
  var sl = len - (str + '').length;
  for (var i = 0; i < sl; i++) {
    if (type == 'left') {
      str = ' ' + str;
    } else {
      str += ' ';
    }
  }
  return str;
}

// 格式化
function formatter(results) {
  if (!results) {
    throw new Error('Type Error: is an invalid results!');
  }
  var msg = [];
  results = results[0];
  
  var err = results.errorCount,
    warn = results.warningCount;
  
  var total = err + warn;
  var messages = results.messages;
  
  messages.forEach(function (msgItem) {
    var ruleId = msgItem.ruleId,
      line = msgItem.line,
      col = msgItem.column,
      desc = msgItem.message,
      severity = msgItem.severity;
    var type = severity == 1 ? 'warning'.yellow : 'error  '.red; // error type
    
    // 7:8  error  'b' is not defined  no-undef
    msg.push(' ' + padding(line, 3, 'left') + ':' + padding(col, 3, 'right') + '  ' + type + '  ' + desc + '  (' + ruleId + ')');
  });
  
  // 1 problem (1 error, 0 warnings)
  var count = '\n  ' + total + ' problem  (' + err + ' errors, ' + warn + ' warnings)' + '\n  ';
  
  msg.push(count.bold.red);
  
  return msg.join('\n');
}

var _files = [];
module.exports = function (content, file) {
  
  //避免重复校验
  if (_files.indexOf(file.id) > -1) {
    return;
  }
  
  _files.push(file.id);
  
  var eslintrc = fis.util.merge({}, fis.get('project.eslintrc'));
  
  if (fis.util.isEmpty(eslintrc)) {
    return;
  }
  
  eslintrc.useEslintrc = false;
  
  // 转换文件配置中的中env
  eslintrc.envs = fis.util.keys(eslintrc.env);
  
  // 转换文件配置中的globals
  eslintrc.globals = fis.util.keys(eslintrc.globals);
  
  // 过滤忽略文件
  if (ignore(file, eslintrc)) {
    return;
  }
  
  var cli = new CLIEngine(eslintrc);
  
  var report = cli.executeOnText(content);
  
  if (report.errorCount || report.warningCount) {
    var msg = formatter(report.results);
    fis.log.warn('%s  \n%s', file.realpath, msg);
  }
  
};
