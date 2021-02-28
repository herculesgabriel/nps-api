import { Request, Response } from 'express';
import { getCustomRepository, IsNull, Not } from 'typeorm';
import * as yup from 'yup';

import { AppError } from '../errors/AppError';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';

class NpsController {
  async execute(req: Request, res: Response) {
    const { survey_id } = req.params;

    const schema = yup.object().shape({ survey_id: yup.string().required() });

    try {
      await schema.validate(req.params, { abortEarly: false });
    } catch (err) {
      throw new AppError(err);
    }

    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const surveysUsers = await surveysUsersRepository.find({
      survey_id,
      value: Not(IsNull()),
    });

    const totalPromoters = surveysUsers.filter(survey => (
      survey.value >= 9 && survey.value <= 10
    )).length;

    const totalDetractors = surveysUsers.filter(survey => (
      survey.value >= 1 && survey.value <= 6
    )).length;

    const totalPassives = surveysUsers.filter(survey => (
      survey.value >= 7 && survey.value <= 8
    )).length;

    const totalAnswers = surveysUsers.length;

    const nps = ((totalPromoters - totalDetractors) / totalAnswers) * 100;
    const npsFormatted = Number(nps.toFixed(2));

    res
      .status(200)
      .json({
        totalPromoters,
        totalDetractors,
        totalPassives,
        totalAnswers,
        nps: npsFormatted,
      });
  }
}

export { NpsController };
