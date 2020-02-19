import {MigrationInterface, QueryRunner} from "typeorm";

export class AddAPIVersionToQueueEntry1582106405573 implements MigrationInterface {
    name = 'AddAPIVersionToQueueEntry1582106405573'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "queue_entry" ADD "savedWithApiVer" character varying NOT NULL DEFAULT '2.1.2'`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "queue_entry" DROP COLUMN "savedWithApiVer"`, undefined);
    }

}
