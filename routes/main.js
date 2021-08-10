var express = require('express');
var router = express.Router();
var db = require('../lib/db');


/* GET main listing. */
router.get('/', function(req, res, next) {
    console.log('main is loaded', req.user);
    res.render('Main');    
});

// GET /main/data
router.get('/data', function(req, res, next) {
    console.log('/data is called!', req.user);
    var query = db.connection.query('SELECT * FROM RideList WHERE author_id=?', [req.user],function(err, rows){
        if(err) throw err;  
		res.json(rows);
    });
});


// POST /main/toggle
router.post('/toggle', function(req, res, next) {
	console.log('/toggle', req.user);
	var post = req.body;
    console.log("post는 ", post, "입니다.");
    var { li_id, label_id, label_onoff } = post;
	var query = db.connection.query('SELECT * FROM RideList WHERE li_id=?', [li_id],function(err, rows){
		if(label_onoff){
			var query2 = db.connection.query('UPDATE RideList SET label_onoff=? WHERE li_id=?', [true, li_id]);
		} else {
			var query2 = db.connection.query('UPDATE RideList SET label_onoff=? WHERE li_id=?', [false, li_id]);
		}		
	});
});



// GET /main/short
router.get('/short', function(req, res, next) {
    res.render('S_input');
});

// GET /main/long
router.get('/long', function(req, res, next) {
    res.render('L_input');
});

// GET 으로 하면 안된다.
router.delete('/:listID', function(req, res, next) {
    console.log("DELETE method로 데이터 수신...");
    console.log(`리스트 ${req.params.listID}`);
    res.send('성공적으로 delete');
});

// POST /main/create_list
router.post('/create_list', function(req, res, next) {
    console.log("create_list 입니다");
    var post = req.body;
    var sql = {
        label_id: Date.now(),
		Location_start: post.Location_start,
		Location_end: post.Location_end,
		Start_time: post.Start_time,
		Repeat_ornot: post.Repeat_ornot,
        Start_date: post.Start_date,
		Current_person: post.Current_person,
        Limit_person: post.Limit_person,
        transport_way: post.transport_way,
        comments: post.comments,
        label_onoff: post.label_onoff,
		author_id: req.user,
    };
	console.log(sql.label_id);
    var query = db.connection.query('INSERT INTO RideList SET ?', sql, function(err, rows){
        if(err) throw err;
        console.log('list is added!', rows.insertId);
        res.redirect('/main')    
    });
});
;

module.exports = router;
