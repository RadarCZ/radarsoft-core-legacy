import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('wuhan_tracker')
export class WuhanTracker {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    confirmed!: number;

    @Column()
    deaths!: number;

    @Column()
    recovered!: number;
}
