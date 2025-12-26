import { Area } from "src/areas/entities/area.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { UserStatus } from "../enums/user-status.enum";
import { Role } from "../roles/entities/role.entity";

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'uuid',
    default: () => 'gen_random_uuid()',
    unique: true,
  })
  publicId: string;

  @Column({ nullable: true, unique: true })
  rut?: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true, select: false })
  passwordHash?: string; // preparado, no usado aún

  @ManyToOne(() => Role, { eager: true })
  role: Role;

  @ManyToOne(() => Area, { eager: true })
  area: Area;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
