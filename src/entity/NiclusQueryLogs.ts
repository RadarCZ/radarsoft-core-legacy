import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class NiclusQueryLogs {
	@PrimaryGeneratedColumn()
	public id!: number;

	@Column()
	public userId!: number;

	@Column()
	public query!: string;

	@Column()
	public firstName!: string;

	@Column()
	public username?: string;

	@Column({
		'type': 'real'
	})
	public took?: number;
}
