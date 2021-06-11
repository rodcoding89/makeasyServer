var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var cron = require('node-cron');
var dbPromise = require('./functions/dbconnection.js');
var check = require('./functions/verificationMail.js');
var service = require('./functions/insertservice.js');
var research = require('./functions/insertresearchservice.js');
var need = require('./functions/insertneed.js');
var product = require('./functions/insertproduct.js');
var ad = require('./functions/insertad.js');
var contact = require('./functions/contact.js');
var path = require('path');
var stripe = require('stripe')('sk_test_51Hizv2CTVwiSYkOaEQA5VKw0hu16ADVLjRRlgsn9t9hXT5BIULUtpmEm182zidnBzBpHhXjtX4EqxN4b7taUeEG800MV0DZh9e')
var dateformat = require('dateformat');
var app = express();

var userId;
var data = [{"fname":"Loa","lname":"Falaise","email":"loa@mail.com","tel":"002454555898","pass":"pass"}]

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}) );

app.use(express.static(path.join(__dirname, './public')));
app.use(express.static('public'));

var day = dateformat(new Date(), "yyyy-mm-dd");
console.log(day);

var date = new Date();
date.setMonth(date.getMonth() + 2);
var expireddate = dateformat(date,"yyyy-mm-dd");
console.log('expireddate', expireddate);

var actueldate = dateformat(new Date(),"yyyy-mm-dd");
console.log('actuelle ', actueldate);



app.all("/*", function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With,Accept');
  
  next();
});

app.get('/images',function(req,res){
	res.send(`<img src="http://localhost:3535/images/insertservice/New Project (1).png">`);
})

//delete all inserted data in a particular time or when the valid date is over
cron.schedule('59 59 23 * * *',function(){
	const sql = "SELECT insertserviceid FROM insertservice WHERE expireddate = ?";
	dbPromise.db.all(sql,[actueldate],(err,rows) => {
		if (err) {
			throw err;
		} else {
			if (rows.length > 0) {
				rows.forEach(async (row) =>{
					dbPromise.db.run("DELETE FROM img WHERE insertserviceid = ?",[row.insertserviceid],(err) =>{
						if (err) {
							throw err;
						} else {
							dbPromise.db.run("DELETE FROM address WHERE insertserviceid = ?",[row.insertserviceid],(err) =>{
								if (err) {
									throw err;
								} else {
									dbPromise.db.run("DELETE FROM insertservice WHERE insertserviceid = ?",[row.insertserviceid],(err) =>{
										if (err) {throw err;} else {}
									});
								}
							});
						}
					})
				})
			} else {}
		}
	});
	const sql1 = "SELECT researchserviceid FROM insertresearchservice WHERE expireddate = ?";
	dbPromise.db.all(sql1,[actueldate],(err,rows) => {
		if (err) {
			throw err;
		} else {
			if (rows.length > 0) {
				rows.forEach(async (row) =>{
					dbPromise.db.run("DELETE FROM img WHERE researchserviceid = ?",[row.researchserviceid],(err) =>{
						if (err) {
							throw err;
						} else {
							dbPromise.db.run("DELETE FROM address WHERE researchserviceid = ?",[row.researchserviceid],(err) =>{
								if (err) {
									throw err;
								} else {
									dbPromise.db.run("DELETE FROM insertresearchservice WHERE researchserviceid = ?",[row.researchserviceid],(err) =>{
										if (err) {throw err;} else {}
									});
								}
							});
						}
					})
				})
			} else {}
		}
	})
	const sql2 = "SELECT productid FROM insertproduct WHERE expireddate = ?";
	dbPromise.db.all(sql2,[actueldate],(err,rows) => {
		if (err) {
			throw err;
		} else {
			if (rows.length > 0) {
				rows.forEach(async (row) =>{
					dbPromise.db.run("DELETE FROM img WHERE productid = ?",[row.productid],(err) =>{
						if (err) {
							throw err;
						} else {
							dbPromise.db.run("DELETE FROM address WHERE productid = ?",[row.productid],(err) =>{
								if (err) {
									throw err;
								} else {
									dbPromise.db.run("DELETE FROM insertproduct WHERE productid = ?",[row.productid],(err) =>{
										if (err) {throw err;} else {}
									});
								}
							});
						}
					})
				})
			} else {}
		}
	})
	const sql3 = "SELECT needid FROM insertneed WHERE expireddate = ?";
	dbPromise.db.all(sql3,[actueldate],(err,rows) => {
		if (err) {
			throw err;
		} else {
			if (rows.length > 0) {
				rows.forEach(async (row) =>{
					dbPromise.db.run("DELETE FROM img WHERE needid = ?",[row.needid],(err) =>{
						if (err) {
							throw err;
						} else {
							dbPromise.db.run("DELETE FROM address WHERE needid = ?",[row.needid],(err) =>{
								if (err) {
									throw err;
								} else {
									dbPromise.db.run("DELETE FROM insertneed WHERE needid = ?",[row.needid],(err) =>{
										if (err) {throw err;} else {}
									});
								}
							});
						}
					})
				})
			} else {}
		}
	})
	const sql4 = "SELECT adid FROM insertad WHERE expireddate = ?";
	dbPromise.db.all(sql4,[actueldate],(err,rows) => {
		if (err) {
			throw err;
		} else {
			if (rows.length > 0) {
				rows.forEach(async (row) =>{
					dbPromise.db.run("DELETE FROM img WHERE adid = ?",[row.adid],(err) =>{
						if (err) {
							throw err;
						} else {
							dbPromise.db.run("DELETE FROM address WHERE adid = ?",[row.adid],(err) =>{
								if (err) {
									throw err;
								} else {
									dbPromise.db.run("DELETE FROM insertad WHERE adid = ?",[row.adid],(err) =>{
										if (err) {throw err;} else {}
									});
								}
							});
						}
					})
				})
			} else {}
		}
	})
	console.log('cron work');
})

