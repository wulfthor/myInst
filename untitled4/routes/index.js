var express = require('express');
var router = express.Router();
var piexif = require("piexifjs");
var fs = require('fs');
var async = require('async');
var glob = require('glob');
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/images'
//var db = require('../db.js');
//var Image = require('../models/image');
/* GET home page. */
// 43_GB 408_3@KKSgb8408 verso.jpg
router.get('/', function(req, res) {
            var myexifdata = {};
            var myexifLensdata = {};

    glob('public/data/images/*', function (err,mdata) {
        if (err)
            res.send(err)
        else {
            getConnection(function(err,coll) {
              if(err) {
                return cb(err);
              }
            console.log("  ");
            console.log("------------NEW GET---------------");
            console.log("V");
            var test = "";
            var newArr = [];
            var newObj = {};
           coll.find({}).toArray(function(err,doc) {
             doc.map(function(item) {
              var tmpObj = {};
               console.log("---DOC---");
               console.log(item.color);
               console.log(item.invNr);
               console.log(item.id);
               tmpObj['color']=item.color;
               tmpObj['size']=item.size;
               test = "kurt";
               newArr.push(item);
               newObj[item.invNr]=tmpObj;
             });

               console.log("---xDOC---");
            console.log(newArr);
               console.log("---dDOCd---");
            console.log(newObj);
               console.log("---aDOC---");
            var data = {};
            data = mdata;

            data.forEach(function(val,index) {
                console.log("V " + val);
                console.log("I " + index);
                data[index] = val.replace(/public/,'');


            });

            //console.log("M: " + JSON.stringify(myexifdata));
            //console.log("L: " + JSON.stringify(myexifLensdata));


            data.sort(compare);


            var obj = data.reduce(function(o, v, i) {
                var tmpO = {};
                tmpO.fullPath = v;
                //
                //origfile
                var tmpP = v.replace(/\/data\/images\//g,'');
                tmp = tmpP.split('@')[0]
                tmpa = tmpP.split('@')[1]
                tmpO.origFile = tmpa.replace(/\.jpg/, '');

                var xtmp = tmp;
                xtmp = xtmp.split('_');
                tmpKatNr=xtmp[0];
                //tmpKatNr=tmpKatNr.replace(" ","");
                //tmpP=tmpP.replace(" ","");
                //xtmp=xtmp.replace(" ","");
                console.log("Kat: " +tmpKatNr);
                console.log("Txx: " + tmpP);
                console.log("Txx: " + tmp);

                //katnr
                tmpO.katNr = v.includes('erso')? tmpKatNr + "verso" : tmpKatNr;

                //invnr
                var newInv = xtmp[xtmp.length-2]
                newInv = newInv + "_" + xtmp[xtmp.length-1]
                newInv = newInv.replace(/[a-zA-Z]/g,'');
                newInv = newInv.replace(" ","");
                tmp = tmp[(tmp.length - 2)];
                tmp = tmp.replace(" ","");
                console.log("TEMP " + tmp);
                console.log("TEMPx " + newInv);
                newInv = tmpP.includes('erso')? newInv + "_v" : newInv;
                tmpO.invNr = newInv;
                tmpO.testM = test;
                console.log("xinv " + newInv);

                try {
                  console.log("oiinvC " + newInv + " " +  JSON.stringify(newObj[newInv].color));
                  console.log("oiinvS " + newInv + "" + JSON.stringify(newObj[newInv].size));
                  tmpO.color = newObj[newInv].color;
                  tmpO.size = newObj[newInv].size;
                }
                catch(err) {
                  console.log("err " + newInv);
                }
                //tmpO.test = myexifdata[tmpinvNr];
                //tmpO.comment = myexifLensdata[tmpinvNr];
                o[i]= tmpO;
                /*
                   coll = db.collection('images');
                   coll.find({invNr:tmpinvNr}).toArray(function(err,doc) {
                   console.log("IN OB");
                    console.log(doc);
                  tmpO.color = doc.color;
                  tmpO.size = doc.size;
                   });
                   */
                return o;
            }, {});
            console.log("DONE");


            console.log(obj);
            res.render('index', {
                title: 'Venetianske tegninger',
                length: data.length,
                data: obj
              });
            });
            });
        }
    });

    function getConnection(cb) {  
      var url = 'mongodb://localhost:27017/images'
      MongoClient.connect(url, function(err, db) {
        if (err) return cb(err)
        var images = db.collection("images")
        // because we are searching by name, we need an index! without an index, things can get slow
        // if you want to learn more: http://docs.mongodb.org/manual/core/indexes-introduction/
        images.ensureIndex({invNrname: true}, function(err) {
          if (err) return cb(err)
          cb(null, images)
        })
      })
    }

    function readAll(collection, cb) {  
      collection.find({}, cb)
    }

    function compare(a,b) {
        var tmpA = a.replace('/data/images/', '');
        var tmpB = b.replace('/data/images/', '');
        tmpA = parseInt(tmpA.split('_')[0]);
        tmpB = parseInt(tmpB.split('_')[0]);
        //console.log("A: " + tmpA);
        //console.log("B: " + tmpB);
        if (tmpA < tmpB)
            return -1;
        if (tmpA >= tmpB)
            return 1;
    }
})

router.post('/', function(req, res) {
  res.setHeader('Content-Type', 'application/json');

  var myArr = [];
  var counter = 0;
  var steps = 3;
  var JSONObj = { };
  var invArr=[];
  var main = []

  for(var i = 0;i<req.body.invNr.length;i++){
    //testID=req.body.invNr[i].split(/[a-zA-Z]+/);
    var mid = req.body.invNr[i];
    console.log("TEST " + mid);
   var obj ={
   _id:mid,
   id:mid,
   invNr:mid,
   fullPath:req.body.fullPath[i],
   color:req.body.color[i],
   size:req.body.size[i]
  }
   main.push(obj);
  }

  console.log("------V-------");
  //console.log(JSON.stringify(main))
  console.log((main));
  console.log("------V-------");
  console.log("------V-------");
  //var image = new Image(testObj);
  //console.log(JSON.stringify(image));


  console.log("------V-------");
  console.log("im cr");
  MongoClient.connect(url, function(err,db) {
  var coll = db.collection('images');
  console.log("conn3#");
    async.each(main,function(item,cb) { 
      console.log(item);
      db.collection('images').update({invNr: item.invNr},item, {upsert:true}, function(err, doc){
        console.log("ERROR ");
        console.log(item.invNr);
        console.log(item.id);
        console.log(item._id);
        console.log("Err " + err);
        //cb(err)
        cb(err)
      });
    }, function(retval) {
      if(retval) {
        console.log("got error " + error);
      }
      console.log("db close");
      db.close();
      res.redirect('/');
    });
  });
});


module.exports = router;
