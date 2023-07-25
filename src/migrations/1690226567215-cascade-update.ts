import { MigrationInterface, QueryRunner } from "typeorm";

export class CascadeUpdate1690226567215 implements MigrationInterface {
    name = 'CascadeUpdate1690226567215'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_55d9c167993fed3f375391c8e31"`);
        await queryRunner.query(`ALTER TABLE "blogs" DROP CONSTRAINT "FK_50205032574e0b039d655f6cfd3"`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_55d9c167993fed3f375391c8e31" FOREIGN KEY ("blogId") REFERENCES "blogs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blogs" ADD CONSTRAINT "FK_50205032574e0b039d655f6cfd3" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blogs" DROP CONSTRAINT "FK_50205032574e0b039d655f6cfd3"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_55d9c167993fed3f375391c8e31"`);
        await queryRunner.query(`ALTER TABLE "blogs" ADD CONSTRAINT "FK_50205032574e0b039d655f6cfd3" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_55d9c167993fed3f375391c8e31" FOREIGN KEY ("blogId") REFERENCES "blogs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