//fecht data in the insertservice table
app.get('/getallservicedata',function(req,res){
	const sql = 'SELECT u.fname,u.lname,u.tel,u.email,i.servicename,i.servicedescription,i.insertserviceid,i.prix,i.date,a.quartier_rue,a.city,a.bpostal_cpostal,a.region,a.pays,ig.url,ig.firsturl FROM insertservice i INNER JOIN users u ON u.userid = i.userid INNER JOIN address a ON i.insertserviceid = a.insertserviceid INNER JOIN img ig ON i.insertserviceid = ig.insertserviceid';
		dbPromise.db.all(sql,[],(err,rows) =>{
			if (err) {
				throw err;
			}else{
				res.send(rows);
			}
		})
});

app.get('/getallresearchservicedata',function(req,res){
	const sql = 'SELECT u.fname,u.lname,u.tel,u.email,i.researchname,i.researchdescription,i.researchserviceid,i.prix,i.date,a.quartier_rue,a.city,a.bpostal_cpostal,a.region,a.pays,ig.url,ig.firsturl FROM insertresearchservice i INNER JOIN users u ON u.userid = i.userid INNER JOIN address a ON i.researchserviceid = a.researchserviceid INNER JOIN img ig ON i.researchserviceid = ig.researchserviceid';
		dbPromise.db.all(sql,[],(err,rows) =>{
			if (err) {
				throw err;
			}else{
				res.send(rows);
			}
		})
});

app.get('/getallproductdata',function(req,res){
	const sql = 'SELECT u.fname,u.lname,u.tel,u.email,i.productname,i.productdescription,i.productid,i.prix,i.date,a.quartier_rue,a.city,a.bpostal_cpostal,a.region,a.pays,ig.url,ig.firsturl FROM insertproduct i INNER JOIN users u ON u.userid = i.userid INNER JOIN address a ON i.productid = a.productid INNER JOIN img ig ON i.productid = ig.productid';
		dbPromise.db.all(sql,[],(err,rows) =>{
			if (err) {
				throw err;
			}else{
				res.send(rows);
			}
		})
});

app.get('/getallneeddata',function(req,res){
	const sql = 'SELECT u.fname,u.lname,u.tel,u.email,i.needname,i.needdescription,i.needid,i.prix,i.date,a.quartier_rue,a.city,a.bpostal_cpostal,a.region,a.pays,ig.url,ig.firsturl FROM insertneed i INNER JOIN users u ON u.userid = i.userid INNER JOIN address a ON i.needid = a.needid INNER JOIN img ig ON i.needid = ig.needid';
		dbPromise.db.all(sql,[],(err,rows) =>{
			if (err) {
				throw err;
			}else{
				res.send(rows);
			}
		})
});

app.get('/getalladdata',function(req,res){
	const sql = 'SELECT u.fname,u.lname,u.tel,u.email,i.adname,i.addescription,i.adid,i.prix,i.date,a.quartier_rue,a.city,a.bpostal_cpostal,a.region,a.pays,ig.url,ig.firsturl FROM insertad i INNER JOIN users u ON u.userid = i.userid INNER JOIN address a ON i.adid = a.adid INNER JOIN img ig ON i.adid = ig.adid';
		dbPromise.db.all(sql,[],(err,rows) =>{
			if (err) {
				throw err;
			}else{
				res.send(rows);
			}
		})
});

app.post('/getserviceuserdata',function(req,res){
	const sql = 'SELECT u.fname,u.lname,u.tel,u.email,i.servicename,i.servicedescription,i.insertserviceid,i.prix,i.date,a.quartier_rue,a.city,a.bpostal_cpostal,a.region,a.pays,ig.url,ig.firsturl FROM insertservice i INNER JOIN users u ON u.userid = i.userid INNER JOIN address a ON i.insertserviceid = a.insertserviceid INNER JOIN img ig ON i.insertserviceid = ig.insertserviceid WHERE i.userid AND u.userid = ?';
		dbPromise.db.all(sql,[req.body.userid],(err,rows) =>{
			if (err) {
				throw err;
			}else{
				if (rows.length > 0) {
					res.send(rows);
				} else {
					res.send({"info":"Aucun Element dans votre espace Service"});
				}
				
			}
		})
})

