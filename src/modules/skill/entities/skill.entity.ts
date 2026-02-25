import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Tag } from '../../tag/entities/tag.entity';
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

  @ManyToMany(() => Tag, tag => tag.skills, { cascade: true })
  @JoinTable({ name: 'skill_tags' })
  tags: Tag[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
