import type { Response } from 'express';
import type { Request } from 'express';
import type { IProfile } from 'models/Profile.ts';
import Profile from '../models/Profile.ts';

const ProfilesController = {
  findProfile: async (req: Request<{id: string}>, res: Response<IProfile | { error: string }>) => {
    if (req.params.id) {
      Profile.findOne({
        owner: req.params.id ,
      }).then((profile: any) => {
        if (profile) {
          res.send(profile);
        } else {
          res.status(404).send({ error: "error" });
        }
      }).catch((err) => {
        res.status(404).send({ error: err });
      });;
    }
  },
};

export default ProfilesController;