app.post('/getresearchuserdata',function(req,res){
	const sql = 'SELECT u.fname,u.lname,u.tel,u.email,i.researchname,i.researchdescription,i.researchserviceid,i.prix,i.date,a.quartier_rue,a.city,a.bpostal_cpostal,a.region,a.pays,ig.url,ig.firsturl FROM insertresearchservice i INNER JOIN users u ON u.userid = i.userid INNER JOIN address a ON i.researchserviceid = a.researchserviceid INNER JOIN img ig ON i.researchserviceid = ig.researchserviceid WHERE i.researchserviceid AND u.userid = ?';
		dbPromise.db.all(sql,[req.body.userid],(err,rows) =>{
			if (err) {
				throw err;
			}else{
				if (rows.length > 0) {
					res.send(rows);
				} else {
					res.send({"info":"Aucun Element dans votre espace Recherche de Service"});
				}
			}
		})
})

app.post('/getproductuserdata',function(req,res){
	const sql = 'SELECT u.fname,u.lname,u.tel,u.email,i.productname,i.productdescription,i.productid,i.prix,i.date,a.quartier_rue,a.city,a.bpostal_cpostal,a.region,a.pays,ig.url,ig.firsturl FROM insertproduct i INNER JOIN users u ON u.userid = i.userid INNER JOIN address a ON i.productid = a.productid INNER JOIN img ig ON i.productid = ig.productid WHERE i.productid AND u.userid = ?';
		dbPromise.db.all(sql,[req.body.userid],(err,rows) =>{
			if (err) {
				throw err;
			}else{
				if (rows.length > 0) {
					res.send(rows);
				} else {
					res.send({"info":"Aucun Element dans votre espace Produit"});
				}
			}
		})
})

app.post('/getneeduserdata',function(req,res){
	const sql = 'SELECT u.fname,u.lname,u.tel,u.email,i.needname,i.needdescription,i.needid,i.prix,i.date,a.quartier_rue,a.city,a.bpostal_cpostal,a.region,a.pays,ig.url,ig.firsturl FROM insertneed i INNER JOIN users u ON u.userid = i.userid INNER JOIN address a ON i.needid = a.needid INNER JOIN img ig ON i.needid = ig.needid WHERE i.needid AND u.userid = ?';
		dbPromise.db.all(sql,[req.body.userid],(err,rows) =>{
			if (err) {
				throw err;
			}else{
				if (rows.length > 0) {
					res.send(rows);
				} else {
					res.send({"info":"Aucun Element dans votre espace Besoin"});
				}
			}
		})
})

app.post('/getaduserdata',function(req,res){
	const sql = 'SELECT u.fname,u.lname,u.tel,u.email,i.adname,i.addescription,i.adid,i.prix,i.date,a.quartier_rue,a.city,a.bpostal_cpostal,a.region,a.pays,ig.url,ig.firsturl FROM insertad i INNER JOIN users u ON u.userid = i.userid INNER JOIN address a ON i.adid = a.adid INNER JOIN img ig ON i.adid = ig.adid WHERE i.adid AND u.userid = ?';
		dbPromise.db.all(sql,[req.body.userid],(err,rows) =>{
			if (err) {
				throw err;
			}else{
				if (rows.length > 0) {
					res.send(rows);
				} else {
					res.send({"info":"Aucun Element dans votre espace Annonce"});
				}
			}
		})
})

app.post('/deleteproductdata',function(req,res){
	dbPromise.db.run("DELETE FROM img WHERE productid = ?",[req.body.productid],(err) =>{
		if (err) {
			throw err;
		} else {
			dbPromise.db.run("DELETE FROM address WHERE productid = ?",[req.body.productid],(err) =>{
				if (err) {
					throw err;
				} else {
					dbPromise.db.run("DELETE FROM insertproduct WHERE productid = ?",[req.body.productid],(err) =>{
						if (err) {throw err;} else {
							res.send({"info":"suppression effectué avec succés"});
						}
					});
				}
			});
		}
	})
});

app.post('/deleteservicedata',function(req,res){
	dbPromise.db.run("DELETE FROM img WHERE insertserviceid = ?",[req.body.serviceid],(err) =>{
		if (err) {
			throw err;
		} else {
			dbPromise.db.run("DELETE FROM address WHERE insertserviceid = ?",[req.body.serviceid],(err) =>{
				if (err) {
					throw err;
				} else {
					dbPromise.db.run("DELETE FROM insertservice WHERE insertserviceid = ?",[req.body.serviceid],(err) =>{
						if (err) {throw err;} else {
							res.send({"info":"suppression effectué avec succés"});
						}
					});
				}
			});
		}
	})
})

