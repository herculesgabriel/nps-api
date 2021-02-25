import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import { UsersRepository } from '../repositories/UsersRepository';

class UserController {

  async create(req: Request, res: Response) {
    const { name, email } = req.body;

    const usersRepository = getCustomRepository(UsersRepository);

    const alreadyExists = await usersRepository.findOne({ name });

    if (alreadyExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = usersRepository.create({ name, email });

    await usersRepository.save(user);

    res.status(201).json(user);
  }

}

export { UserController };