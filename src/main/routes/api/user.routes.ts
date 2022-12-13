import {
  IAddUserCase,
  IDisableUserCase,
  IEditUserCase,
  IEnableUserCase,
  IGetUserCase,
  IHistoryUserCase,
  ISearchUserCase
} from '$/domain';
import { Router } from 'express';
import { container } from 'tsyringe';

const userRoutes = Router();

// searchUser
userRoutes.post('/_search', async (req, res) => {
  const result = await container
    .resolve<ISearchUserCase>('ISearchUserCase').search(req as any);
  res.json(result);
});

// historyUser
userRoutes.get('/:_uid/_history', async (req, res) => {
  const result = await container
    .resolve<IHistoryUserCase>('IHistoryUserCase').history(req as any);
  res.json(result);
});

// enableUser
userRoutes.delete('/:_uid/_rollback', async (req, res) => {
  const result = await container
    .resolve<IEnableUserCase>('IEnableUserCase').enable(req as any);
  res.json(result);
});

// disableUser
userRoutes.delete('/:_uid', async (req, res) => {
  await container
    .resolve<IDisableUserCase>('IDisableUserCase').disable(req as any);
  res.sendStatus(204);
});

// getUser
userRoutes.get('/:_uid', async (req, res) => {
  const result = await container
    .resolve<IGetUserCase>('IGetUserCase').get(req as any);
  res.json(result);
});

// editUser
userRoutes.put('/:_uid', async (req, res) => {
  const result = await container
    .resolve<IEditUserCase>('IEditUserCase').edit(req as any);
  res.json(result);
});

// addUser
userRoutes.post('/', async (req, res) => {
  const result = await container
    .resolve<IAddUserCase>('IAddUserCase').add(req as any);
  res.status(201).json(result);
});

export default userRoutes;
