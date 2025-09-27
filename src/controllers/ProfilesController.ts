import type { Response } from 'express';
import type { Request } from 'express';
import type { IProfile } from 'models/Profile.ts';
import Profile from '../models/Profile.ts';

const ProfilesController = {
  findProfile: async (req: Request<{ id: string }>, res: Response<IProfile | { error: string }>) => {
    if (req.params.id) {
      Profile.findOne({
        owner: req.params.id,
      }).populate('owner', 'avatar email fullName isOnline last_seen').then((profile: any) => {
        if (profile) {
          profile.owner.avatar = `${process.env.BACKEND_URL}:${process.env.PORT}/${profile.owner.avatar}`;
          res.send(profile);
        } else {
          res.status(404).send({ error: "profile not found" });
        }
      }).catch((err) => {
        res.status(404).send({ error: err });
      });;
    }
    else {
      res.status(400).send({error: 'profile doesnt exist or something about'})
    }
  },
}

export default ProfilesController;
