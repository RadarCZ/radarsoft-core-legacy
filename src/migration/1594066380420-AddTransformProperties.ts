import {MigrationInterface, QueryRunner} from "typeorm";

export class AddTransformProperties1594066380420 implements MigrationInterface {
    name = 'AddTransformProperties1594066380420'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "queue_entry" ALTER COLUMN "artistName" SET DEFAULT null`, undefined);
			await queryRunner.query(`ALTER TABLE "base64_sticker_template" ADD "ttA" real NOT NULL`, undefined);
			await queryRunner.query(`ALTER TABLE "base64_sticker_template" ADD "ttB" real NOT NULL`, undefined);
			await queryRunner.query(`ALTER TABLE "base64_sticker_template" ADD "ttC" real NOT NULL`, undefined);
			await queryRunner.query(`ALTER TABLE "base64_sticker_template" ADD "ttD" real NOT NULL`, undefined);
			await queryRunner.query(`ALTER TABLE "base64_sticker_template" ADD "ttE" real NOT NULL`, undefined);
			await queryRunner.query(`ALTER TABLE "base64_sticker_template" ADD "ttF" real NOT NULL`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "queue_entry" ALTER COLUMN "artistName" DROP DEFAULT`, undefined);
			await queryRunner.query(`ALTER TABLE "base64_sticker_template" DROP COLUMN "ttA"`, undefined);
			await queryRunner.query(`ALTER TABLE "base64_sticker_template" DROP COLUMN "ttB"`, undefined);
			await queryRunner.query(`ALTER TABLE "base64_sticker_template" DROP COLUMN "ttC"`, undefined);
			await queryRunner.query(`ALTER TABLE "base64_sticker_template" DROP COLUMN "ttD"`, undefined);
			await queryRunner.query(`ALTER TABLE "base64_sticker_template" DROP COLUMN "ttE"`, undefined);
			await queryRunner.query(`ALTER TABLE "base64_sticker_template" DROP COLUMN "ttF"`, undefined);
    }

}
