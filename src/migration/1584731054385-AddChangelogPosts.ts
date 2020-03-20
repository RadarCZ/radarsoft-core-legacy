import {MigrationInterface, QueryRunner} from "typeorm";

export class AddChangelogPosts1584731054385 implements MigrationInterface {
    name = 'AddChangelogPosts1584731054385'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "changelog_posts" ("id" SERIAL NOT NULL, "version" character varying NOT NULL, "dateDeployed" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_7262b0d2378a463bc2201452049" PRIMARY KEY ("id"))`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "changelog_posts"`, undefined);
    }

}
