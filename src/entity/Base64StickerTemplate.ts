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

	@Column()
	public base64!: string;
}
