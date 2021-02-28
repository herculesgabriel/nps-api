import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import * as yup from 'yup';

import { AppError } from '../errors/AppError';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';

class AnswerController {
  async execute(req: Request, res: Response) {
    const { value } = req.params;
    const { u } = req.query;

    const schema = yup.object().shape({
      value: yup.string().required(),
      u: yup.string().required(),
    });

    try {
      await schema.validate({ value, u }, { abortEarly: false });
    } catch (err) {
      throw new AppError(err);
    }

    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const surveyUser = await surveysUsersRepository.findOne({ id: String(u) });

    if (!surveyUser) {
      throw new AppError('Survey does not exist');
    }

    surveyUser.value = Number(value);

    await surveysUsersRepository.save(surveyUser);

    res
      .status(200)
      .json(surveyUser);
  }
}

export { AnswerController };
