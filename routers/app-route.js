const router    = require('express').Router();
const db = require("./dbconfig");
const { logger } = require('../utils/logger');
var qs = require('querystring');
const crypto = require('crypto');
const CryptoJS = require('crypto-js');
const { body, validationResult } = require('express-validator');
const axios = require('axios');
var nodemailer = require('nodemailer');
require('dotenv').config();
//const window = require('window');
// const cors = require('cors');
// var nodemailer = require('nodemailer');
//var location = require('location-href');

router.get('/', function (req, res) {
    res.render('home');
});

router.get('/testenv', function (req, res) {
    let clientid = process.env.JOKUL_CLIENTID
    let sk = process.env.JOKUL_KEY
    res.send(clientid+sk);
});

//API

router.post('/create-transaction', function (req, res) {
    const notificationHeader = req.headers;
    const notificationBody  = JSON.stringify(req.body);

    //get data by API
    const name = req.body.name;
    const amount = req.body.amount;
    const email = req.body.email;
    const phone = req.body.phone;
    const product_id = req.body.product_id;
    const product_name = req.body.product_name;

    //create signature Hmacsha256 date+words+digest+requesttarget
    let requestTime = notificationHeader['datetransaction'];
    let words = 'dilla';
    let secretKey = '080900';
    console.log(notificationBody);
    let requestTarget = "/create-transaction";
    function  digest(notificationBody){
        let jsonStringHash256 = crypto
          .createHash('sha256')
          .update(notificationBody, 'utf-8')
          .digest()
        return jsonStringHash256.toString('base64')
      }
      let newdigest = digest(notificationBody);
        function signature(requestTime, secretKey, words, requestTarget, newdigest){
            let componentSignature = "date:" + requestTime;
            componentSignature += "\n";
            componentSignature += "words:" + words;
            componentSignature += "\n";
            componentSignature += "digest:" + newdigest;
            componentSignature += "\n";
            componentSignature += "Request-Target:" + requestTarget;
            console.log(componentSignature);
        var signatureHmacSha256 = CryptoJS.HmacSHA256(componentSignature,secretKey);
        var signatureBase64 = CryptoJS.enc.Base64.stringify(signatureHmacSha256);
    
            // Prepend encoded result with algorithm info HMACSHA256=
            return "HMACSHA256="+signatureBase64
        }
    
        let newsignature = signature(requestTime, secretKey, words, requestTarget, newdigest);
        let headerSignature = notificationHeader['signature'];

        console.log('================');
        console.log('Host Signature:',newsignature);
        console.log('Client Signature',headerSignature);

        if (headerSignature === newsignature){
            //create invoice
            function randomData(){
                let result           = '';
                let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                let charactersLength = 10;
                for ( let i = 0; i < charactersLength; i++ ) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
                }
                return result;
            }
            let random = randomData();
            let invoice_number = "INV-NGAHIJI-"+random;
            //check id
            let words = 'dilla';
            let secretKey = '080900';
            let requestTarget = "/check-id";
            function timeStamp(){
                let date = new Date().toISOString();
                return date.substring(0, 19)+'Z';
            }

            let requestTimeid = timeStamp();
            function signature(requestTimeid, secretKey, words, requestTarget){
                let componentSignature = "date:" + requestTimeid;
                componentSignature += "\n";
                componentSignature += "words:" + words;
                componentSignature += "\n";
                componentSignature += "Request-Target:" + requestTarget;
                console.log(componentSignature);
            var signatureHmacSha256 = CryptoJS.HmacSHA256(componentSignature,secretKey);
            var signatureBase64 = CryptoJS.enc.Base64.stringify(signatureHmacSha256);
    
            // Prepend encoded result with algorithm info HMACSHA256=
            return "HMACSHA256="+signatureBase64
            }
    
            let newsignature = signature(requestTimeid, secretKey, words, requestTarget);
            let date = timeStamp();

            var myHeaders = new Headers();
            myHeaders.append("date", date);
            myHeaders.append("signature", newsignature);

            var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            redirect: 'follow'
            };

            let url3 = process.env.PROD_URL + '/check-id/payment';
            fetch(url3, requestOptions)
            .then(response => response.json())
            .then(result => {
                let last_id = result.id;
                console.log(last_id);
                if(last_id == 1){
                var new_id = 1 + 1;
                }else if (last_id > 1){
                var new_id = last_id + 1;
                }else if (last_id < 1){
                var new_id = last_id + 1;
                }else{
                    const response = {
                        status:  'Failed',
                        message:  'Error! Please Check Your Code!'
                    };
                    res.status(501);
                    res.json(response);
                    console.log('Invalid Signature');
                    logger.error(`${req.originalUrl} - ${req.ip} - Exception, Please Check Your Code!`);
                }
                //xendit checkout
                function authenticateUser(user, password){
                    var token = user + ":" + password;
                    var hash = btoa(token);
        
                    return "Basic " + hash;
                };
                let userprod = 'xnd_production_mgLjR8teaeHNRWS4ignx0geUPdEW8q8JSwdzMeIxKctZwtq7XKzClefirFAbj';
                let usersatging = 'xnd_development_VANcrBN1Ij02PFeYpo2JmGKZkt9p27Nxn2UpwACARx1PjvOfY5Ob32fjSHcEI8r'
                let pass = ''
            let authorization = authenticateUser(usersatging,pass);
            console.log(authorization);
            function randomData(){
                let result           = '';
                let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                let charactersLength = 10;
                for ( let i = 0; i < charactersLength; i++ ) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
                }
                return result;
            }
            let random = randomData();
            let invoice_number = "INV-NGAHIJI-"+random;
            let urlcallbackaws = 'http://localhost:3000';
            let urlcallbackhosting = 'https://ngahiji.xyz';
            let callback_url = urlcallbackhosting+'/result/';
            function transactiondate() {
                d = new Date();
                Hari = d.getDay();
                Tanggal = d.getDate();
                Bulan = d.getMonth();
                Tahun = d.getFullYear();
                Jam = d.getHours();
                Menit = d.getMinutes();
                Detik = d.getSeconds();
                arrbulan = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
                arrHari = ["Minggu","Senin","Selasa","Rabu","Kamis","Jum'at","Sabtu"];
                let transactiondate1 = arrHari[Hari] + ', ' + Tanggal + ' ' + arrbulan[Bulan] + ' ' + Tahun + ' ' + Jam +':'+ Menit +':'+ Detik;
                return transactiondate1
            }
            let transaction_date = transactiondate();
            var axios = require('axios');
                var data = JSON.stringify({
                "external_id": invoice_number,
                "amount": amount,
                "payer_email": email,
                "description": product_name,
                "customer": {
                    "given_names": "Ngahiji",
                    "surname": name,
                    "email": email,
                    "mobile_number": phone,
                    "addresses": [
                    {
                        "city": "Jakarta Selatan",
                        "country": "Indonesia",
                        "postal_code": "12345",
                        "state": "Daerah Khusus Ibukota Jakarta",
                        "street_line1": "Jalan Makan",
                        "street_line2": "Kecamatan Kebayoran Baru"
                    }]},
                "success_redirect_url": callback_url+invoice_number,
                "failure_redirect_url": callback_url+invoice_number
                });
        
                var config = {
                method: 'post',
                url: 'https://api.xendit.co/v2/invoices',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': authorization
                },
                data : data
                };
        
                axios(config)
                .then(function (response) {
                let urlinv = response.data.invoice_url
                console.log(JSON.stringify(response.data)),
                console.log(new_id);
                logger.info(`${req.originalUrl} - ${req.ip} - ============== Inisiasi Data =============`);
                let new_name = req.body.name;
                let new_invoice_number = invoice_number;
                let new_amount = req.body.amount;
                let new_transaction_date = transaction_date;
                let transaction_update = transaction_date;
                let payment_method = "XENDIT CHECKOUT";
                let status = "PENDING";
                let new_email = req.body.email;
                let new_phone = req.body.phone;
                let new_product_id = req.body.product_id;
                let new_product_name = req.body.product_name;
                let url_checkout = urlinv;
                let expired = "no expired";

                const init_data = JSON.stringify({
                    name: new_name,
                    email: new_email,
                    phone: new_phone,
                    invoice: new_invoice_number,
                    amount: new_amount,
                    transaction_date: new_transaction_date,
                    transaction_update: transaction_update,
                    payment_method: payment_method,
                    status: status,
                    product_id: new_product_id,
                    product_name: new_product_name,
                    url_checkout: url_checkout,
                    expired: expired
                });

                logger.info(`${req.originalUrl} - ${req.ip} - ${init_data}`);


                logger.info(`${req.originalUrl} - ${req.ip} - ============== Save to DB =============`);
                const sql = "INSERT INTO transaction(id,invoice_number,amount,transaction_date,transaction_update,payment_method,status,name,email,phone,product_id,product_name,expired,url_checkout) VALUES ?";
                const values = [[new_id,new_invoice_number,new_amount,new_transaction_date,transaction_update,payment_method,status,new_name,new_email,new_phone,new_product_id,new_product_name,expired,url_checkout]];
                db.query(sql, [values],function (err, result) {
                    if (err) throw err;
                    console.log("Number of records inserted: " + result.affectedRows);
                // let name = result[0]['name'];
                // let id = result[0]['id'];
                const transporter = nodemailer.createTransport({
                    host: "smtp.hostinger.com",
                    port: 465,
                    secure: true,
                    auth: {
                        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
                        user: 'cs@ngahiji.xyz',
                        pass: 'F261396ff.'
                    }
                    });
                    let urlpayment1 = url_checkout;
                    let invoice1 = new_invoice_number
                    let name1 = new_name;
                    let email1 = new_email;
                    let layanan1 = product_name;
                    let date1 = new_transaction_date;
                    
                    // async..await is not allowed in global scope, must use a wrapper
                    // send mail with defined transport object
                    var mailOptions = {
                        from: 'Ngahiji Customer Service<cs@ngahiji.xyz>',
                        to: email1,
                        subject: 'Pengingat Pembayaran.',
                        html: `
                        <!DOCTYPE html>
                        <html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
                        
                        <head>
                            <title></title>
                            <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0"><!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]--><!--[if !mso]><!-->
                            <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet" type="text/css"><!--<![endif]-->
                            <style>
                                * {
                                    box-sizing: border-box;
                                }
                        
                                body {
                                    margin: 0;
                                    padding: 0;
                                }
                        
                                a[x-apple-data-detectors] {
                                    color: inherit !important;
                                    text-decoration: inherit !important;
                                }
                        
                                #MessageViewBody a {
                                    color: inherit;
                                    text-decoration: none;
                                }
                        
                                p {
                                    line-height: inherit
                                }
                        
                                .desktop_hide,
                                .desktop_hide table {
                                    mso-hide: all;
                                    display: none;
                                    max-height: 0px;
                                    overflow: hidden;
                                }
                        
                                .image_block img+div {
                                    display: none;
                                }
                        
                                @media (max-width:620px) {
                        
                                    .desktop_hide table.icons-inner,
                                    .social_block.desktop_hide .social-table {
                                        display: inline-block !important;
                                    }
                        
                                    .icons-inner {
                                        text-align: center;
                                    }
                        
                                    .icons-inner td {
                                        margin: 0 auto;
                                    }
                        
                                    .image_block img.fullWidth {
                                        max-width: 100% !important;
                                    }
                        
                                    .mobile_hide {
                                        display: none;
                                    }
                        
                                    .row-content {
                                        width: 100% !important;
                                    }
                        
                                    .stack .column {
                                        width: 100%;
                                        display: block;
                                    }
                        
                                    .mobile_hide {
                                        min-height: 0;
                                        max-height: 0;
                                        max-width: 0;
                                        overflow: hidden;
                                        font-size: 0px;
                                    }
                        
                                    .desktop_hide,
                                    .desktop_hide table {
                                        display: table !important;
                                        max-height: none !important;
                                    }
                                }
                            </style>
                            <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
                                <symbol id="one" viewBox="0 0 16 16">
                                    <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2Zm7.283 4.002V12H7.971V5.338h-.065L6.072 6.656V5.385l1.899-1.383h1.312Z"/>
                                    </symbol>
                                </svg>
                        </head>
                        
                        <body style="background-color: #e2eace; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
                            <table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #e2eace;">
                                <tbody>
                                    <tr>
                                        <td>
                                            <table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000; width: 600px; margin: 0 auto;" width="600">
                                                                <tbody>
                                                                    <tr>
                                                                        <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                                            <table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                                <tr>
                                                                                    <td class="pad" style="padding-top:25px;width:100%;padding-right:0px;padding-left:0px;">
                                                                                        <div class="alignment" align="center" style="line-height:10px"><img class="fullWidth" src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/20/rounder-up.png" style="display: block; height: auto; border: 0; max-width: 600px; width: 100%;" width="600" alt="Image" title="Image"></div>
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fff; color: #000; width: 600px; margin: 0 auto;" width="600">
                                                                <tbody>
                                                                    <tr>
                                                                        <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                                            <table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                                <tr>
                                                                                    <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
                                                                                        <div class="alignment" align="center" style="line-height:10px">
                                                                                        </div>
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <table class="row row-3" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fff; color: #000; width: 600px; margin: 0 auto;" width="600">
                                                                <tbody>
                                                                    <tr>
                                                                        <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                                            <table class="text_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                                                                <tr>
                                                                                    <td class="pad">
                                                                                        <div style="font-family: sans-serif">
                                                                                            <div class style="font-size: 12px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #0D0D0D; line-height: 1.2;">
                                                                                                <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 16.8px;"><span style="font-size:28px;"><strong><span style="font-size:28px;">Hello ${name1},</span></strong></span><br><span style="font-size:28px;">pesananmu berhasil dibuat.</span></p>
                                                                                            </div>
                                                                                        </div>
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                            <table class="image_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                                <tr>
                                                                                    <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
                                                                                        <div class="alignment" align="center" style="line-height:10px"><img src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/20/divider.png" style="display: block; height: auto; border: 0; max-width: 316px; width: 100%;" width="316" alt="Image" title="Image"></div>
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                            <table class="text_block block-3" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                                                                <tr>
                                                                                    <td class="pad">
                                                                                        <div style="font-family: sans-serif">
                                                                                            <div class style="font-size: 12px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; mso-line-height-alt: 18px; color: #555555; line-height: 1.5;">
                                                                                                <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 21px;">Invoice : <span style="color:#000000;font-size:14px;"><strong>${invoice1}<br></strong></span>Layanan : <span style="color:#000000;font-size:14px;"><strong>${layanan1}<br></strong></span>Waktu : <span style="color:#000000;font-size:14px;"><strong>${date1}<br></strong></span></p>
                                                                                            </div>
                                                                                        </div>
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                            <table class="text_block block-4" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                                                                <tr>
                                                                                    <td class="pad" style="padding-bottom:10px;padding-left:10px;padding-right:10px;padding-top:20px;">
                                                                                        <div style="font-family: sans-serif">
                                                                                            <div class style="font-size: 12px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; mso-line-height-alt: 18px; color: #0D0D0D; line-height: 1.5;">
                                                                                                <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 21px;">Yuk selesaikan pembayaranmu.<br>klik tombol di bawah ini untuk melakukan pembayaran.</p>
                                                                                            </div>
                                                                                        </div>
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                            <table class="button_block block-5" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                                <tr>
                                                                                    <td class="pad" style="padding-bottom:10px;padding-left:10px;padding-right:10px;padding-top:25px;text-align:center;">
                                                                                        <div class="alignment" align="center"><!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" style="height:62px;width:204px;v-text-anchor:middle;" arcsize="7%" stroke="false" fillcolor="#a8bf6f"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#ffffff; font-family:'Trebuchet MS', Tahoma, sans-serif; font-size:16px"><![endif]-->
                                                                                            <div style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#000000;border-radius:4px;width:auto;border-top:0px solid transparent;font-weight:undefined;border-right:0px solid transparent;border-bottom:0px solid transparent;border-left:0px solid transparent;padding-top:15px;padding-bottom:15px;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;font-size:16px;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:15px;padding-right:15px;font-size:16px;display:inline-block;letter-spacing:normal;"><a href="${urlpayment1}"><span style="word-break: break-word; line-height: 32px; color: #ffffff;">Selesaikan Pembayaran.</span></a></span></div><!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
                                                                                        </div>
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                            <div class="spacer_block block-6" style="height:40px;line-height:40px;font-size:1px;">&#8202;</div>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <table class="row row-4" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #525252; color: #000; width: 600px; margin: 0 auto;" width="600">
                                                                <tbody>
                                                                    <tr>
                                                                        <td class="column column-1" width="33.333333333333336%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                                            
                                                                        </td>
                                                                        <td class="column column-2" width="33.333333333333336%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                                            <table class="text_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                                                                <tr>
                                                                                    <td class="pad" style="padding-top:20px;">
                                                                                        <div style="font-family: sans-serif">
                                                                                            <div class style="font-size: 12px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #a8bf6f; line-height: 1.2;">
                                                                                                <p style="margin: 0; font-size: 12px; text-align: center; mso-line-height-alt: 14.399999999999999px;"><span style="color:#ffffff;font-size:12px;"><span style="font-size:12px;color:#ffffff;">@2023 Ngahiji 1.0.0</span></span><br><span style="color:#ffffff;font-size:12px;"><span style="font-size:12px;color:#ffffff;">cs@ngahiji.xyz</span></span><br></p>
                                                                                            </div>
                                                                                        </div>
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                        <td class="column column-3" width="33.333333333333336%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <table class="row row-5" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000; width: 600px; margin: 0 auto;" width="600">
                                                                <tbody>
                                                                    <tr>
                                                                        <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                                            <table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                                <tr>
                                                                                    <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
                                                                                        <div class="alignment" align="center" style="line-height:10px"><img class="fullWidth" src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/20/rounder-dwn.png" style="display: block; height: auto; border: 0; max-width: 600px; width: 100%;" width="600" alt="Image" title="Image"></div>
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                            <div class="spacer_block block-2" style="height:60px;line-height:60px;font-size:1px;">&#8202;</div>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <table class="row row-6" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000; width: 600px; margin: 0 auto;" width="600">
                                                                <tbody>
                                                                    <tr>
                                                                        <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                                            <table class="icons_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                                <tr>
                                                                                    <td class="pad" style="vertical-align: middle; color: #9d9d9d; font-family: inherit; font-size: 15px; padding-bottom: 5px; padding-top: 5px; text-align: center;">
                                                                                        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                                            <tr>
                                                                                                <td class="alignment" style="vertical-align: middle; text-align: center;"><!--[if vml]><table align="left" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><![endif]-->
                                                                                                    <!--[if !vml]><!-->
                                                                                                </td>
                                                                                            </tr>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table><!-- End -->
                        </body>
                        
                        </html>`
                    };
                    
                    transporter.sendMail(mailOptions, (err, info) => {
                        if (err) throw err;
                        console.log('Email sent: ' + info.response);
                    });
                    const response = {
                        status:  'Success',
                        message:  'Transaction has been created',
                        url: url_checkout
                    };
                    res.status(201);
                    res.json(response);
                });
                logger.info(`${req.originalUrl} - ${req.ip} - Transaction Created`);
                })
                .catch(function (error) {
                console.log(error);
                });
                })
            .catch(error => console.log('error', error));
        }else{
            const response = {
                status: 'Forbidden',
                message: 'Signature Not Valid'
            };
            res.status(403);
            res.json(response);
            console.log('Invalid Signature');
            logger.error(`${req.originalUrl} - ${req.ip} - Exception, Invalid Signature`);
        };
});

