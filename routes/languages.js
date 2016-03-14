var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('languages', { title: 'Languages' });
});

/*
 * GET userlist.
 */
router.get('/list', function(req, res) {
    var db = req.db;
    var collection = db.get('languages');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});

/*
 * POST to adduser.
 */
router.post('/add', function(req, res) {
    var db = req.db;
    var collection = db.get('languages');
    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
 * DELETE to deleteuser.
 */
router.delete('/delete/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('languages');
    var userToDelete = req.params.id;
    collection.remove({ '_id' : userToDelete }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;
