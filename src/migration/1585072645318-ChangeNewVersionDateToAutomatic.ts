import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangeNewVersionDateToAutomatic1585072645318 implements MigrationInterface {
    name = 'ChangeNewVersionDateToAutomatic1585072645318'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "changelog_posts" DROP COLUMN "dateDeployed"`, undefined);
        await queryRunner.query(`ALTER TABLE "changelog_posts" ADD "dateDeployed" TIMESTAMP NOT NULL DEFAULT now()`, undefined);
        await queryRunner.query(`ALTER TABLE "saved_queue_entries" ALTER COLUMN "entries" SET DEFAULT 0`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "saved_queue_entries" ALTER COLUMN "entries" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "changelog_posts" DROP COLUMN "dateDeployed"`, undefined);
        await queryRunner.query(`ALTER TABLE "changelog_posts" ADD "dateDeployed" TIMESTAMP WITH TIME ZONE NOT NULL`, undefined);
    }

}
