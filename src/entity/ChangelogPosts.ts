import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class ChangelogPosts {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    version!: string;

    @Column({
        'type': 'timestamptz'
    })
    dateDeployed!: string;
}
