import { MigrationInterface, QueryRunner } from "typeorm";

export class InsertInitialData1722104440906 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `INSERT INTO "user" (username, password) VALUES ('user', 'pass');`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DELETE FROM "user" WHERE username='userTeste';`
        );
    }

}