//API CHECK ID
router.post('/check-id/:process', function (req, res){
    let process = req.params.process;
    if (process === 'customer'){
        db_name = 'user'
    }else if(process === 'payment'){
        db_name = 'transaction'
    }else if(process === 'barang'){
        db_name = 'product'
    }else{
        logger.error(`${req.originalUrl} - ${req.ip} - Exception, Please Check Your Code!`);
    };
    const notificationHeader = req.headers;
    let requestTime = notificationHeader['date'];
    let words = 'dilla';
    let secretKey = '080900';
    let requestTarget = "/check-id";
        function signature(requestTime, secretKey, words, requestTarget){
            let componentSignature = "date:" + requestTime;
            componentSignature += "\n";
            componentSignature += "words:" + words;
            componentSignature += "\n";
            componentSignature += "Request-Target:" + requestTarget;
            console.log(componentSignature);
        var signatureHmacSha256 = CryptoJS.HmacSHA256(componentSignature,secretKey);
        var signatureBase64 = CryptoJS.enc.Base64.stringify(signatureHmacSha256);
    
            // Prepend encoded result with algorithm info HMACSHA256=
            return "HMACSHA256="+signatureBase64
        }
    
        let newsignature = signature(requestTime, secretKey, words, requestTarget);
        let headerSignature = notificationHeader['signature'];

        console.log('================');
        console.log('Check ID API');
        console.log('Host Signature:',newsignature);
        console.log('Client Signature',headerSignature);
        if (newsignature === headerSignature){
            const sql = "SELECT id from "+db_name+" ORDER BY id DESC LIMIT 1";
            db.query(sql, function (err, result){
                if (err) throw err;
                if (result.length == 0){
                    var last_id = 0;
                    logger.error(`${req.originalUrl} - ${req.ip} - last id from ${db_name} adalah ${last_id} `);
                }else if(result.length != 0){
                    var last_id = result[0]['id'];
                    logger.error(`${req.originalUrl} - ${req.ip} - last id from ${db_name} adalah ${last_id} `);
                }else{
                    logger.error(`${req.originalUrl} - ${req.ip} - Exception, Please Check Your Code!`);
                };
                const response = {
                    status: 'success',
                    id: last_id
                };
                res.status(200);
                res.json(response);
            });
        }else{
            const response = {
                status: 'Forbidden',
                message: 'Signature Not Valid'
            };
            res.status(403);
            res.json(response);
            console.log('Invalid Signature');
            logger.error(`${req.originalUrl} - ${req.ip} - Exception, Invalid Signature`);
        }
});

