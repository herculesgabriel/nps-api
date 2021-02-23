import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import User from '../models/User';

export default class UserController {

  async create(req: Request, res: Response) {
    const { name, email } = req.body;

    const usersRepository = getRepository(User);

    const alreadyExists = await usersRepository.findOne({ name });

    if (alreadyExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = usersRepository.create({ name, email });

    await usersRepository.save(user);

    res.json(user);
  }

}