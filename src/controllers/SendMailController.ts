import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { resolve } from 'path';
import * as yup from 'yup';

import SendMailService from '../services/SendMailService';
import { AppError } from '../errors/AppError';
import { UsersRepository } from '../repositories/UsersRepository';
import { SurveysRepository } from '../repositories/SurveysRepository';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';

class SendMailController {
  async execute(req: Request, res: Response) {
    const { email, survey_id } = req.body;

    const schema = yup.object().shape({
      email: yup.string().email().required(),
      survey_id: yup.string().required(),
    });

    try {
      await schema.validate(req.body, { abortEarly: false });
    } catch (err) {
      throw new AppError(err);
    }

    const usersRepository = getCustomRepository(UsersRepository);
    const surveysRepository = getCustomRepository(SurveysRepository);
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const user = await usersRepository.findOne({ email });

    if (!user) {
      throw new AppError('User does not exist');
    }

    const survey = await surveysRepository.findOne({ id: survey_id });

    if (!survey) {
      throw new AppError('Survey does not exist');
    }

    const templatePath = resolve(__dirname, '..', 'views', 'emails', 'template_nps.hbs');

    const messageInfo = {
      id: '',
      name: user.name,
      email: user.email,
      title: survey.title,
      description: survey.description,
      link: process.env.MAIL_URL || 'http://localhost:3000',
    };

    const surveyUserExists = await surveysUsersRepository.findOne({
      where: { user_id: user.id, value: null, survey_id: survey_id },
      relations: ['user', 'survey'],
    });

    if (surveyUserExists) {
      messageInfo.id = surveyUserExists.id;
      await SendMailService.execute(messageInfo, templatePath);

      return res
        .status(200)
        .json(surveyUserExists);
    }

    const surveyUser = surveysUsersRepository.create({ user_id: user.id, survey_id });

    await surveysUsersRepository.save(surveyUser);

    messageInfo.id = surveyUser.id;
    await SendMailService.execute(messageInfo, templatePath);

    res
      .status(201)
      .json(surveyUser);
  }
}

export { SendMailController };