//API GET PRODUCT
router.post('/product', function(req,res){
    const notificationHeader = req.headers;
    var id_prod = req.body.id;
    if(id_prod == null){
        const response = {
            status: 'Failed',
            message: 'Invalid Request'
        };
        res.status(402);
        res.json(response);
        console.log('Invalid Request');
        logger.error(`${req.originalUrl} - ${req.ip} - Exception, Invalid Request`);
        
        res.json("Invalid Request");
    }else if(id_prod != null){
        console.log('not null;')
    }
    let requestTime = notificationHeader['date'];
    let words = 'dilla';
    let secretKey = '080900';
    let requestTarget = "/product";
        function signature(requestTime, secretKey, words, requestTarget){
            let componentSignature = "date:" + requestTime;
            componentSignature += "\n";
            componentSignature += "words:" + words;
            componentSignature += "\n";
            componentSignature += "Request-Target:" + requestTarget;
            console.log(componentSignature);
        var signatureHmacSha256 = CryptoJS.HmacSHA256(componentSignature,secretKey);
        var signatureBase64 = CryptoJS.enc.Base64.stringify(signatureHmacSha256);
    
            // Prepend encoded result with algorithm info HMACSHA256=
            return "HMACSHA256="+signatureBase64
        }
    
        let newsignature = signature(requestTime, secretKey, words, requestTarget);
        let headerSignature = notificationHeader['signature'];

        console.log('================');
        console.log('Host Signature:',newsignature);
        console.log('Client Signature',headerSignature);
        if (newsignature === headerSignature){
            const sql = "SELECT * from product WHERE id ='"+id_prod+"'";
            db.query(sql, function (err, result){
                if (err) throw err;
                if (result.length != 0){
                    console.log(result);
                    const response = {
                        status: 'success',
                        result: result
                    };
                    res.status(200);
                    res.json(response);
                }else if(result.length == 0){
                    const response = {
                        status: 'Failed',
                        message: 'Data Not Found.'
                    };
                    res.status(404);
                    res.json(response);
                    console.log('Data Not Found');
                    logger.error(`${req.originalUrl} - ${req.ip} - Exception, Data Not Found.`);
                }
                
            });
        }else{
            const response = {
                status: 'Forbidden',
                message: 'Signature Not Valid'
            };
            res.status(403);
            res.json(response);
            console.log('Invalid Signature');
            logger.error(`${req.originalUrl} - ${req.ip} - Exception, Invalid Signature`);
        }
});

