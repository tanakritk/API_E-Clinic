import { MigrationInterface, QueryRunner } from "typeorm";

export class TestMigration1742921823318 implements MigrationInterface {
    name = 'TestMigration1742921823318'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "TRN_StrategicPlan" ADD "Name" nvarchar(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "TRN_StrategicPlan" ADD "Path" nvarchar(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "TRN_StrategicPlan" ADD "OriginalName" nvarchar(100) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "TRN_StrategicPlan" DROP COLUMN "OriginalName"`);
        await queryRunner.query(`ALTER TABLE "TRN_StrategicPlan" DROP COLUMN "Path"`);
        await queryRunner.query(`ALTER TABLE "TRN_StrategicPlan" DROP COLUMN "Name"`);
    }

}
