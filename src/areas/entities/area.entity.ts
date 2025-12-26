import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('areas')
export class Area {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string; // FINANZAS, SOPORTE, CALIDAD, etc

  @Column({ nullable: true })
  description?: string;
}