app.post('/deleteresearchservicedata',function(req,res){
	console.log('test ',req.body.researchid);
	dbPromise.db.run("DELETE FROM img WHERE researchserviceid = ?",[req.body.researchid],(err) =>{
		if (err) {
			throw err;
		} else {
			dbPromise.db.run("DELETE FROM address WHERE researchserviceid = ?",[req.body.researchid],(err) =>{
				if (err) {
					throw err;
				} else {
					dbPromise.db.run("DELETE FROM insertresearchservice WHERE researchserviceid = ?",[req.body.researchid],(err) =>{
						if (err) {throw err;} else {
							res.send({"info":"suppression effectué avec succés"});
						}
					});
				}
			});
		}
	})
})

app.post('/deleteneeddata',function(req,res){
	dbPromise.db.run("DELETE FROM img WHERE needid = ?",[req.body.needid],(err) =>{
		if (err) {
			throw err;
		} else {
			dbPromise.db.run("DELETE FROM address WHERE needid = ?",[req.body.needid],(err) =>{
				if (err) {
					throw err;
				} else {
					dbPromise.db.run("DELETE FROM insertneed WHERE needid = ?",[req.body.needid],(err) =>{
						if (err) {throw err;} else {
							res.send({"info":"suppression effectué avec succés"});
						}
					});
				}
			});
		}
	})
})

app.post('/deleteaddata',function(req,res){
	dbPromise.db.run("DELETE FROM img WHERE adid = ?",[req.body.adid],(err) =>{
		if (err) {
			throw err;
		} else {
			dbPromise.db.run("DELETE FROM address WHERE adid = ?",[req.body.adid],(err) =>{
				if (err) {
					throw err;
				} else {
					dbPromise.db.run("DELETE FROM insertad WHERE adid = ?",[req.body.adid],(err) =>{
						if (err) {throw err;} else {
							res.send({"info":"suppression effectué avec succés"});
						}
					});
				}
			});
		}
	})
})

app.get('/getpersonalizedata',function(req,res){
	const sql = 'SELECT * FROM personalize';
		dbPromise.db.all(sql,[],(err,rows) =>{
			if (err) {
				throw err;
			}else{
				if (rows.length > 0) {
					res.send(rows);
				} else {
					res.send({"info":"Aucune Page presente dans notre base de donnée"})
				}
			}
		})
});

app.get('/confirmation',function(req,res){
	const param = req.query.id;
	const id = param.split("-")[1];
	const rand = param.split("-")[0];
	dbPromise.db.all("SELECT userid,secret,verify FROM users WHERE userid = ? AND secret = ?",[id,rand], function(err,rows){
		if (err) {throw err;}else{
			
			rows.forEach( async (row) =>{

				if (!row.verify) {
					dbPromise.db.run("UPDATE users SET VERIFY = ? WHERE userid = ?",[true,id],function(err){
						if (err) {throw err;}else{
							res.send('<h2>Verification</h2><p>La verification c est deroulé avec reussite. pour vous connecté, retourné a la page de connecxion</p>');
						}
					});
				}else{
					res.send('<h2>Verification</h2><p>La verification a déja étè realisé</p>');
				}
				
			});
		}
	});
	console.log(req.query.id);
	
});

app.post("/stripPayment", function(req,res){
	console.log(req.body);
	var charge = stripe.charges.create({
		amount: 500,
		currency: 'EUR',
		source: req.body.id
	},(err,charge) => {
		if (err) {
			throw err
		}
		const sql = "UPDATE users SET personalized = ? WHERE userid = ?"
		dbPromise.db.run(sql,[true,req.body.userid],(err) =>{
			if (err) {throw err;} else {
				dbPromise.db.all('SELECT userid FROM personalized WHERE userid = ?',[req.body.userid],(rows,err)=>{
					if (err) {throw err;} else {
						if (rows.length > 0) {
							res.json({"info":"Vous disposé deja d'une page personalisé. Si vous souhaitez avoir une autre, creer simplement un autre compte"});
						} else {
							dbPromise.db.run("INSERT INTO personalize (labelname,labeldescription,userid) VALUES (?,?,?)",
								[req.body.labelname,req.body.labeldescription,req.body.userid],(err) => {
									if (err) {throw err;} else {
										res.json({success:true,
											message:"payment"
										});
									}
							});
						}
					}
				})
				
			}
		})
	});
});

app.post('/personalizepage',function(req,res){
	const sql = 'SELECT u.fname,u.lname,u.tel,u.email,i.productname,i.productdescription,i.productid,i.prix,i.date,a.quartier_rue,a.city,a.bpostal_cpostal,a.region,a.pays,ig.url,ig.firsturl FROM insertproduct i INNER JOIN users u ON u.userid = i.userid INNER JOIN address a ON i.productid = a.productid INNER JOIN img ig ON i.productid = ig.productid WHERE i.productid AND u.userid = ?';
		dbPromise.db.all(sql,[req.body.userid],(err,rows) =>{
			if (err) {
				throw err;
			}else{
				if (rows.length > 0) {
					res.send(rows);
				} else {
					res.send({"info":"Aucun Element inséré dans la base de donnée"})
				}
				
			}
		})
});

