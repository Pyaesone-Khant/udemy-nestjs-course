import { ConfigService } from "@nestjs/config";
import { DataSource } from "typeorm";

export async function dropDatabase(config: ConfigService): Promise<void> {
    // create connection to the database
    const AppDataSource = await new DataSource({
        type: 'postgres',
        host: config.get('database.host'),
        port: config.get('database.port'),
        username: config.get('database.user'),
        password: config.get('database.password'),
        database: config.get('database.name'),
        synchronize: config.get('database.synchronize'),
    }).initialize();
    // drop all the tables in the database
    await AppDataSource.dropDatabase();

    // clear the connection
    await AppDataSource.destroy();
}