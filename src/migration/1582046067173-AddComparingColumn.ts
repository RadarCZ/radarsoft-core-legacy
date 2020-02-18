import {MigrationInterface, QueryRunner} from "typeorm";

export class AddComparingColumn1582046067173 implements MigrationInterface {
    name = 'AddComparingColumn1582046067173'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "queue_entry" ADD "postOriginIdComb" character varying NOT NULL`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "queue_entry" DROP COLUMN "postOriginIdComb"`, undefined);
    }

}
