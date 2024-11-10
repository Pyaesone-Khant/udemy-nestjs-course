import { DataSource } from "typeorm";

export default new DataSource({
    type: 'postgres',
    host: '',
    port: 5432,
    username: '',
    password: '',
    database: '',
    entities: ['**/*.entity.js'],
    migrations: ['migrations/*.js'],
})