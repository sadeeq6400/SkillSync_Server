import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { MentorSkill } from '../../mentor_skills/entities/mentor-skill.entity';

@Entity('skills')
export class Skill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;


  @Column('text', { array: true, nullable: true })
  aliases?: string[];

  @Column({ type: 'text', nullable: true })
  description?: string;

  @OneToMany(() => MentorSkill, mentorSkill => mentorSkill.skill)
  mentorSkills: MentorSkill[];

  @Column({ type: 'tsvector', select: false, nullable: true })
  searchVector?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
