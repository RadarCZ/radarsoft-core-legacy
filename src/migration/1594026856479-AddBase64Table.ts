import {MigrationInterface, QueryRunner} from "typeorm";

export class AddBase64Table1594026856479 implements MigrationInterface {
		name = 'AddBase64Table1594026856479';

    public async up(queryRunner: QueryRunner): Promise<any> {
    	await queryRunner.query(`CREATE TABLE "base64_sticker_template" ("id" serial NOT NULL, "artist" character varying NOT NULL, "base64" character varying NOT NULL);`, undefined)
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
			await queryRunner.query(`DROP TABLE "base64_sticker_template"`, undefined);
    }

}
