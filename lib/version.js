/**
 * 版本号
 */

module.exports = function () {
  var content = [
    '',
    ' ' + fis.cli.info.name.bold.blue + ' v' + fis.cli.info.version,
    ''
  ].join('\n');
  
  console.log(content);
};
