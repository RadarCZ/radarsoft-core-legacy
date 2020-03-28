import {MigrationInterface, QueryRunner} from "typeorm";

export class AddArtistNameColumnForQueueEntry1585307291764 implements MigrationInterface {
    name = 'AddArtistNameColumnForQueueEntry1585307291764'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "queue_entry" ADD "artistName" character varying DEFAULT null`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "queue_entry" DROP COLUMN "artistName"`, undefined);
    }

}
