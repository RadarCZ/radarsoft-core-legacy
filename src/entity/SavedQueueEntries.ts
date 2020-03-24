import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class SavedQueueEntries {
	@PrimaryGeneratedColumn()
	public id!: number;

	@Column({ 'default': 0 })
	public entries!: number;

	@CreateDateColumn()
	public createDate!: Date;
}
