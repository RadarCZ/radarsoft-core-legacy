import {MigrationInterface, QueryRunner} from "typeorm";

export class AddWuhanVirusCaching1582140377514 implements MigrationInterface {
    name = 'AddWuhanVirusCaching1582140377514'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "wuhan_tracker" ("id" SERIAL NOT NULL, "confirmed" integer NOT NULL, "deaths" integer NOT NULL, "recovered" integer NOT NULL, CONSTRAINT "PK_f3d13614c9650783118adbdd4d9" PRIMARY KEY ("id"))`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "wuhan_tracker"`, undefined);
    }

}
