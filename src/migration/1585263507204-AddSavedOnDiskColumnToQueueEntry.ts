import {MigrationInterface, QueryRunner} from "typeorm";

export class AddSavedOnDiskColumnToQueueEntry1585263507204 implements MigrationInterface {
    name = 'AddSavedOnDiskColumnToQueueEntry1585263507204'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "queue_entry" ADD "savedOnDisk" boolean NOT NULL DEFAULT false`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "queue_entry" DROP COLUMN "savedOnDisk"`, undefined);
    }

}
