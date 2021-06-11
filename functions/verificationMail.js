var dbPromise = require('./dbconnection.js');
var nodemailer = require('nodemailer');


module.exports.verify = function(email,rand,host){

	dbPromise.db.all('SELECT userid FROM users WHERE email = ?',[email],(err,rows) =>{
		if (err) {
			throw err;
		}else{
			rows.forEach((row) =>{
				userId = row;
				console.log(userId);
				const value = rand+"-"+userId.userid;
				//const link = '\nhttp:\/\/' + host + '\/confirmation\? id \=' + rand + '\-'+ userId.userid +'.\n';
				const link = `http://${host}/confirmation?id=${value}`;
				const transporter = nodemailer.createTransport({
					service: 'gmail',
					auth: {
						user: 'rodcoding@gmail.com',
						pass: 'rod@coding00'
					}
				});
				const mailOptions = {
					from: 'rodcoding@gmail.com',
					to: 'kwayeprodrigue@ymail.com',
					subject: 'Email verification',
					html: "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"
					
				}
				console.log(mailOptions);
				transporter.sendMail(mailOptions, function(err, res){
					if(err){
						console.log(err);
					}else{
						console.log('message sent ', res);
					}
				})
				transporter.close();
			});
		}
	})
}