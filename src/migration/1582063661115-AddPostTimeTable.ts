import {MigrationInterface, QueryRunner} from "typeorm";

export class AddPostTimeTable1582063661115 implements MigrationInterface {
    name = 'AddPostTimeTable1582063661115'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "queue_post_time" ("id" SERIAL NOT NULL, "nextPostDatetime" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_d510599c6919a5ddd22f672ed62" PRIMARY KEY ("id"))`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "queue_post_time"`, undefined);
    }

}
