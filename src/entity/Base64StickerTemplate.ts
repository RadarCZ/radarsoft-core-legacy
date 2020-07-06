import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Base64StickerTemplate {
	@PrimaryGeneratedColumn()
	public id!: number;

	@Column()
	public tPosX!: number;

	@Column()
	public tPosY!: number;

	@Column()
	public tWidth!: number;

	@Column()
	public tHeight!: number;

	@Column({
		'type': 'real'
	})
	public ttA!: number;

	@Column({
		'type': 'real'
	})
	public ttB!: number;

	@Column({
		'type': 'real'
	})
	public ttC!: number;

	@Column({
		'type': 'real'
	})
	public ttD!: number;

	@Column({
		'type': 'real'
	})
	public ttE!: number;

	@Column({
		'type': 'real'
	})
	public ttF!: number;

	@Column()
	public base64!: string;
}
