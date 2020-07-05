import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangeStickerTableFormat1594055200534 implements MigrationInterface {
    name = 'ChangeStickerTableFormat1594055200534'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "base64_sticker_template" DROP COLUMN "artist"`, undefined);
        await queryRunner.query(`ALTER TABLE "base64_sticker_template" ADD "tPosX" integer NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "base64_sticker_template" ADD "tPosY" integer NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "base64_sticker_template" ADD "tWidth" integer NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "base64_sticker_template" ADD "tHeight" integer NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "base64_sticker_template" ADD CONSTRAINT "PK_8f75fd13efd6719eed73a5a08d4" PRIMARY KEY ("id")`, undefined);
        await queryRunner.query(`ALTER TABLE "queue_entry" ALTER COLUMN "artistName" SET DEFAULT null`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "queue_entry" ALTER COLUMN "artistName" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "base64_sticker_template" DROP CONSTRAINT "PK_8f75fd13efd6719eed73a5a08d4"`, undefined);
        await queryRunner.query(`ALTER TABLE "base64_sticker_template" DROP COLUMN "tHeight"`, undefined);
        await queryRunner.query(`ALTER TABLE "base64_sticker_template" DROP COLUMN "tWidth"`, undefined);
        await queryRunner.query(`ALTER TABLE "base64_sticker_template" DROP COLUMN "tPosY"`, undefined);
        await queryRunner.query(`ALTER TABLE "base64_sticker_template" DROP COLUMN "tPosX"`, undefined);
        await queryRunner.query(`ALTER TABLE "base64_sticker_template" ADD "artist" character varying NOT NULL`, undefined);
    }

}