// send a message to the creator or manager of the platform
app.post("/contact",function(req,res){
	//console.log(req.body);
	contact.contact(req.body.name,req.body.email,req.body.subject,req.body.message,res);
});


// inserting service data with or without image on the database
app.post("/insertservice", service.upload.array("uploads[]", 4), function (req, res) {
  var imgpath = '';
  var firsturl = '';
  const inData =JSON.parse(req.body.data);
  const userid =JSON.parse(req.body.userid);
  if (req.files.length > 0) {
  	firsturl = "http://localhost:3535/images/insertservice/"+req.files[0].filename;
  	for (var i = 0; i < req.files.length; i++) {
	  	if (i < req.files.length - 1) {
	  		
	  		imgpath += "http://localhost:3535/images/insertservice/"+req.files[i].filename+",";
	  	} else {
	  		imgpath += "http://localhost:3535/images/insertservice/"+req.files[i].filename;
	  	}	
	}
	const sql = "INSERT INTO insertservice(servicename,servicedescription,userid,prix,date,expireddate) VALUES(?,?,?,?,?,?)";
	  dbPromise.db.run(sql,[inData.servicename,inData.servicedescription,userid,inData.prix,day,expireddate],function(err){
	  	if (err) {
	  		throw err;
	  	} else {
	  		const lastid = this.lastID;
	  		dbPromise.db.run("INSERT INTO address (quartier_rue,city,bpostal_cpostal,region,pays,insertserviceid) VALUES(?,?,?,?,?,?)",[
	  		
	  		inData.distric,inData.city,inData.bpostal,inData.region,inData.pays,lastid],function(err){
	  			if (err) {throw err} else {

	  			}
	  		});

	  		dbPromise.db.run("INSERT INTO img (url,insertserviceid,firsturl) VALUES(?,?,?)",[imgpath,lastid,firsturl],function(err){
	  			if (err) {throw err} else {

	  			}
	  		});
	  		res.send({"insertion":"SUCCESSFULL"});
	  	}
	  })
  } else {

	  const sql = "INSERT INTO insertservice(servicename,servicedescription,userid,prix,date,expireddate) VALUES(?,?,?,?,?,?)";
	  dbPromise.db.run(sql,[inData.servicename,inData.servicedescription,userid,inData.prix,day,expireddate],function(err){
	  	if (err) {throw err;} else {
	  		const lastid = this.lastID;
	  		dbPromise.db.run("INSERT INTO address (quartier_rue,city,bpostal_cpostal,region,pays,insertserviceid) VALUES(?,?,?,?,?,?)",[
	  		
	  			inData.distric,inData.city,inData.bpostal,inData.region,inData.pays,lastid],function(err){
	  			if (err) {throw err} else {

	  			}
	  		});
	  		imgpath = "http://localhost:3535/images/insertservice/picture.svg";
	  		firsturl = "http://localhost:3535/images/insertservice/picture.svg";
	  		dbPromise.db.run("INSERT INTO img (url,insertserviceid,firsturl) VALUES(?,?,?)",[imgpath,lastid,firsturl],function(err){
	  			if (err) {throw err} else {

	  			}
	  		});
	  	}
	  });
	  res.send({"insertion":"SUCCESSFULL"});
  }
  
  
  //console.log('files', req.files);
  console.log('data', inData.servicename);
  console.log('userid', userid);
  
  //console.log(imgpath);
  
});

