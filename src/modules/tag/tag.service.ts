import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Skill } from '../skill/entities/skill.entity';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private tagRepo: Repository<Tag>,
    @InjectRepository(Skill)
    private skillRepo: Repository<Skill>,
  ) {}

  async assignTagsToSkill(skillId: number, tagSlugs: string[]) {
    const skill = await this.skillRepo.findOne({ where: { id: skillId }, relations: ['tags'] });
    if (!skill) throw new NotFoundException('Skill not found');
    const tags = await this.tagRepo.find({ where: { slug: In(tagSlugs) } });
    if (tags.length !== tagSlugs.length) throw new BadRequestException('Some tags do not exist');
    // Prevent duplicate assignment
    const existingSlugs = new Set(skill.tags.map(t => t.slug));
    const newTags = tags.filter(tag => !existingSlugs.has(tag.slug));
    if (!newTags.length) throw new BadRequestException('All tags already assigned');
    skill.tags = [...skill.tags, ...newTags];
    return this.skillRepo.save(skill);
  }

  async createTag(name: string, slug: string) {
    const exists = await this.tagRepo.findOne({ where: [{ name }, { slug }] });
    if (exists) throw new BadRequestException('Tag name or slug already exists');
    const tag = this.tagRepo.create({ name, slug });
    return this.tagRepo.save(tag);
  }
}
