import { MigrationInterface, QueryRunner } from "typeorm";

export class PasswordUpdate1690217293664 implements MigrationInterface {
    name = 'PasswordUpdate1690217293664'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "password" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
    }

}
