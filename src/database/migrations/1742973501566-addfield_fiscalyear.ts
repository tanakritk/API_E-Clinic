import { MigrationInterface, QueryRunner } from "typeorm";

export class AddfieldFiscalyear1742973501566 implements MigrationInterface {
    name = 'AddfieldFiscalyear1742973501566'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "TRN_StrategicPlan" ADD "FiscalYear" nvarchar(10) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "TRN_StrategicPlan" DROP COLUMN "FiscalYear"`);
    }

}
