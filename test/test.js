var npm = require('npm');
var fs = require('fs');
var path = __dirname + "/files/";
var script = process.argv[2] || "";


function resolve_script(dir, fname) {

	function fileExists(fpath) {

		var cache = Object.keys(require.cache);

		if(fs.existsSync(fpath) && fs.lstatSync(path).isFile()){
			return true;
		}

		try{
			require(fpath);
			Object.keys(require.cache).forEach(function (m) {
				if(cache.indexOf(m) === -1){
					delete require.cache[m];
				}
			});
		}catch(e){}

		return false;
	}

	var f, files;
	var found;

	if(!fileExists(dir + fname)){
		files = fs.readdirSync(path);
		for(f=0;f<files.length;f++){
			if(files[f].slice(0, fname.length) === script){
				found = files[f];
				break;
			}
			if(!found && files[f].indexOf(fname) !== -1){
				found = files[f];
			}
		}
		if(found){
			fname = found;
			console.log('test found - "'+ fname +'"');
		}else{
			throw Error('test not found - "'+ fname +'"');
		}
	}

	return fname;

};

if(script && script.length){
	script = resolve_script(path, script);
}

npm.load(function (err) {

	if (err) {
		console.error(err);
		return process.exit();
	}

	npm.commands.run(["mocha", path + script], function (err, data) {
		return process.exit();
	});
});
