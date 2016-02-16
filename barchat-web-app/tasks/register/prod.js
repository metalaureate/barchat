module.exports = function (grunt) {
  console.log('Running grunt prod');
  /*
  //disabled prod because kept getting socket.io.get undefined error
	grunt.registerTask('prod', [
		'compileAssets',
		'concat',
		'uglify',
		'cssmin',
		'sails-linker:prodJs',
		'sails-linker:prodStyles',
		'sails-linker:devTpl',
		'sails-linker:prodJsJade',
		'sails-linker:prodStylesJade',
		'sails-linker:devTplJade'
	]);
   */
  grunt.registerTask('prod', ['compileAssets', 'linkAssets']);

};