//inserting need data on the daatabase with or without image
app.post("/insertneed", need.uploadneed.array("uploads[]", 4), function (req, res) {
  
  var imgpath = '';
  var firsturl = '';
  const inData =JSON.parse(req.body.data);
  const userid =JSON.parse(req.body.userid);
  if (req.files.length > 0) {
  	firsturl = "http://localhost:3535/images/insertneed/"+req.files[0].filename;
  	for (var i = 0; i < req.files.length; i++) {
	  	if (i < req.files.length - 1) {
	  		
	  		imgpath += "http://localhost:3535/images/insertneed/"+req.files[i].filename+",";
	  	} else {
	  		imgpath += "http://localhost:3535/images/insertneed/"+req.files[i].filename;
	  	}	
	}
	const sql = "INSERT INTO insertneed(needname,prix,needdescription,userid,date,expireddate) VALUES(?,?,?,?,?,?)";
	  dbPromise.db.run(sql,[inData.needname,inData.prix,inData.needdescription,userid,day,expireddate],function(err){
	  	if (err) {
	  		throw err;
	  	} else {
	  		const lastid = this.lastID;
	  		dbPromise.db.run("INSERT INTO address (quartier_rue,city,bpostal_cpostal,region,pays,needid) VALUES(?,?,?,?,?,?)",[
	  		
	  		inData.distric,inData.city,inData.bpostal,inData.region,inData.pays,lastid],function(err){
	  			if (err) {throw err} else {

	  			}
	  		});
	  		dbPromise.db.run("INSERT INTO img (url,needid,firsturl) VALUES(?,?,?)",[imgpath,lastid,firsturl],function(err){
	  			if (err) {throw err} else {

	  			}
	  		});
	  		res.send({"insertion":"SUCCESSFULL"});
	  	}
	  })
  } else {

	  const sql = "INSERT INTO insertneed(needname,prix,needdescription,userid,date,expireddate) VALUES(?,?,?,?,?,?)";
	  dbPromise.db.run(sql,[inData.needname,inData.prix,inData.needdescription,userid,day,expireddate],function(err){
	  	if (err) {throw err;} else {
	  		const lastid = this.lastID;
	  		dbPromise.db.run("INSERT INTO address (quartier_rue,city,bpostal_cpostal,region,pays,needid) VALUES(?,?,?,?,?,?)",[
	  		
	  			inData.distric,inData.city,inData.bpostal,inData.region,inData.pays,lastid],function(err){
	  			if (err) {throw err} else {

	  			}
	  		});
	  		imgpath = "http://localhost:3535/images/insertservice/picture.svg";
	  		firsturl = "http://localhost:3535/images/insertservice/picture.svg";
	  		dbPromise.db.run("INSERT INTO img (url,needid,firsturl) VALUES(?,?,?)",[imgpath,lastid,firsturl],function(err){
	  			if (err) {throw err} else {

	  			}
	  		});
	  	}
	  });
	  res.send({"insertion":"SUCCESSFULL"});
  }
  
  
  //console.log('files', req.files);
  console.log('data', inData.servicename);
  console.log('userid', userid);
  
  //console.log(imgpath);
  
});


//inserting ad data on the database with or without image
app.post("/insertad", ad.uploadad.array("uploads[]", 4), function (req, res) {
  
  var imgpath = '';
  var firsturl = '';
  const inData =JSON.parse(req.body.data);
  const userid =JSON.parse(req.body.userid);
  if (req.files.length > 0) {
  	firsturl = "http://localhost:3535/images/insertad/"+req.files[0].filename;
  	for (var i = 0; i < req.files.length; i++) {
	  	if (i < req.files.length - 1) {
	  		
	  		imgpath += "http://localhost:3535/images/insertad/"+req.files[i].filename+",";
	  	} else {
	  		imgpath += "http://localhost:3535/images/insertad/"+req.files[i].filename;
	  	}	
	}
	const sql = "INSERT INTO insertad(adname,prix,addescription,userid,date,expireddate) VALUES(?,?,?,?,?,?)";
	  dbPromise.db.run(sql,[inData.adname,inData.prix,inData.addescription,userid,day,expireddate],function(err){
	  	if (err) {
	  		throw err;
	  	} else {
	  		const lastid = this.lastID;
	  		dbPromise.db.run("INSERT INTO address (quartier_rue,city,bpostal_cpostal,region,pays,adid) VALUES(?,?,?,?,?,?)",[
	  		
	  		inData.distric,inData.city,inData.bpostal,inData.region,inData.pays,lastid],function(err){
	  			if (err) {throw err} else {

	  			}
	  		});
	  		dbPromise.db.run("INSERT INTO img (url,adid,firsturl) VALUES(?,?,?)",[imgpath,lastid,firsturl],function(err){
	  			if (err) {throw err} else {

	  			}
	  		});
	  		res.send({"insertion":"SUCCESSFULL"});
	  	}
	  })
  } else {

	  const sql = "INSERT INTO insertad(adname,prix,addescription,userid,date,expireddate) VALUES(?,?,?,?,?,?)";
	  dbPromise.db.run(sql,[inData.adname,inData.prix,inData.addescription,userid,day,expireddate],function(err){
	  	if (err) {throw err;} else {
	  		const lastid = this.lastID;
	  		dbPromise.db.run("INSERT INTO address (quartier_rue,city,bpostal_cpostal,region,pays,adid) VALUES(?,?,?,?,?,?)",[
	  		
	  			inData.distric,inData.city,inData.bpostal,inData.region,inData.pays,lastid],function(err){
	  			if (err) {throw err} else {

	  			}
	  		});
	  		imgpath = "http://localhost:3535/images/insertservice/picture.svg";
	  		firsturl = "http://localhost:3535/images/insertservice/picture.svg";
	  		dbPromise.db.run("INSERT INTO img (url,adid,firsturl) VALUES(?,?,?)",[imgpath,lastid,firsturl],function(err){
	  			if (err) {throw err} else {

	  			}
	  		});
	  	}
	  });
	  res.send({"insertion":"SUCCESSFULL"});
  }
  
  
  //console.log('files', req.files);
  console.log('data', inData.servicename);
  console.log('userid', userid);
  
  //console.log(imgpath);
  
});


