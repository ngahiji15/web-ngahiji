const { format, createLogger, transports } = require('winston');
const { combine, timestamp, printf } = format;

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

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
  let transactiondate1 = arrHari[Hari] + ', ' + Tanggal + ' ' + arrbulan[Bulan] + ' ' + Tahun;
  return transactiondate1
 }

var filename = transactiondate();

exports.logger = createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    myFormat
  ),
  transports: [
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/'+filename+'.log' })
  ]
});