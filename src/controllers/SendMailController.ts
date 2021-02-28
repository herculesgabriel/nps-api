import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { resolve } from 'path';

import { UsersRepository } from '../repositories/UsersRepository';
import { SurveysRepository } from '../repositories/SurveysRepository';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';
import SendMailService from '../services/SendMailService';

class SendMailController {

  async execute(req: Request, res: Response) {
    const { email, survey_id } = req.body;

    const usersRepository = getCustomRepository(UsersRepository);
    const surveysRepository = getCustomRepository(SurveysRepository);
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const user = await usersRepository.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ error: 'User does not exist' });
    }

    const survey = await surveysRepository.findOne({ id: survey_id });

    if (!survey) {
      return res
        .status(400)
        .json({ error: 'Survey does not exist' });
    }

    const templatePath = resolve(__dirname, '..', 'views', 'emails', 'template_nps.hbs');

    const messageInfo = {
      id: user.id,
      name: user.name,
      email: user.email,
      title: survey.title,
      description: survey.description,
      link: process.env.MAIL_URL || 'http://localhost/3000',
    };

    const surveyUserExists = await surveysUsersRepository.findOne({
      where: [
        { user_id: user.id },
        { value: null },
      ],
      relations: ['user', 'survey'],
    });

    if (surveyUserExists) {
      await SendMailService.execute(messageInfo, templatePath);
      return res
        .status(200)
        .json(surveyUserExists);
    }

    const surveyUser = surveysUsersRepository.create({
      user_id: user.id,
      survey_id,
    });

    await surveysUsersRepository.save(surveyUser);

    await SendMailService.execute(messageInfo, templatePath);

    res
      .status(201)
      .json(surveyUser);
  }

}

export { SendMailController };
