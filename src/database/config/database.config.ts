import { configDotenv } from "dotenv";
import { DataSource, DataSourceOptions } from "typeorm";

configDotenv({ path: '.env' });

const dataSourceOption: DataSourceOptions = {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 3306,
    password: process.env.DB_PASSWORD,
    username: process.env.DB_USERNAME,
    entities: ['dist/database/entities/*.entity{.ts,.js}'],
    database: process.env.DB_NAME,
    synchronize: true,  // sync schema  ถ้าเริ่มใช้ migration เมื่อไหร่ ให้ค่าเป็น false
    // migrations: ['dist/database/migrations/*.js'],
    connectTimeout: 3000000,  // 5 min
    extra: {
        connectAttributes: {
            max_allowed_packet: '2gb' // หรือขนาดที่คุณต้องการ
        }
    },
    // dropSchema: true,
    // logging: true
}
const dataSource = new DataSource(dataSourceOption)
export { dataSourceOption }
export default dataSource