// inserting service data with or without image on the database
app.post("/insertresearchservice", research.uploadresearch.array("uploads[]", 4), function (req, res) {
  
  var imgpath = '';
  var firsturl = '';
  const inData =JSON.parse(req.body.data);
  const userid =JSON.parse(req.body.userid);
  if (req.files.length > 0) {
  	firsturl = "http://localhost:3535/images/insertresearchservice/"+req.files[0].filename;
  	for (var i = 0; i < req.files.length; i++) {
	  	if (i < req.files.length - 1) {
	  		
	  		imgpath += "http://localhost:3535/images/insertresearchservice/"+req.files[i].filename+",";
	  	} else {
	  		imgpath += "http://localhost:3535/images/insertresearchservice/"+req.files[i].filename;
	  	}	
	}
	const sql = "INSERT INTO insertresearchservice(researchname,prix,researchdescription,userid,date,expireddate) VALUES(?,?,?,?,?,?)";
	  dbPromise.db.run(sql,[inData.researchname,inData.prix,inData.researchdescription,userid,day,expireddate],function(err){
	  	if (err) {
	  		throw err;
	  	} else {
	  		const lastid = this.lastID;
	  		dbPromise.db.run("INSERT INTO address (quartier_rue,city,bpostal_cpostal,region,pays,researchserviceid) VALUES(?,?,?,?,?,?)",[
	  		
	  		inData.distric,inData.city,inData.bpostal,inData.region,inData.pays,lastid],function(err){
	  			if (err) {throw err} else {

	  			}
	  		});
	  		dbPromise.db.run("INSERT INTO img (url,researchserviceid,firsturl) VALUES(?,?,?)",[imgpath,lastid,firsturl],function(err){
	  			if (err) {throw err} else {

	  			}
	  		});
	  		res.send({"insertion":"SUCCESSFULL"});
	  	}
	  })
  } else {

	  const sql = "INSERT INTO insertresearchservice(researchname,prix,researchdescription,userid,date,expireddate) VALUES(?,?,?,?,?,?)";
	  dbPromise.db.run(sql,[inData.researchname,inData.prix,inData.researchdescription,userid,day,expireddate],function(err){
	  	if (err) {throw err;} else {
	  		const lastid = this.lastID;
	  		dbPromise.db.run("INSERT INTO address (quartier_rue,city,bpostal_cpostal,region,pays,researchserviceid) VALUES(?,?,?,?,?,?)",[
	  		
	  			inData.distric,inData.city,inData.bpostal,inData.region,inData.pays,lastid],function(err){
	  			if (err) {throw err} else {

	  			}
	  		});
	  		imgpath = "http://localhost:3535/images/insertresearchservice/picture.svg";
	  		firsturl = "http://localhost:3535/images/insertresearchservice/picture.svg";
	  		dbPromise.db.run("INSERT INTO img (url,researchserviceid,firsturl) VALUES(?,?,?)",[imgpath,lastid,firsturl],function(err){
	  			if (err) {throw err} else {

	  			}
	  		});
	  	}
	  });
	  res.send({"insertion":"SUCCESSFULL"});
  }
  
  
  //console.log('files', req.files);
  console.log('data', inData.servicename);
  console.log('userid', userid);
  
  //console.log(imgpath);
  
});