//API ADD USER
router.post('/add-user', function (req, res) {
    const notificationHeader = req.headers;
    const notificationBody  = JSON.stringify(req.body);

    //create signature Hmacsha256 date+words+digest+requesttarget
    let requestTime = notificationHeader['date'];
    let words = 'dilla';
    let secretKey = '080900';
    console.log(notificationBody);
    let requestTarget = "/add-user";
    function  digest(notificationBody){
        let jsonStringHash256 = crypto
          .createHash('sha256')
          .update(notificationBody, 'utf-8')
          .digest()
        return jsonStringHash256.toString('base64')
      }
      let newdigest = digest(notificationBody);
        function signature(requestTime, secretKey, words, requestTarget, newdigest){
            let componentSignature = "date:" + requestTime;
            componentSignature += "\n";
            componentSignature += "words:" + words;
            componentSignature += "\n";
            componentSignature += "digest:" + newdigest;
            componentSignature += "\n";
            componentSignature += "Request-Target:" + requestTarget;
            console.log(componentSignature);
        var signatureHmacSha256 = CryptoJS.HmacSHA256(componentSignature,secretKey);
        var signatureBase64 = CryptoJS.enc.Base64.stringify(signatureHmacSha256);
    
            // Prepend encoded result with algorithm info HMACSHA256=
            return "HMACSHA256="+signatureBase64
        }
    
        let newsignature = signature(requestTime, secretKey, words, requestTarget, newdigest);
        let headerSignature = notificationHeader['signature'];

        console.log('================');
        console.log('Host Signature:',newsignature);
        console.log('Client Signature',headerSignature);

        //inisiasi data
        logger.info(`${req.originalUrl} - ${req.ip} - ============== Inisiasi Data User =============`);
        let name = req.body.name;
        let invoice_number = req.body.invoice;
        let email = req.body.email;
        let phone = req.body.phone;
        let product_id = req.body.product_id;
        let product_name = req.body.product_name;
        let expired = req.body.expired;

        const init_data = JSON.stringify({
            name: name,
            email: email,
            phone: phone,
            invoice: invoice_number,
            product_id: product_id,
            product_name: product_name,
            expired: expired
        });

        logger.info(`${req.originalUrl} - ${req.ip} - ${init_data}`);
        logger.info(`${req.originalUrl} - ${req.ip} - ============== Save to DB =============`);

        if (headerSignature === newsignature){
            //proses signature

            //create date
            function timeStamp(){
                let date = new Date().toISOString();
                return date.substring(0, 19)+'Z';
            }
            //cek invoice number
            const sqlcheckcustomer  = "SELECT invoice FROM user WHERE invoice='"+invoice_number+"'"
            db.query(sqlcheckcustomer,function (err, result) {
                if (err) throw err;
                if (result.length != 0){

            
                console.log("invoice number is registered");
            // let name = result[0]['name'];
            // let id = result[0]['id'];
                const response = {
                    status:  'Fialed',
                    message:  'invoice number is registered'
                };
                res.status(400);
                res.json(response);
                }else{
                    let words = 'dilla';
                    let secretKey = '080900';
                    let requestTarget = "/check-id";
                    let date = timeStamp();
                    function signature(date, secretKey, words, requestTarget){
                        let componentSignature = "date:" + date;
                        componentSignature += "\n";
                        componentSignature += "words:" + words;
                        componentSignature += "\n";
                        componentSignature += "Request-Target:" + requestTarget;
                    var signatureHmacSha256 = CryptoJS.HmacSHA256(componentSignature,secretKey);
                    var signatureBase64 = CryptoJS.enc.Base64.stringify(signatureHmacSha256);
                    logger.info(`${req.originalUrl} - ${req.ip} - ${componentSignature}`);
                    // Prepend encoded result with algorithm info HMACSHA256=
                    return "HMACSHA256="+signatureBase64
                }
            
                    let newsignature = signature(date, secretKey, words, requestTarget);
                    
        
                    var myHeaders = new Headers();
                    myHeaders.append("date", date);
                    myHeaders.append("signature", newsignature);
        
                    var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    redirect: 'follow'
                    };
        
                    let url4 = process.env.PROD_URL + '/check-id/customer';
                    fetch(url4, requestOptions)
                    .then(response => response.json())
                    .then(result => {
                        console.log(result);
                        var last_id = result.id;
                        console.log(last_id);
                        if(last_id == 1){
                                    let last_id = 1 + 1;
                                    console.log(last_id);
                                    const sql = "INSERT INTO user(id,name,phone,email,product_id,product_name,expired,invoice) VALUES ?";
                                    const values = [[last_id,name,phone,email,product_id,product_name,expired,invoice_number]];
                                    db.query(sql, [values],function (err, result) {
                                        if (err) throw err;
                                        console.log("Number of records inserted: " + result.affectedRows);
                                    // let name = result[0]['name'];
                                    // let id = result[0]['id'];
                                        const response = {
                                            status:  'Success',
                                            message:  'User has been added'
                                        };
                                        res.status(201);
                                        res.json(response);
                                    });
                                    logger.info(`${req.originalUrl} - ${req.ip} - User has been added`);
                                }else if (last_id > 1){
                                    let new_last_id = last_id + 1;
                                    console.log(new_last_id);
                                    const sql = "INSERT INTO user(id,name,phone,email,product_id,product_name,expired,invoice) VALUES ?";
                                    const values = [[new_last_id,name,phone,email,product_id,product_name,expired,invoice_number]];
                                    db.query(sql, [values],function (err, result) {
                                        if (err) throw err;
                                        console.log("Number of records inserted: " + result.affectedRows);
                                    // let name = result[0]['name'];
                                    // let id = result[0]['id'];
                                        const response = {
                                            status:  'Success',
                                            message:  'User has been added'
                                        };
                                        res.status(201);
                                        res.json(response);
                                    });
                                    logger.info(`${req.originalUrl} - ${req.ip} - User has been added`);
                                }else if (last_id < 1){
                                    console.log(last_id);
                                   let newlast_id = last_id + 1;
                                    console.log(newlast_id);
                                    const sql = "INSERT INTO user(id,name,phone,email,product_id,product_name,expired,invoice) VALUES ?";
                                    const values = [[newlast_id,name,phone,email,product_id,product_name,expired,invoice_number]];
                                    db.query(sql, [values],function (err, result) {
                                        if (err) throw err;
                                        console.log("Number of records inserted: " + result.affectedRows);
                                    // let name = result[0]['name'];
                                    // let id = result[0]['id'];
                                        const response = {
                                            status:  'Success',
                                            message:  'User has been added'
                                        };
                                        res.status(201);
                                        res.json(response);
                                    });
                                    logger.info(`${req.originalUrl} - ${req.ip} - User has been added`);
                                }else{
                                    const response = {
                                        status:  'Failed',
                                        message:  'Error! Please Check Your Code!'
                                    };
                                    res.status(501);
                                    res.json(response);
                                    console.log('Invalid Signature');
                                    logger.error(`${req.originalUrl} - ${req.ip} - Exception, Please Check Your Code!`);
                                }
                            })
                    .catch(error => console.log('error', error));
                }
            });
        }else{
            const response = {
                status: 'Forbidden',
                message: 'Signature Not Valid'
            };
            res.status(403);
            res.json(response);
            console.log('Invalid Signature');
            logger.error(`${req.originalUrl} - ${req.ip} - Exception, Invalid Signature`);
        };
});

//API CHECK TRANSACTION
router.post('/check-transaction', function(req, res){
    const notificationHeader = req.headers;
   // const notificationBody  = JSON.stringify(req.body, null, 2);
   const notificationBody  = JSON.stringify(req.body);
    let invoice_number = req.body.invoice;
    let requestTime = notificationHeader['date'];
    let words = 'dilla';
    let secretKey = '080900';
    console.log(invoice_number);
    console.log(notificationBody);
    let requestTarget = "/check-transaction";
    function  digest(notificationBody){
        let jsonStringHash256 = crypto
          .createHash('sha256')
          .update(notificationBody, 'utf-8')
          .digest()
        return jsonStringHash256.toString('base64')
      }
      let newdigest = digest(notificationBody);
        function signature(requestTime, secretKey, words, requestTarget, newdigest){
            let componentSignature = "date:" + requestTime;
            componentSignature += "\n";
            componentSignature += "words:" + words;
            componentSignature += "\n";
            componentSignature += "digest:" + newdigest;
            componentSignature += "\n";
            componentSignature += "Request-Target:" + requestTarget;
            console.log(componentSignature);
        var signatureHmacSha256 = CryptoJS.HmacSHA256(componentSignature,secretKey);
        var signatureBase64 = CryptoJS.enc.Base64.stringify(signatureHmacSha256);
    
            // Prepend encoded result with algorithm info HMACSHA256=
            return "HMACSHA256="+signatureBase64
        }
    
        let newsignature = signature(requestTime, secretKey, words, requestTarget, newdigest);
        let headerSignature = notificationHeader['signature'];

        console.log('================');
        console.log('Host Signature:',newsignature);
        console.log('Client Signature',headerSignature);

        //inisiasi data
        logger.info(`${req.originalUrl} - ${req.ip} - ============== Get Data ${invoice_number} =============`);

        if (headerSignature === newsignature){
                const sql = "SELECT * FROM transaction WHERE invoice_number='"+invoice_number+"'";
                db.query(sql,function (err, result) {
                    if (err) throw err;
                    console.log(result);
                // let name = result[0]['name'];
                // let id = result[0]['id'];
                    const response = {
                        status:  'Success',
                        message:  result
                    };
                    res.status(201);
                    res.json(response);
                });
                logger.info(`${req.originalUrl} - ${req.ip} - Data Collected`);
        }else{
            const response = {
                status: 'Forbidden',
                message: 'Signature Not Valid'
            };
            res.status(403);
            res.json(response);
            console.log('Invalid Signature');
            logger.error(`${req.originalUrl} - ${req.ip} - Exception, Invalid Signature`);
        };
});

