import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class QueuePostTime {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        'type': 'timestamptz'
    })
    nextPostDatetime!: string;
}
