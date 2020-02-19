import { QueueEntryOrigin } from '../util/enums';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class QueueEntry {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        'type': 'enum',
        'enum': QueueEntryOrigin,
        'default': QueueEntryOrigin.FA
    })
    origin!: QueueEntryOrigin;

    @Column()
    postId!: number;

    @Column({ 'unique': true })
    postOriginIdComb!: string;

    @Column()
    postLink!: string;

    @Column()
    artistLink!: string;

    @Column()
    fullLink!: string;

    @Column()
    tgImageLink!: string;

    @Column({ 'default': '2.1.2' })
    savedWithApiVer!: string;

    @Column({ 'default': false })
    posted!: boolean;

    @Column({ 'nullable': true })
    postName?: string;

    @Column({ 'nullable': true })
    tipLink?: string;
}
