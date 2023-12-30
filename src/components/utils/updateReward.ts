import { E8S } from '@/constant/config';
import logger from '@/lib/logger';
import { Auth } from '@/types/store';

interface Props {
  identity: any;
  auth: Auth;
  setReward: (input: number) => void;
}
export default function updateReward({ identity, setReward, auth }: Props) {
  try {
    const getRewards = async () => {
      if (auth.state !== 'initialized' || !identity) return;

      let tempUser = await auth.actor.get_user_details([]);
      const unClaimedRewards = tempUser.ok[1].rewards.filter((reward: any) => {
        return !reward.isClaimed;
      });
      setReward(unClaimedRewards.length);
    };
    getRewards();
  } catch (error) {
    logger(error);
  }
}
