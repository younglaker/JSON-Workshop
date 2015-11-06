/*var express = require('express');
var router = express.Router();

 // GET home page. 
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;*/

// 生成一个路由实例用来捕获访问主页的GET请求，导出这个路由并在app.js中通过app.use('/', routes); 加载。这样，当访问主页时，就会调用res.render('index', { title: 'Express' });渲染views/index.ejs模版并显示到浏览器中。

// 我们当然可以不要 routes/index.js 文件，把实现路由功能的代码都放在 app.js 里，但随着时间的推移 app.js 会变得臃肿难以维护，这也违背了代码模块化的思想，所以我们把实现路由功能的代码都放在 routes/index.js 里。官方给出的写法是在 app.js 中实现了简单的路由分配，然后再去 index.js 中找到对应的路由函数，最终实现路由功能。我们不妨把路由控制器和实现路由功能的函数都放到 index.js 里，app.js 中只有一个总的路由接口。
// 现在，再运行你的 app，你会发现主页毫无二致。这里我们在 routes/index.js 中通过 module.exports 导出了一个函数接口，在 app.js 中通过 require 加载了 index.js 然后通过 routes(app) 调用了 index.js 导出的函数

// 通过 require() 引入 crypto 模块和 user.js 用户模型文件，crypto 是 Node.js 的一个核心模块，我们用它生成散列值来加密密码。
var crypto = require('crypto'),
    User = require('../models/user.js');


module.exports = function(app) {
	app.get('/', function (req, res) {
	  res.render('index', {
	    title: '主页',
	    user: req.session.user,
	    success: req.flash('success').toString(),
	    error: req.flash('error').toString()
	  });
	});
	app.get('/reg', function (req, res) {
	  res.render('reg', {
	    title: '注册',
	    user: req.session.user,
	    success: req.flash('success').toString(),
	    error: req.flash('error').toString()
	  });
	});
	app.get('/login', function (req, res) {
		res.render('login', { title: 'Login' });
	});
	app.get('/post', function (req, res) {
		res.render('post', { title: 'Post' });
	});
	app.get('/logout', function (req, res) {});

	app.post('/reg', function (req, res) {
		//  req.body： 就是 POST 请求信息解析过后的对象，例如我们要访问 POST 来的表单内的 name="password" 域的值，只需访问 req.body['password'] 或 req.body.password 即可。
	  var name = req.body.name,
	      password = req.body.password,
	      password_re = req.body['password-repeat'];
	  //检验用户两次输入的密码是否一致
	  if (password_re != password) {
	    req.flash('error', '两次输入的密码不一致!'); 
	    return res.redirect('/reg');//返回注册页
	  }
	  //生成密码的 md5 值
	  var md5 = crypto.createHash('md5'),
	      password = md5.update(req.body.password).digest('hex');
	  var newUser = new User({
	      name: name,
	      password: password,
	      email: req.body.email
	  });

	  //检查用户名是否已经存在 
	  // User：在前面的代码中，我们直接使用了 User 对象。User 是一个描述数据的对象，即 MVC 架构中的模型。前面我们使用了许多视图和控制器，这是第一次接触到模型。与视图和控制器不同，模型是真正与数据打交道的工具，没有模型，网站就只是一个外壳，不能发挥真实的作用，因此它是框架中最根本的部分。
	  User.get(newUser.name, function (err, user) {
	    if (err) {
	      req.flash('error', err);
	      // res.redirect： 重定向功能，实现了页面的跳转，更多关于 res.redirect 的信息请查阅：http://expressjs.com/api.html#res.redirect 。
	      return res.redirect('/');
	    }
	    if (user) {
	      req.flash('error', '用户已存在!');
	      return res.redirect('/reg');//返回注册页
	    }

	    //如果不存在则新增用户
	    newUser.save(function (err, user) {
	      if (err) {
	        req.flash('error', err);
	        return res.redirect('/reg');//注册失败返回主册页
	      }
	      req.session.user = user;//用户信息存入 session
	      req.flash('success', '注册成功!');
	      res.redirect('/');//注册成功后返回主页
	    });
	  });
	});
	app.post('/login', function (req, res) {});
	app.post('/post', function (req, res) {});
};

