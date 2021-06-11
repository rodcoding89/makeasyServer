var nodemailer = require('nodemailer');

module.exports.contact = function(name,email,subject,message,res){
	const transporter = nodemailer.createTransport({
		//service: 'gmail',
		host: 'smtp.gmail.com',
    	port: 465,
    	secure: true,
		auth: {
			user: 'rodcoding@gmail.com',
			pass: 'rod@coding00'
		}
	});
	const mailOptions = {
		from: email,
		to: 'rodcoding@gmail.com',
		subject: subject,
		html: "<p> From "+name+"</p><p>"+email+"</p><p>"+message+"</p>"
	}
	console.log(mailOptions);
	transporter.sendMail(mailOptions, function(err, info){
		if(err){
			console.log(err);
			res.json({"message":"error"});
		}else{
			console.log('message sent ', info);
			res.json({"message":"successfull"});
		}
	})
	transporter.close();
}