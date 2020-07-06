import {MigrationInterface, QueryRunner} from "typeorm";

export class AddNiclusLogging1594058051394 implements MigrationInterface {
    name = 'AddNiclusLogging1594058051394'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "niclus_query_logs" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "query" character varying NOT NULL, "firstName" character varying NOT NULL, "username" character varying NOT NULL, CONSTRAINT "PK_c7b6c49597c936b80d7ab771882" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "queue_entry" ALTER COLUMN "artistName" SET DEFAULT null`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "queue_entry" ALTER COLUMN "artistName" DROP DEFAULT`, undefined);
        await queryRunner.query(`DROP TABLE "niclus_query_logs"`, undefined);
    }

}
