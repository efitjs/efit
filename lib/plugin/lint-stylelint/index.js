/**
 * lint-stylelint
 * project.eslintrc的设置和stylelint的设置一模一样，增加ignoreFiles设置过滤文件,ignoreFiles:['/app/m/*.js','/app/m/page/index.js','/app/m/page/**.js'],根目录相对于fis的root目录
 */

var path = require('path');
var stylelint = require('stylelint');

// 获取lint类型
function getSyntax(ext) {
  ext = ext.replace(/^\./, '');
  switch (ext) {
    default:
      return '';
    case 'scss':
    case 'sass':
      return 'scss';
    case 'less':
      return 'less';
  }
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

// formatter
function formatter(results) {
  
  if (!results) {
    throw new Error('Type Error: is an invalid results!');
  }
  
  var msg = [];
  
  results.forEach(function (result) {
    if (result.errored) {
      
      result.warnings.forEach(function (warning) {
        
        var severity = warning.severity == 'error' ? warning.severity.red : warning.severity.yellow;
        
        msg.push(' ' + padding(warning.line, 3, 'left') + ':' + padding(warning.column, 3, 'right') + '  ' + severity + '  ' + warning.text.replace(/\n/, ' '));
        
      });
      
      // 1 problem (1 error, 0 warnings)
      var count = '\n  ' + result.warnings.length + ' problem  (' + result.warnings.length + ' errors)' + '\n  ';
      
      msg.push(count.bold.red);
    }
  });
  
  return msg.join('\n');
}

// ignore
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

var _files = [];
module.exports = function (content, file, conf) {
  
  //避免重复校验
  if (_files.indexOf(file.id) > -1) {
    return;
  }
  
  _files.push(file.id);
  
  var stylelintrc = fis.util.merge({}, fis.get('project.stylelintrc'));
  
  if (fis.util.isEmpty(stylelintrc)) {
    return;
  }
  
  // 过滤忽略文件
  if (ignore(file, stylelintrc)) {
    return;
  }
  
  stylelint.lint({
    code: content,
    config: stylelintrc,
    formatter: 'string',
    configBasedir: path.resolve(__dirname, '../node_modules'),
    syntax: getSyntax(file.ext)
  }).then(function (report) {
    // do things with report.output, report.errored,
    // and report.results
    if (report.errored) {
      var msg = formatter(report.results);
      fis.log.warn('%s  \n%s', file.realpath, msg);
    }
  }).catch(function (err) {
    fis.log.warn(
      '[%s] lint failed with %s: \n\n %s',
      file.id,
      'error',
      err.stack
    );
  });
};