router.post('/notification', function(req, res){
    const notificationHeader = req.headers;
        const databody = req.body;
        let invoicenumber2 = databody['external_id'];
        var productnotify = databody['description'];
        var statusnotif = databody['status'];
        if (statusnotif == 'PAID'){
            var newstatus = 'SUCCESS'
        }else{
            var newstatus = 'PENDING'
        }
        console.log(productnotify);
        const response = {
            status: 'Success',
            message: 'Thank You!'
        };
        function getTransactionDate(){
            d = new Date();
            //Tanggal Bulan Tahun
            Tanggalharini = d.getDate();
            Bulan = d.getMonth();
            Tahun = d.getFullYear();
            Hari = d.getDay();
            arrbulan = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
            arrHari = ["Minggu","Senin","Selasa","Rabu","Kamis","Jum`at","Sabtu"];
            //Hari, tanggal bulan tahun
            let transactiondate1 = arrHari[Hari]+', '+Tanggalharini+' '+arrbulan[Bulan]+' '+Tahun;
            return transactiondate1
        }
        let updatedate = getTransactionDate();
        function getExpired(){
            d = new Date();
            //Tanggal Bulan Tahun
            Tanggalharini = d.getDate();
            Bulan = d.getMonth();
            Tahun = d.getFullYear();
            arrbulan = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
            if (productnotify == 'Spotify'){
                var Bulandepan = Bulan + 3;
            }else{
                var Bulandepan = Bulan + 1;
            }
            
            tanggalharini1 = Tanggalharini + 1;
            let transactiondate1 = tanggalharini1+' '+arrbulan[Bulandepan]+' '+Tahun;
            return transactiondate1
        }
        let masa = getExpired();
        console.log(masa);
        console.log(response);
        const sql = "UPDATE transaction SET transaction_update = '"+updatedate+"',status = '"+newstatus+"', expired = '"+masa+"' WHERE invoice_number = '" + invoicenumber2 + "'";
               db.query(sql, function (err, result) {
                   if (err) throw err;
                   console.log("Number of records inserted: " + result.affectedRows);
                 });
        const sqlcheckstatus = "SELECT * from transaction WHERE invoice_number = '" + invoicenumber2 + "'";
                 db.query(sqlcheckstatus, function (err, result) {
                    if (err) throw err;
                    let email = result[0].email;
                    let name = result[0].name;
                    let phone = result[0].phone;
                    let amount = result[0].amount;
                    let product_name = result[0].product_name;
                    let product_id = result[0].product_id;
                    console.log(result);
                     //kirim email
                        const transporter = nodemailer.createTransport({
                            host: "smtp.hostinger.com",
                            port: 465,
                            secure: true,
                            auth: {
                            // TODO: replace `user` and `pass` values from <https://forwardemail.net>
                            user: 'cs@ngahiji.xyz',
                            pass: 'F261396ff.'
                            }
                        });
                        let url = 'localhost:3000/';
                        let invoice = invoicenumber2
                        let layanan = product_name;
                        let date = updatedate;
                        let masaberlaku = masa;

                        //add-user
                        console.log('====== add user =======');
                        let words = 'dilla';
                        let secretKey = '080900';
                        function timeStamp(){
                            let date = new Date().toISOString();
                            return date.substring(0, 19)+'Z';
                        };
                        let dateuser = timeStamp();
                        console.log(invoice);
                        var raw = JSON.stringify({
                            amount: amount,
                            name: name,
                            email: email,
                            phone: phone,
                            product_id: product_id,
                            product_name: layanan,
                            expired: masaberlaku,
                            invoice: invoice
                            });
                            console.log(raw);
                        let requestTargetuser = "/add-user";
                        function  digest(raw){
                            let jsonStringHash256 = crypto
                            .createHash('sha256')
                            .update(raw, 'utf-8')
                            .digest()
                            return jsonStringHash256.toString('base64')
                        }
                        let newdigestuser = digest(raw);
                        console.log(newdigestuser);
                            function signature(dateuser, secretKey, words, requestTargetuser, newdigestuser){
                                let componentSignature = "date:" + dateuser;
                                componentSignature += "\n";
                                componentSignature += "words:" + words;
                                componentSignature += "\n";
                                componentSignature += "digest:" + newdigestuser;
                                componentSignature += "\n";
                                componentSignature += "Request-Target:" + requestTargetuser;
                                console.log(componentSignature);
                            var signatureHmacSha256 = CryptoJS.HmacSHA256(componentSignature,secretKey);
                            var signatureBase64 = CryptoJS.enc.Base64.stringify(signatureHmacSha256);
                        
                                // Prepend encoded result with algorithm info HMACSHA256=
                                return "HMACSHA256="+signatureBase64
                            }
                        
                            let newsignatureuser = signature(dateuser, secretKey, words, requestTargetuser, newdigestuser);

                        var myHeaders = new Headers();
                        myHeaders.append("date", dateuser);
                        myHeaders.append("signature", newsignatureuser);
                        myHeaders.append("Content-Type", "application/json");

                        var requestOptions = {
                        method: 'POST',
                        headers: myHeaders,
                        body: raw,
                        redirect: 'follow'
                        };

                        let url5 = process.env.PROD_URL + '/add-user';
                        fetch(url5, requestOptions)
                        .then(response => response.json())
                        .then(result => {
                            console.log(result);
                            let statususer = result.status;
                            if (statususer === 'Success'){
                                var mailOptions = {
                                    from: 'Ngahiji Customer Service<cs@ngahiji.xyz>',
                                    to: email,
                                    subject: 'Notifikasi Pembayaran.',
                                    html: `
                                    <!DOCTYPE html>
                                    <html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
                                    
                                    <head>
                                        <title></title>
                                        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
                                        <meta name="viewport" content="width=device-width, initial-scale=1.0"><!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]--><!--[if !mso]><!-->
                                        <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet" type="text/css"><!--<![endif]-->
                                        <style>
                                            * {
                                                box-sizing: border-box;
                                            }
                                    
                                            body {
                                                margin: 0;
                                                padding: 0;
                                            }
                                    
                                            a[x-apple-data-detectors] {
                                                color: inherit !important;
                                                text-decoration: inherit !important;
                                            }
                                    
                                            #MessageViewBody a {
                                                color: inherit;
                                                text-decoration: none;
                                            }
                                    
                                            p {
                                                line-height: inherit
                                            }
                                    
                                            .desktop_hide,
                                            .desktop_hide table {
                                                mso-hide: all;
                                                display: none;
                                                max-height: 0px;
                                                overflow: hidden;
                                            }
                                    
                                            .image_block img+div {
                                                display: none;
                                            }
                                    
                                            @media (max-width:620px) {
                                    
                                                .desktop_hide table.icons-inner,
                                                .social_block.desktop_hide .social-table {
                                                    display: inline-block !important;
                                                }
                                    
                                                .icons-inner {
                                                    text-align: center;
                                                }
                                    
                                                .icons-inner td {
                                                    margin: 0 auto;
                                                }
                                    
                                                .image_block img.fullWidth {
                                                    max-width: 100% !important;
                                                }
                                    
                                                .mobile_hide {
                                                    display: none;
                                                }
                                    
                                                .row-content {
                                                    width: 100% !important;
                                                }
                                    
                                                .stack .column {
                                                    width: 100%;
                                                    display: block;
                                                }
                                    
                                                .mobile_hide {
                                                    min-height: 0;
                                                    max-height: 0;
                                                    max-width: 0;
                                                    overflow: hidden;
                                                    font-size: 0px;
                                                }
                                    
                                                .desktop_hide,
                                                .desktop_hide table {
                                                    display: table !important;
                                                    max-height: none !important;
                                                }
                                            }
                                        </style>
                                        <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
                                            <symbol id="one" viewBox="0 0 16 16">
                                                <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2Zm7.283 4.002V12H7.971V5.338h-.065L6.072 6.656V5.385l1.899-1.383h1.312Z"/>
                                            </symbol>
                                            </svg>
                                    </head>
                                    
                                    <body style="background-color: #e2eace; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
                                        <table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #e2eace;">
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                            <tbody>
                                                                <tr>
                                                                    <td>
                                                                        <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000; width: 600px; margin: 0 auto;" width="600">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                                                        <table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                                            <tr>
                                                                                                <td class="pad" style="padding-top:25px;width:100%;padding-right:0px;padding-left:0px;">
                                                                                                    <div class="alignment" align="center" style="line-height:10px"><img class="fullWidth" src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/20/rounder-up.png" style="display: block; height: auto; border: 0; max-width: 600px; width: 100%;" width="600" alt="Image" title="Image"></div>
                                                                                                </td>
                                                                                            </tr>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                        <table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                            <tbody>
                                                                <tr>
                                                                    <td>
                                                                        <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fff; color: #000; width: 600px; margin: 0 auto;" width="600">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                                                        <table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                                            <tr>
                                                                                                <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
                                                                                                    <div class="alignment" align="center" style="line-height:10px">
                                                                                                    </div>
                                                                                                </td>
                                                                                            </tr>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                        <table class="row row-3" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                            <tbody>
                                                                <tr>
                                                                    <td>
                                                                        <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fff; color: #000; width: 600px; margin: 0 auto;" width="600">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                                                        <table class="text_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                                                                            <tr>
                                                                                                <td class="pad">
                                                                                                    <div style="font-family: sans-serif">
                                                                                                        <div class style="font-size: 12px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #0D0D0D; line-height: 1.2;">
                                                                                                            <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 16.8px;"><span style="font-size:28px;"><strong><span style="font-size:28px;">Hello ${name},</span></strong></span><br><span style="font-size:28px;">Selamat pembayaran kamu berhasil.</span></p>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </td>
                                                                                            </tr>
                                                                                        </table>
                                                                                        <table class="image_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                                            <tr>
                                                                                                <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
                                                                                                    <div class="alignment" align="center" style="line-height:10px"><img src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/20/divider.png" style="display: block; height: auto; border: 0; max-width: 316px; width: 100%;" width="316" alt="Image" title="Image"></div>
                                                                                                </td>
                                                                                            </tr>
                                                                                        </table>
                                                                                        <table class="text_block block-3" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                                                                            <tr>
                                                                                                <td class="pad">
                                                                                                    <div style="font-family: sans-serif">
                                                                                                        <div class style="font-size: 12px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; mso-line-height-alt: 18px; color: #555555; line-height: 1.5;">
                                                                                                            <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 21px;">Invoice : <span style="color:#000000;font-size:14px;"><strong>${invoice}<br></strong></span>Layanan : <span style="color:#000000;font-size:14px;"><strong>${layanan}<br></strong></span>Masa Berlaku : <span style="color:#000000;font-size:14px;"><strong>${masaberlaku}<br></strong></span>Waktu Transaksi : <span style="color:#000000;font-size:14px;"><strong>${date}<br></strong></span></p>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </td>
                                                                                            </tr>
                                                                                        </table>
                                                                                        <table class="text_block block-4" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                                                                            <tr>
                                                                                                <td class="pad" style="padding-bottom:10px;padding-left:10px;padding-right:10px;padding-top:20px;">
                                                                                                    <div style="font-family: sans-serif">
                                                                                                        <div class style="font-size: 12px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; mso-line-height-alt: 18px; color: #0D0D0D; line-height: 1.5;">
                                                                                                            <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 21px;">Terima Kasih, ngahiji akan segera menghubungimu.<br>Cek selalu notifikasi email dan whatsapp mu ya.</p>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </td>
                                                                                            </tr>
                                                                                        </table>
                                                                                        <table class="button_block block-5" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                                            <tr>
                                                                                                <td class="pad" style="padding-bottom:10px;padding-left:10px;padding-right:10px;padding-top:25px;text-align:center;">
                                                                                                    <div class="alignment" align="center"><!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" style="height:62px;width:204px;v-text-anchor:middle;" arcsize="7%" stroke="false" fillcolor="#a8bf6f"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#ffffff; font-family:'Trebuchet MS', Tahoma, sans-serif; font-size:16px"><![endif]-->
                                                                                                        <div style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#000000;border-radius:4px;width:auto;border-top:0px solid transparent;font-weight:undefined;border-right:0px solid transparent;border-bottom:0px solid transparent;border-left:0px solid transparent;padding-top:15px;padding-bottom:15px;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;font-size:16px;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:15px;padding-right:15px;font-size:16px;display:inline-block;letter-spacing:normal;"><a href="https://wa.me/6283847172217?text=Halo%20ka,%20pesananku%20dengan%20invoice%20${invoice}%20sudah%20success"><span style="word-break: break-word; line-height: 32px; color: #ffffff;">Hubungi admin.</span></a</span></div><!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
                                                                                                    </div>
                                                                                                </td>
                                                                                            </tr>
                                                                                        </table>
                                                                                        <div class="spacer_block block-6" style="height:40px;line-height:40px;font-size:1px;">&#8202;</div>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                        <table class="row row-4" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                            <tbody>
                                                                <tr>
                                                                    <td>
                                                                        <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #525252; color: #000; width: 600px; margin: 0 auto;" width="600">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td class="column column-1" width="33.333333333333336%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                                                        
                                                                                    </td>
                                                                                    <td class="column column-2" width="33.333333333333336%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                                                        <table class="text_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                                                                            <tr>
                                                                                                <td class="pad" style="padding-top:20px;">
                                                                                                    <div style="font-family: sans-serif">
                                                                                                        <div class style="font-size: 12px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #a8bf6f; line-height: 1.2;">
                                                                                                            <p style="margin: 0; font-size: 12px; text-align: center; mso-line-height-alt: 14.399999999999999px;"><span style="color:#ffffff;font-size:12px;"><span style="font-size:12px;color:#ffffff;">@2023 Ngahiji 1.0.0</span></span><br><span style="color:#ffffff;font-size:12px;"><span style="font-size:12px;color:#ffffff;">cs@ngahiji.xyz</span></span><br></p>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </td>
                                                                                            </tr>
                                                                                        </table>
                                                                                    </td>
                                                                                    <td class="column column-3" width="33.333333333333336%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                        <table class="row row-5" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                            <tbody>
                                                                <tr>
                                                                    <td>
                                                                        <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000; width: 600px; margin: 0 auto;" width="600">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                                                        <table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                                            <tr>
                                                                                                <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
                                                                                                    <div class="alignment" align="center" style="line-height:10px"><img class="fullWidth" src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/20/rounder-dwn.png" style="display: block; height: auto; border: 0; max-width: 600px; width: 100%;" width="600" alt="Image" title="Image"></div>
                                                                                                </td>
                                                                                            </tr>
                                                                                        </table>
                                                                                        <div class="spacer_block block-2" style="height:60px;line-height:60px;font-size:1px;">&#8202;</div>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                        <table class="row row-6" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                            <tbody>
                                                                <tr>
                                                                    <td>
                                                                        <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000; width: 600px; margin: 0 auto;" width="600">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                                                        <table class="icons_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                                            <tr>
                                                                                                <td class="pad" style="vertical-align: middle; color: #9d9d9d; font-family: inherit; font-size: 15px; padding-bottom: 5px; padding-top: 5px; text-align: center;">
                                                                                                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                                                        <tr>
                                                                                                            <td class="alignment" style="vertical-align: middle; text-align: center;"><!--[if vml]><table align="left" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><![endif]-->
                                                                                                                <!--[if !vml]><!-->
                                                                                                            </td>
                                                                                                        </tr>
                                                                                                    </table>
                                                                                                </td>
                                                                                            </tr>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table><!-- End -->
                                    </body>
                                    
                                    </html>`
                                };
                                
                                transporter.sendMail(mailOptions, (err, info) => {
                                    if (err) throw err;
                                    console.log('Email sent: ' + info.response);
                                });
                                console.log(name,email,date,layanan);

                                var myHeaders = new Headers();
                                myHeaders.append("Content-Type", "application/json");

                                var raw = JSON.stringify({
                                "invoice": invoicenumber2,
                                "name": name,
                                "emailcustomer": email,
                                "phone": phone,
                                "layanan": layanan,
                                "dateexpired": masaberlaku,
                                "date": date
                                });

                                var requestOptions = {
                                method: 'POST',
                                headers: myHeaders,
                                body: raw,
                                redirect: 'follow'
                                };

                                let url6 = process.env.PROD_URL + '/notifadmin';
                                fetch(url6, requestOptions)
                                .then(response => response.text())
                                .then(result => console.log(result))
                                .catch(error => console.log('error', error));
                            }else{
                                let aku = 'kamu';
                                console.log(aku);
                            }
                        })
                        .catch(error => console.log('error', error));
                        // async..await is not allowed in global scope, must use a wrapper
                            // send mail with defined transport object
                            


                            
                 });
        res.status(200);
        res.json(response);
    
});

