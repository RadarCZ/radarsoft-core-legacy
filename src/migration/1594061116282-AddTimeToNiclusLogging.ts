import {MigrationInterface, QueryRunner} from "typeorm";

export class AddTimeToNiclusLogging1594061116282 implements MigrationInterface {
    name = 'AddTimeToNiclusLogging1594061116282'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "niclus_query_logs" ADD "took" real NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "queue_entry" ALTER COLUMN "artistName" SET DEFAULT null`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "queue_entry" ALTER COLUMN "artistName" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "niclus_query_logs" DROP COLUMN "took"`, undefined);
    }

}
