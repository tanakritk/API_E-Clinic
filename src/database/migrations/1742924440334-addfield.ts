import { MigrationInterface, QueryRunner } from "typeorm";

export class Addfield1742924440334 implements MigrationInterface {
    name = 'Addfield1742924440334'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "TRN_StrategicPlan" ADD "TypeFile" nvarchar(100) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "TRN_StrategicPlan" DROP COLUMN "TypeFile"`);
    }

}
