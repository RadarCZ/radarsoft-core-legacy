import {MigrationInterface, QueryRunner} from 'typeorm';

export class AddCounterForSavedQueueEntries1585061914350 implements MigrationInterface {
	name = 'AddCounterForSavedQueueEntries1585061914350';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query('CREATE TABLE "saved_queue_entries" ("id" SERIAL NOT NULL, "entries" integer NOT NULL, "createDate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f258699596717200f79a2c1ad37" PRIMARY KEY ("id"))', undefined);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query('DROP TABLE "saved_queue_entries"', undefined);
	}

}
