import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('wuhan_tracker')
export class WuhanTracker {
	@PrimaryGeneratedColumn()
	public id!: number;

	@Column()
	public confirmed!: number;

	@Column()
	public deaths!: number;

	@Column()
	public recovered!: number;
}