//FRONTEND

//HOME
router.get('/', function(req, res){
    res.render('home');
});

router.get('/checkout/:product', function(req, res){
    var product = req.params.product;
    if(product == 'netflix'){
        var product_id = 1;
    } else if(product == 'disney'){
        var product_id = 2;
    }else if(product == 'youtube'){
        var product_id = 3;
    }else if(product == 'spotify'){
        var product_id = 4;
    }else if(product == 'primevideo'){
        var product_id = 5;
    }else if(product == 'applemusic'){
        var product_id = 6;
    }else if(product == 'canva'){
        var product_id = 7;
    }else if(product == 'hbo'){
        var product_id = 8;
    }else{
        res.render('notfound');
    };
    //prepare data
    function timeStamp(){
        let date = new Date().toISOString();
        return date.substring(0, 19)+'Z';
    };
    let requestTime = timeStamp();
    let words = 'dilla';
    let secretKey = '080900';
    let requestTarget = "/product";
    const Body = JSON.stringify({
        id: product_id
        });
    console.log(Body);
    
      function signature(requestTime, secretKey, words, requestTarget){
        let componentSignature = "date:" + requestTime;
        componentSignature += "\n";
        componentSignature += "words:" + words;
        componentSignature += "\n";
        componentSignature += "Request-Target:" + requestTarget;
        console.log(componentSignature);
        var signatureHmacSha256 = CryptoJS.HmacSHA256(componentSignature,secretKey);
        var signatureBase64 = CryptoJS.enc.Base64.stringify(signatureHmacSha256);

            // Prepend encoded result with algorithm info HMACSHA256=
            return "HMACSHA256="+signatureBase64
        }
    
        let newsignature = signature(requestTime, secretKey, words, requestTarget);
    //get product
    var myHeaders = new Headers();
    myHeaders.append("date", requestTime);
    myHeaders.append("signature", newsignature);
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: Body,
    redirect: 'follow'
    };

    let url1 = process.env.PROD_URL + '/product'

    fetch(url1, requestOptions)
    .then(response => response.json())
    .then(result => {
        console.log(result);
        let new_product_id = result.result[0].id;
        let new_product_name = result.result[0].name;
        let new_product_price = result.result[0].price;
        let new_product_price_before = result.result[0].price_before;
        let new_product_price_before_split = result.result[0].price_before_split;
        let masa = result.result[0].masa;
        let image = result.result[0].image;
        let admin_price = result.result[0].admin;
        console.log(new_product_name);

        //format rupiah
        

        data = {
            status: 'test',
            name: new_product_name,
            price: new_product_price,
            price_before: new_product_price_before,
            price_before_split: new_product_price_before_split,
            image: image,
            masa: masa,
            admin: admin_price
        };
        res.render('checkout',{new_product_id,new_product_name,new_product_price,new_product_price_before,new_product_price_before_split,masa,image,admin_price});
    })
    .catch(error => console.log('error', error));
        
});

