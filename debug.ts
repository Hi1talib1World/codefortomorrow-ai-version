import { getCuratedRepos } from './controllers/opensource.controller';

const req: any = {};
const res: any = {
  json: (data: any) => console.log('JSON:', data.length || data),
  status: (code: number) => ({ json: (data: any) => console.log('STATUS:', code, data) }),
  send: (data: any) => console.log('SEND:', data)
};

getCuratedRepos(req, res).catch(console.error);
