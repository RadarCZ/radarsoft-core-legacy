import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

import { QueueEntryOrigin } from '../util/enums';

@Entity()
export class QueueEntry {
	@PrimaryGeneratedColumn()
	public id!: number;

	@Column({
		'type': 'enum',
		'enum': QueueEntryOrigin,
		'default': QueueEntryOrigin.FA
	})
	public origin!: QueueEntryOrigin;

	@Column()
	public postId!: number;

	@Column({ 'unique': true })
	public postOriginIdComb!: string;

	@Column()
	public postLink!: string;

	@Column()
	public artistLink!: string;

	@Column({ 'default': null, 'nullable': true })
	public artistName?: string;

	@Column()
	public fullLink!: string;

	@Column()
	public tgImageLink!: string;

	@Column({ 'default': '2.1.2' })
	public savedWithApiVer!: string;

	@Column({ 'default': false })
	public posted!: boolean;

	@Column({ 'nullable': true })
	public postName?: string;

	@Column({ 'nullable': true })
	public tipLink?: string;

	@Column({ 'default': false })
	public savedOnDisk!: boolean;
}
