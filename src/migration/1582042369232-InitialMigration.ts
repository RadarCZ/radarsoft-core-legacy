import {MigrationInterface, QueryRunner} from "typeorm";

export class InitialMigration1582042369232 implements MigrationInterface {
    name = 'InitialMigration1582042369232'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TYPE "queue_entry_origin_enum" AS ENUM('FA', 'WS', 'SF', 'E6')`, undefined);
        await queryRunner.query(`CREATE TABLE "queue_entry" ("id" SERIAL NOT NULL, "postId" integer NOT NULL, "origin" "queue_entry_origin_enum" NOT NULL DEFAULT 'FA', "postLink" character varying NOT NULL, "artistLink" character varying NOT NULL, "fullLink" character varying NOT NULL, "tgImageLink" character varying NOT NULL, "posted" boolean NOT NULL DEFAULT false, "postName" character varying, "tipLink" character varying, CONSTRAINT "PK_885c673f67b27b737a7c13bd4df" PRIMARY KEY ("id"))`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "queue_entry"`, undefined);
        await queryRunner.query(`DROP TYPE "queue_entry_origin_enum"`, undefined);
    }

}
