import {MigrationInterface, QueryRunner} from "typeorm";

export class AddNewEnumValue1582059184044 implements MigrationInterface {
    name = 'AddNewEnumValue1582059184044'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TYPE "public"."queue_entry_origin_enum" RENAME TO "queue_entry_origin_enum_old"`, undefined);
        await queryRunner.query(`CREATE TYPE "queue_entry_origin_enum" AS ENUM('FA', 'WS', 'WE', 'SF', 'E6')`, undefined);
        await queryRunner.query(`ALTER TABLE "queue_entry" ALTER COLUMN "origin" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "queue_entry" ALTER COLUMN "origin" TYPE "queue_entry_origin_enum" USING "origin"::"text"::"queue_entry_origin_enum"`, undefined);
        await queryRunner.query(`ALTER TABLE "queue_entry" ALTER COLUMN "origin" SET DEFAULT 'FA'`, undefined);
        await queryRunner.query(`DROP TYPE "queue_entry_origin_enum_old"`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TYPE "queue_entry_origin_enum_old" AS ENUM('FA', 'WS', 'SF', 'E6')`, undefined);
        await queryRunner.query(`ALTER TABLE "queue_entry" ALTER COLUMN "origin" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "queue_entry" ALTER COLUMN "origin" TYPE "queue_entry_origin_enum_old" USING "origin"::"text"::"queue_entry_origin_enum_old"`, undefined);
        await queryRunner.query(`ALTER TABLE "queue_entry" ALTER COLUMN "origin" SET DEFAULT 'FA'`, undefined);
        await queryRunner.query(`DROP TYPE "queue_entry_origin_enum"`, undefined);
        await queryRunner.query(`ALTER TYPE "queue_entry_origin_enum_old" RENAME TO  "queue_entry_origin_enum"`, undefined);
    }

}
