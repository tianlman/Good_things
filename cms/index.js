//在nodejs运行
//var a = 1;
//console.log(a)
//require配合这个module.exports home自定义的模块
//var b = require("./home.js")
//console.log(b.add(3, 4))
//创建一个简单的服务器
//步骤1 用require，引入http模块
//步骤2用http模块的createServer方法创建一个服务器，createServer接受一个函数
//步骤3用response.end方法相应数据到前端
//步骤4用listen打开接口
var http = require("http");
//引入mysql第三方模块
var mysql = require("mysql");
//处理路由的原生模块
var url = require("url");
//处理路由参数的模块
var querystring = require("querystring")

//进行数据库连接
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'node'
});

//执行连接
connection.connect();

//console.log(http)
http.createServer(function(request, response) {
	//解决跨域
	response.setHeader("Access-Control-Allow-Origin", "*");
	//设置头部信息
	/*response.writeHead(200, {
		'Content-Type': 'text/css'
	});*/
	//请求的东西 ajax发过来的东西
	//response就是服务器相应给浏览器
	//mysql
	var obj = {
		name: 'teacher',
	}
	console.log("路由:" + request.url) //abc?name=yao
	console.log("路由的路径：" + url.parse(request.url).pathname) // /abc

	var pathname = url.parse(request.url).pathname;

	console.log("路由的参数：" + url.parse(request.url).query) //name=yap&skill=ps

	var paramsStr = url.parse(request.url).query;

	console.log("路由的参数从字符串转为对象")
	console.log(querystring.parse(paramsStr))

	var params = querystring.parse(paramsStr);
	
	//console.log("路由参数:"+url.parse(string).query)
	//处理路由的逻辑
	//url.parse(string).pathname

	function insert() {
		console.log('INSERT INTO `biao`(`skill`, `name`) VALUES ("' + params.skill + '","' + params.name + '")');
		//插入
		connection.query('INSERT INTO `biao`(`skill`, `name`) VALUES ("' + params.skill + '","' + params.name + '")', function(error, results, fields) {
			if(error) throw error;
			console.log('The solution is: ', results);
			//connection.end();
			//查询
			connection.query('SELECT * FROM biao', function(error, results, fields) {
				if(error) throw error;
				console.log('结果集: ', results);
				obj.lists = results
					//connection.end();
				response.end(JSON.stringify(obj))
			});
		});
	}

	function del() {
		connection.query('DELETE FROM `biao` WHERE id = ' + params.id, function(error, results, fields) {
			if(error) throw error;
			console.log('The solution is: ', results);
			//connection.end();
			//查询
			connection.query('SELECT * FROM biao', function(error, results, fields) {
				if(error) throw error;
				console.log('结果集: ', results);
				obj.lists = results
					//connection.end();
				response.end(JSON.stringify(obj))
			});
		});
	}

	function select() {
		connection.query('SELECT * FROM biao', function(error, results, fields) {
			if(error) throw error;
			console.log('结果集: ', results);
			obj.lists = results
				//connection.end();
			response.end(JSON.stringify(obj))
		});
	}

	function selectDetail() {
		connection.query('SELECT * FROM biao where id = ' + params.id, function(error, results, fields) {
			if(error) throw error;
			console.log('结果集: ', results);
			obj.lists = results
				//connection.end();
			response.end(JSON.stringify(obj))
		});
	}

	function edit() {
		connection.query('UPDATE `biao` SET `skill`="' + params.skill + '",`name`= "' + params.name + '" WHERE id = ' + params.id, function(error, results, fields) {
			if(error) throw error;
			console.log('结果集: ', results);
			//obj.lists = results
			//connection.end();
			response.end("你已经成功修改")
		});
	}

	switch(pathname) {
		//增加的路由
		case '/insert':
			insert();
			break;
			//删除的路由
		case '/delete':
			del();
			break;
			//查询的路由
		case '/select':
			select();
			break;
		case '/selectdetail':
			selectDetail();
			break;
		case '/edit':
			edit()
			break;

	}

}).listen(6431);
console.log("服务器启动");