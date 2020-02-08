import { IRadarsoftHandler } from '../IRadarsoftHandler';
import axios from 'axios';

export const getGhData: IRadarsoftHandler = async (req, res) => {
  const { u } = req.query;
  const url = `https://api.github.com/users/${u}`;
  const ghResponse = await axios.get(url);

  if (ghResponse.status === 200 || ghResponse.status === 301) {
    const ghData = ghResponse.data;

    const resultData = {
      'icon': ghData.avatar_url,
      'name': ghData.login,
      'site': 'github',
      'stat1': ghData.public_repos,
      'stat2': ghData.followers,
      'targetUrl': `https://github.com/${ghData.login}`
    };

    res.send(resultData);
  } else {
    res.send(new Error(ghResponse.statusText));
  }
};
