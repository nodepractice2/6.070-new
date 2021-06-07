const express = require('express');
const user = require('../routes/auth');
// 데이터 값 연결 user.nick과 user.email로 로그인한 사용자 데이터 불러오기 가능
const post = require('../models/post');
const eotrmf = require('../models/eotrmf');
//const jowon = require('../models/jowon');
const { User, datgle } = require('../models');

const router = express.Router();

var postdata;  

router.get('/', (req, res) => {
  res.render('main');                               
  });

router.get('/QnA/write' ,(req,res)=>{

  res.render('write');
})


// jowon db id pk, name, email......
router.get('/Teammates', (req,res) =>{
  res.render('Teammates');
})

router.post('/Teammates', async(req,res)=> {
  var id =req.body.id;
  await post.findOne({raw : true})
  .then((result) =>{
    console.log(result);
    var data =result.content + result.writer;
    console.log(data);
    res.send(data);
  })

})
  
router.get('/post', async(req,res) => {
          await post.findAll({raw : true})
          .then((results) =>{
            console.log(results);
            postdata = results;
          }).catch ((err)=>{
           console.error(err);
          });
          res.redirect('/main/QnA');
        });
       
router.get('/QnA' ,(req,res) => {
  res.render('QnA' , {postdata});
})                       

router.get('/QnA/Article',async(req,res) => {
  var postId =req.query.id;
  console.log(postId);
  await post.findAll({
    include : [
      { model: eotrmf}
    ],
    where: {id : postId}
  }).then((result) => {
    console.log(result);
    res.render( 'Article', {list : result})
  }).catch((error) => {
    console.log(error);
    return next(error);
  });

});

router.post('/QnA/write' , async (req,res)=>{  //insert
  const { content, postTiltle} = req.body;
 
 try{
  await post.create({
    content,
    postTiltle,
    writer : user.nick,
      });
  return res.redirect('/main/post');
 }catch (error) {
  console.error(error);
  return next(error);
}
});

  module.exports = router;