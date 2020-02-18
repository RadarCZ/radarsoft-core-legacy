import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUniqueConstraintToComparingColumn1582046776865 implements MigrationInterface {
    name = 'AddUniqueConstraintToComparingColumn1582046776865'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "queue_entry" ADD CONSTRAINT "UQ_9d39c14a6840feb46868f1c3d43" UNIQUE ("postOriginIdComb")`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "queue_entry" DROP CONSTRAINT "UQ_9d39c14a6840feb46868f1c3d43"`, undefined);
    }

}