router.get('/result/:invoice', function(req, res){
    let invoice = req.params.invoice;
    //hit API Check transaction
    let words = 'dilla';
    let secretKey = '080900';
    function timeStamp(){
        let date = new Date().toISOString();
        return date.substring(0, 19)+'Z';
    };
    let date = timeStamp();
    console.log(invoice);
    var raw = JSON.stringify({
        invoice: invoice
        });
    let requestTarget = "/check-transaction";
    function  digest(raw){
        let jsonStringHash256 = crypto
          .createHash('sha256')
          .update(raw, 'utf-8')
          .digest()
        return jsonStringHash256.toString('base64')
      }
      let newdigest = digest(raw);
        function signature(date, secretKey, words, requestTarget, newdigest){
            let componentSignature = "date:" + date;
            componentSignature += "\n";
            componentSignature += "words:" + words;
            componentSignature += "\n";
            componentSignature += "digest:" + newdigest;
            componentSignature += "\n";
            componentSignature += "Request-Target:" + requestTarget;
            console.log(componentSignature);
        var signatureHmacSha256 = CryptoJS.HmacSHA256(componentSignature,secretKey);
        var signatureBase64 = CryptoJS.enc.Base64.stringify(signatureHmacSha256);
    
            // Prepend encoded result with algorithm info HMACSHA256=
            return "HMACSHA256="+signatureBase64
        }
    
        let newsignature = signature(date, secretKey, words, requestTarget, newdigest);
    var myHeaders = new Headers();
    myHeaders.append("date", date);
    myHeaders.append("signature", newsignature);
    myHeaders.append("Content-Type", "application/json");
    console.log(raw);
    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    let url2 = 'http://localhost:3000' + '/check-transaction';
    fetch(url2, requestOptions)
    .then(response => response.json())
    .then(result => {
        console.log(result);
        //kondisi if status success
        let status = result.message[0].status;
        let tanggaltransaksi = result.message[0].transaction_date;
        let product_name = result.message[0].product_name;
        
        let username = result.message[0].name;

        let detail = product_name + ' hingga ' + expired;
        if (status == 'SUCCESS'){
            var thanks = 'Terimakasih';
            var hingga = 'hingga';
            var words1 = 'ngahiji akan segera kirim akses layanan premium kamu.';
            var expired = result.message[0].expired;
        }else{
            var thanks = 'Mohon cek email ya';
            var words1 = 'kami mengirimkan link pembayaran.';
            var expired = ' ';
            var hingga = ' ';
        }
        res.render('result',{status,tanggaltransaksi, invoice, words1, detail, username, thanks, expired, hingga, product_name});
        console.log(status);
        //if status pending
        //else
        
    })
    .catch(error => console.log('error', error));
});

router.get('/tnc', function(req, res){
        res.render('tnc');
});

router.get('/skema-harga', function(req, res){
        res.render('skema');
});


//TESTING

router.get('/mail', function(req, res){
    const transporter = nodemailer.createTransport({
        host: "smtp.hostinger.com",
        port: 465,
        secure: true,
        auth: {
          // TODO: replace `user` and `pass` values from <https://forwardemail.net>
          user: 'cs@ngahiji.xyz',
          pass: 'F261396ff.'
        }
      });
      let url = "https://sandbox.doku.com/checkout/link/e9f3e71834d3449f978e0428955e3e7320233204183201776";
      let invoice = 'INV-NGAHIJI-xxxxx'
      let name = 'Dilla';
      let email = 'm.alif@doku.com';
      let layanan = 'netflix';
      let date = 'Kamis, 23 Januari 2022';
      
      // async..await is not allowed in global scope, must use a wrapper
        // send mail with defined transport object
        var mailOptions = {
            from: 'Ngahiji Customer Service<cs@ngahiji.xyz>',
            to: email,
            subject: 'Pengingat Pembayaran.',
            html: `
            <!DOCTYPE html>
            <html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
            
            <head>
                <title></title>
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0"><!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]--><!--[if !mso]><!-->
                <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet" type="text/css"><!--<![endif]-->
                <style>
                    * {
                        box-sizing: border-box;
                    }
            
                    body {
                        margin: 0;
                        padding: 0;
                    }
            
                    a[x-apple-data-detectors] {
                        color: inherit !important;
                        text-decoration: inherit !important;
                    }
            
                    #MessageViewBody a {
                        color: inherit;
                        text-decoration: none;
                    }
            
                    p {
                        line-height: inherit
                    }
            
                    .desktop_hide,
                    .desktop_hide table {
                        mso-hide: all;
                        display: none;
                        max-height: 0px;
                        overflow: hidden;
                    }
            
                    .image_block img+div {
                        display: none;
                    }
            
                    @media (max-width:620px) {
            
                        .desktop_hide table.icons-inner,
                        .social_block.desktop_hide .social-table {
                            display: inline-block !important;
                        }
            
                        .icons-inner {
                            text-align: center;
                        }
            
                        .icons-inner td {
                            margin: 0 auto;
                        }
            
                        .image_block img.fullWidth {
                            max-width: 100% !important;
                        }
            
                        .mobile_hide {
                            display: none;
                        }
            
                        .row-content {
                            width: 100% !important;
                        }
            
                        .stack .column {
                            width: 100%;
                            display: block;
                        }
            
                        .mobile_hide {
                            min-height: 0;
                            max-height: 0;
                            max-width: 0;
                            overflow: hidden;
                            font-size: 0px;
                        }
            
                        .desktop_hide,
                        .desktop_hide table {
                            display: table !important;
                            max-height: none !important;
                        }
                    }
                </style>
                <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
                    <symbol id="one" viewBox="0 0 16 16">
                        <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2Zm7.283 4.002V12H7.971V5.338h-.065L6.072 6.656V5.385l1.899-1.383h1.312Z"/>
                      </symbol>
                    </svg>
            </head>
            
            <body style="background-color: #e2eace; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
                <table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #e2eace;">
                    <tbody>
                        <tr>
                            <td>
                                <table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                    <tbody>
                                        <tr>
                                            <td>
                                                <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000; width: 600px; margin: 0 auto;" width="600">
                                                    <tbody>
                                                        <tr>
                                                            <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                                <table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                    <tr>
                                                                        <td class="pad" style="padding-top:25px;width:100%;padding-right:0px;padding-left:0px;">
                                                                            <div class="alignment" align="center" style="line-height:10px"><img class="fullWidth" src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/20/rounder-up.png" style="display: block; height: auto; border: 0; max-width: 600px; width: 100%;" width="600" alt="Image" title="Image"></div>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                    <tbody>
                                        <tr>
                                            <td>
                                                <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fff; color: #000; width: 600px; margin: 0 auto;" width="600">
                                                    <tbody>
                                                        <tr>
                                                            <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                                <table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                    <tr>
                                                                        <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
                                                                            <div class="alignment" align="center" style="line-height:10px">
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <table class="row row-3" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                    <tbody>
                                        <tr>
                                            <td>
                                                <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fff; color: #000; width: 600px; margin: 0 auto;" width="600">
                                                    <tbody>
                                                        <tr>
                                                            <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                                <table class="text_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                                                    <tr>
                                                                        <td class="pad">
                                                                            <div style="font-family: sans-serif">
                                                                                <div class style="font-size: 12px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #0D0D0D; line-height: 1.2;">
                                                                                    <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 16.8px;"><span style="font-size:28px;"><strong><span style="font-size:28px;">Hello ${name},</span></strong></span><br><span style="font-size:28px;">pesananmu berhasil dibuat.</span></p>
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                                <table class="image_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                    <tr>
                                                                        <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
                                                                            <div class="alignment" align="center" style="line-height:10px"><img src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/20/divider.png" style="display: block; height: auto; border: 0; max-width: 316px; width: 100%;" width="316" alt="Image" title="Image"></div>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                                <table class="text_block block-3" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                                                    <tr>
                                                                        <td class="pad">
                                                                            <div style="font-family: sans-serif">
                                                                                <div class style="font-size: 12px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; mso-line-height-alt: 18px; color: #555555; line-height: 1.5;">
                                                                                    <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 21px;">Invoice : <span style="color:#000000;font-size:14px;"><strong>${invoice}<br></strong></span>Layanan : <span style="color:#000000;font-size:14px;"><strong>${layanan}<br></strong></span>Waktu : <span style="color:#000000;font-size:14px;"><strong>${date}<br></strong></span></p>
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                                <table class="text_block block-4" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                                                    <tr>
                                                                        <td class="pad" style="padding-bottom:10px;padding-left:10px;padding-right:10px;padding-top:20px;">
                                                                            <div style="font-family: sans-serif">
                                                                                <div class style="font-size: 12px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; mso-line-height-alt: 18px; color: #0D0D0D; line-height: 1.5;">
                                                                                    <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 21px;">Yuk selesaikan pembayaranmu.<br>klik tombol di bawah ini untuk melakukan pembayaran.</p>
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                                <table class="button_block block-5" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                    <tr>
                                                                        <td class="pad" style="padding-bottom:10px;padding-left:10px;padding-right:10px;padding-top:25px;text-align:center;">
                                                                            <div class="alignment" align="center"><!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" style="height:62px;width:204px;v-text-anchor:middle;" arcsize="7%" stroke="false" fillcolor="#a8bf6f"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#ffffff; font-family:'Trebuchet MS', Tahoma, sans-serif; font-size:16px"><![endif]-->
                                                                                <div style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#000000;border-radius:4px;width:auto;border-top:0px solid transparent;font-weight:undefined;border-right:0px solid transparent;border-bottom:0px solid transparent;border-left:0px solid transparent;padding-top:15px;padding-bottom:15px;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;font-size:16px;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:15px;padding-right:15px;font-size:16px;display:inline-block;letter-spacing:normal;"><a href="${url}"><span style="word-break: break-word; line-height: 32px; color: #ffffff;">Selesaikan Pembayaran.</span></a></span></div><!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                                <div class="spacer_block block-6" style="height:40px;line-height:40px;font-size:1px;">&#8202;</div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <table class="row row-4" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                    <tbody>
                                        <tr>
                                            <td>
                                                <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #525252; color: #000; width: 600px; margin: 0 auto;" width="600">
                                                    <tbody>
                                                        <tr>
                                                            <td class="column column-1" width="33.333333333333336%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                                
                                                            </td>
                                                            <td class="column column-2" width="33.333333333333336%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                                <table class="text_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                                                    <tr>
                                                                        <td class="pad" style="padding-top:20px;">
                                                                            <div style="font-family: sans-serif">
                                                                                <div class style="font-size: 12px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #a8bf6f; line-height: 1.2;">
                                                                                    <p style="margin: 0; font-size: 12px; text-align: center; mso-line-height-alt: 14.399999999999999px;"><span style="color:#ffffff;font-size:12px;"><span style="font-size:12px;color:#ffffff;">@2023 Ngahiji 1.0.0</span></span><br><span style="color:#ffffff;font-size:12px;"><span style="font-size:12px;color:#ffffff;">cs@ngahiji.xyz</span></span><br></p>
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                            <td class="column column-3" width="33.333333333333336%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <table class="row row-5" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                    <tbody>
                                        <tr>
                                            <td>
                                                <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000; width: 600px; margin: 0 auto;" width="600">
                                                    <tbody>
                                                        <tr>
                                                            <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                                <table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                    <tr>
                                                                        <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
                                                                            <div class="alignment" align="center" style="line-height:10px"><img class="fullWidth" src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/20/rounder-dwn.png" style="display: block; height: auto; border: 0; max-width: 600px; width: 100%;" width="600" alt="Image" title="Image"></div>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                                <div class="spacer_block block-2" style="height:60px;line-height:60px;font-size:1px;">&#8202;</div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <table class="row row-6" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                    <tbody>
                                        <tr>
                                            <td>
                                                <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000; width: 600px; margin: 0 auto;" width="600">
                                                    <tbody>
                                                        <tr>
                                                            <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                                <table class="icons_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                    <tr>
                                                                        <td class="pad" style="vertical-align: middle; color: #9d9d9d; font-family: inherit; font-size: 15px; padding-bottom: 5px; padding-top: 5px; text-align: center;">
                                                                            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                                <tr>
                                                                                    <td class="alignment" style="vertical-align: middle; text-align: center;"><!--[if vml]><table align="left" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><![endif]-->
                                                                                        <!--[if !vml]><!-->
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table><!-- End -->
            </body>
            
            </html>`
        };
        
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) throw err;
            console.log('Email sent: ' + info.response);
        });
      
});

