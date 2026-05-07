.env   file
APP_PORT=9001
APP_JWT_SIGNATURE='AIP-Strategy'
APP_PASSWORD_KEY='AIP-Strategy'

DB_HOST='43.229.134.141'
DB_PORT=1433
DB_USERNAME='usr_aip_strategy'
DB_PASSWORD='h2Jj4YRZcKPC'
DB_NAME='AIP_Strategy'

FTP_HOST='43.229.134.141'
FTP_PORT=22
FTP_USERNAME='DEMONINTEX\sftp-aip-strategy'
FTP_PASSWORD='lec6hKtIvH9r'




การ run migration 
- yarn migration:generate -- ./src/database/migrations/testMigration        => เปลี่ยนแค่ชื่อไฟล์ด้านหลัง(testMigration)
- yarn migration:run                                                        => คำสั่งนี้จะแก้ไข table จริง บน database 