// inserting product data with or without image on the database
app.post("/insertproduct", product.uploadproduct.array("uploads[]", 4), function (req, res) {
  
  var imgpath = '';
  var firsturl = '';
  const inData =JSON.parse(req.body.data);
  const userid =JSON.parse(req.body.userid);
  if (req.files.length > 0) {
  	firsturl = "http://localhost:3535/images/insertproduct/"+req.files[0].filename;
  	for (var i = 0; i < req.files.length; i++) {
	  	if (i < req.files.length - 1) {
	  		
	  		imgpath += "http://localhost:3535/images/insertproduct/"+req.files[i].filename+",";
	  	} else {
	  		imgpath += "http://localhost:3535/images/insertproduct/"+req.files[i].filename;
	  	}	
	}
	const sql = "INSERT INTO insertproduct(productname,prix,old,new,productdescription,userid,date,expireddate) VALUES(?,?,?,?,?,?,?,?)";
	  dbPromise.db.run(sql,[inData.productname,inData.prix,inData.old,inData.new,inData.productdescription,userid,day,expireddate],function(err){
	  	if (err) {
	  		throw err;
	  	} else {
	  		const lastid = this.lastID;
	  		dbPromise.db.run("INSERT INTO address (quartier_rue,city,bpostal_cpostal,region,pays,productid) VALUES(?,?,?,?,?,?)",[
	  		
	  		inData.distric,inData.city,inData.bpostal,inData.region,inData.pays,lastid],function(err){
	  			if (err) {throw err} else {

	  			}
	  		});
	  		console.log('firsturl ',firsturl);
	  		dbPromise.db.run("INSERT INTO img (url,productid,firsturl) VALUES(?,?,?)",[imgpath,lastid,firsturl],function(err){
	  			if (err) {throw err} else {

	  			}
	  		});
	  		res.send({"insertion":"SUCCESSFULL"});
	  	}
	  })
  } else {

	  const sql = "INSERT INTO insertproduct(productname,prix,old,new,productdescription,userid,date,expireddate) VALUES(?,?,?,?,?,?,?,?)";
	  dbPromise.db.run(sql,[inData.productname,inData.prix,inData.old,inData.new,inData.productdescription,userid,day,expireddate],function(err){
	  	if (err) {throw err;} else {
	  		const lastid = this.lastID;
	  		dbPromise.db.run("INSERT INTO address (quartier_rue,city,bpostal_cpostal,region,pays,productid) VALUES(?,?,?,?,?,?)",[
	  		
	  			inData.distric,inData.city,inData.bpostal,inData.region,inData.pays,lastid],function(err){
	  			if (err) {throw err} else {

	  			}
	  		});
	  		imgpath = "http://localhost:3535/images/insertservice/picture.svg";
	  		firsturl = "http://localhost:3535/images/insertservice/picture.svg";
	  		dbPromise.db.run("INSERT INTO img (url,productid,firsturl) VALUES(?,?,?)",[imgpath,lastid,firsturl],function(err){
	  			if (err) {throw err} else {

	  			}
	  		});
	  	}
	  });
	  res.send({"insertion":"SUCCESSFULL"});
  }
  
  
  //console.log('files', req.files);
  console.log('data', inData.servicename);
  console.log('userid', userid);
  
  //console.log(imgpath);
  
});

app.post('/individualAuth',async function(req,res){
	 
	try{
		const pass = req.body.lpass;
		const sql = 'SELECT * FROM users WHERE email = ?';
		dbPromise.db.all(sql,[req.body.lemail],(err,rows) =>{
			const size = rows.length;
			var checklogin;
			if (err) {
				throw err;
			}else{
				if (rows.length > 0) {
					rows.forEach(async (row,idx) => {
						const match = await bcrypt.compare(pass,row.pass);
						if (match) {
							if (row.verify) {
								const name = row.fname+" "+row.lname;
								const id = row.userid;
								const outData = {"name":name,"id":id,"status":"success"};
								res.send({"data":outData});
								
							}else{

								res.send({"data":"Verifier vos email et confirmer la Verfication avant de vous connecter"});
								
							}
						}else{
							res.send({"data":"pass"});
						}
					})
				} else {
					res.send({"data":"email"});
				}
			}
			
		});
	}catch(err){
		console.log(err);
	}
	//console.log(req.body);
	//res.send(req.body);
});

app.post('/companyauth',async function(req,res){
	 
	try{
		const pass = req.body.lpass;

		for (var i = 0; i < data.length; i++) {
			console.log(data[i].email);
			console.log(req.body.lemail)
			if (req.body.lemail === data[i].email) {
				console.log('SUCCESSFULL')
				const match = await bcrypt.compare(pass,data[i].pass);
				if (match) {
					res.send({"status":"SUCCESSFULL"})
				}
			}else{
				console.log('No matching')
			}
		}
		
	}catch(err){
		console.log(err);
	}
	//console.log(req.body);
	//res.send(req.body);
});

app.use(cors());

//sign in the database with user data
app.post('/individual',async function(req,res){
	try{
		//const promise = await dbPromise;
		const pass = req.body.spass;
		const rand = Math.floor((Math.random() * 100) + 54);
		const hashPassword = await bcrypt.hash(pass,10);
		const sql ='INSERT INTO users (fname,lname,email,tel,pass,verify,secret) VALUES(?,?,?,?,?,?,?)';
		dbPromise.db.run(sql,[req.body.fname,req.body.lname,req.body.email,req.body.tel,hashPassword,false,rand],function (err) {
			if (err) {
				console.log(err.message)
				if (err.message.includes('email')) {
					res.send({"error":"email"});
				}else if (err.message.includes('tel')) {
					res.send({"error":"tel"});
				}else if (err.message.includes('tel') && err.message.includes('email')) {
					res.send({"error":"emailtel"});
				}
				
			}else{
				console.log('user data added ',this.lastID);
				res.send({"status":"success"});
				check.verify(req.body.email,rand,req.headers.host);
			}
			
		})
		//dbPromise.db.close();
		const toDb = {"fname":req.body.fname,"lname":req.body.lname,"email": req.body.email,"tel":req.body.tel,"pass":hashPassword};
		data.push(toDb);
		//console.log(data);
	}catch(err){
		console.log(err.message);
	}
	
});

app.listen(3535, function() {
	console.log('Server listen on port 3535');
});