router.get('/mailexample', function(req, res){
    res.render('mail');
});

router.get('/date', function(req, res){
    function transactiondate() {
        d = new Date();
        Hari = d.getDay();
        Tanggal = d.getDate();
        Bulan = d.getMonth();
        Tahun = d.getFullYear();
        Jam = d.getHours();
        Menit = d.getMinutes();
        Detik = d.getSeconds();
        arrbulan = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
        arrHari = ["Minggu","Senin","Selasa","Rabu","Kamis","Jum'at","Sabtu"];
        let transactiondate1 = arrHari[Hari] + ', ' + Tanggal + ' ' + arrbulan[Bulan] + ' ' + Tahun + ' ' + Jam +':'+ Menit +':'+ Detik;
        return transactiondate1
       }
    function getExpired(){
        d = new Date();
        //Tanggal Bulan Tahun
        Tanggalharini = d.getDate();
        Bulan = d.getMonth();
        Tahun = d.getFullYear();
        arrbulan = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
        Bulandepan = Bulan + 1;
        let transactiondate1 = Tanggalharini + ' ' + arrbulan[Bulan]+' '+Tahun+' | '+Tanggalharini+' '+arrbulan[Bulandepan]+' '+Tahun;
        return transactiondate1
    }
    let hari = getExpired();
    let transaction_date = transactiondate();
    console.log(hari);
    console.log(transaction_date);
    res.send(transaction_date);
});

router.get('/testgetemail', function(req, res){
                invoicenumber2 = 'INV-NGAHIJI-DIECCFJCDA';
                const sqlcheckstatus = "SELECT * from transaction WHERE invoice_number = '" + invoicenumber2 + "'";
                 db.query(sqlcheckstatus, function (err, result) {
                    if (err) throw err;
                    let email = result[0].email;
                    let name = result[0].name;
                    let product_name = result[0].product_name;
                    console.log(result);
                    console.log(email, name, product_name);
                    res.send(email);
                 });
});

router.get('/wa', function(req, res){
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
      
      fetch("https://api.whatsapp.com/send/?phone=6283847172217&text=Halo+ka%2C+pesananku+dengan+invoice+INV-xx+sudah+success.&type=phone_number&app_absent=0", requestOptions)
        .then(response => response.text())
        .then(result => {
            console.log(result),
            res.send(result)
        })
        .catch(error => console.log('error', error));
});

router.post('/notifadmin', function(req, res){
    const transporter = nodemailer.createTransport({
        host: "smtp.hostinger.com",
        port: 465,
        secure: true,
        auth: {
          // TODO: replace `user` and `pass` values from <https://forwardemail.net>
          user: 'cs@ngahiji.xyz',
          pass: 'F261396ff.'
        }
      });
      let invoice = req.body.invoice;
      let name = req.body.name;
      let email = 'admin@ngahiji.xyz';
      let emailcustomer = req.body.emailcustomer;
      let phone = req.body.phone;
      let layanan = req.body.layanan;
      let dateexpired = req.body.dateexpired;
      let date = req.body.date;
      
      // async..await is not allowed in global scope, must use a wrapper
        // send mail with defined transport object
        var mailOptions = {
            from: 'Ngahiji Customer Service<cs@ngahiji.xyz>',
            to: email,
            subject: 'Payment Success '+invoice,
            html: `
            <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Document</title>
                </head>
                <body>
                    <div class="container">
                        <div class="row">
                        <div class="col text-center">
                        <h1>Hi Admin, berikut datanya.</h1>
                            <p>Invoice Number : <b>${invoice}</b></p>
                            <p>Name : <b>${name}</b></p>
                            <p>E-mail : <b>${emailcustomer}</b></p>
                            <p>Phone : <b>${phone}</b></p>
                            <p>Layanan : <b>${layanan}</b></p>
                            <p>Masa Berakhir : <b>${dateexpired}</b></p>
                            <p>Tanggal Transaksi : <b>${date}</b></p>
                        </div>
                        </div>
                    </div>
                </body>
                </html>
            `
        };
        
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) throw err;
            res.send('OK');
            console.log('Email sent: ' + info.response);
        });
});

router.get('/mailexp', function(req, res){
    res.render('emailexp')
});

router.get('/tryxendit', function(req, res){
    function authenticateUser(user, password){
            var token = user + ":" + password;
            var hash = btoa(token);

            return "Basic " + hash;
        };
        let userprod = 'xnd_production_mgLjR8teaeHNRWS4ignx0geUPdEW8q8JSwdzMeIxKctZwtq7XKzClefirFAbj';
        let usersatging = 'xnd_development_VANcrBN1Ij02PFeYpo2JmGKZkt9p27Nxn2UpwACARx1PjvOfY5Ob32fjSHcEI8r'
        let pass = ''
    let authorization = authenticateUser(usersatging,pass);
    console.log(authorization);
    function randomData(){
        let result           = '';
        let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = 10;
        for ( let i = 0; i < charactersLength; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    let random = randomData();
    let invoice_number = "INV-NGAHIJI-"+random;
    var axios = require('axios');
        var data = JSON.stringify({
        "external_id": invoice_number,
        "amount": 10000,
        "payer_email": "customer@domain.com",
        "description": "Invoice Demo #123",
        "customer": {
            "given_names": "John",
            "surname": "Doe",
            "email": "johndoe@example.com",
            "mobile_number": "+6285156908726",
            "addresses": [
            {
                "city": "Jakarta Selatan",
                "country": "Indonesia",
                "postal_code": "12345",
                "state": "Daerah Khusus Ibukota Jakarta",
                "street_line1": "Jalan Makan",
                "street_line2": "Kecamatan Kebayoran Baru"
            }]},
        "success_redirect_url": "https://www.google.com",
        "failure_redirect_url": "https://www.google.com"
        });

        var config = {
        method: 'post',
        url: 'https://api.xendit.co/v2/invoices',
        headers: { 
            'Content-Type': 'application/json', 
            'Authorization': authorization, 
            'Cookie': 'incap_ses_1560_2182539=rXd6N9Tb50p320KkIjymFTnV2WQAAAAAW+pTOO3MMvzSAX6oVNa9XA==; nlbi_2182539=z5FlD+H83xY9ABT8tAof7AAAAAAsu9TZikfZHPVY74whP0hy'
        },
        data : data
        };

        axios(config)
        .then(function (response) {
        let urlinv = response.data.invoice_url
        res.send(urlinv),
        console.log(JSON.stringify(response.data))
        })
        .catch(function (error) {
        console.log(error);
        });


});

router.post('/notifxendit', function(req, res){
    var body = req.body;
    var header = req.header;
    console.log(body);
    console.log(header);
    res.send('OK');
});


module.exports = router;