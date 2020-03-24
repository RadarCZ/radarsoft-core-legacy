import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class QueuePostTime {
	@PrimaryGeneratedColumn()
	public id!: number;

	@Column({
		'type': 'timestamptz'
	})
	public nextPostDatetime!: string;
}
