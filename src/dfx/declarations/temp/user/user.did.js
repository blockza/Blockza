export const idlFactory = ({ IDL }) => {
  const Reward = IDL.Record({
    'creation_time' : IDL.Int,
    'isClaimed' : IDL.Bool,
  });
  const Rewards = IDL.Vec(Reward);
  const ImageObject = IDL.Vec(IDL.Nat8);
  const User = IDL.Record({
    'dob' : IDL.Opt(IDL.Text),
    'authorDescription' : IDL.Opt(IDL.Text),
    'linkedin' : IDL.Opt(IDL.Text),
    'twitter' : IDL.Opt(IDL.Text),
    'instagram' : IDL.Opt(IDL.Text),
    'name' : IDL.Opt(IDL.Text),
    'authorInfo' : IDL.Opt(IDL.Text),
    'email' : IDL.Opt(IDL.Text),
    'website' : IDL.Opt(IDL.Text),
    'facebook' : IDL.Opt(IDL.Text),
    'joinedFrom' : IDL.Int,
    'gender' : IDL.Opt(IDL.Text),
    'rewards' : Rewards,
    'bannerImg' : IDL.Opt(ImageObject),
    'authorTitle' : IDL.Opt(IDL.Text),
    'profileImg' : IDL.Opt(ImageObject),
  });
  const Result_2 = IDL.Variant({
    'ok' : IDL.Tuple(IDL.Text, User),
    'err' : IDL.Text,
  });
  const UserId = IDL.Opt(IDL.Text);
  const Result_1 = IDL.Variant({
    'ok' : IDL.Tuple(IDL.Text, User, IDL.Bool),
    'err' : IDL.Text,
  });
  const InputUser = IDL.Record({
    'dob' : IDL.Text,
    'authorDescription' : IDL.Text,
    'linkedin' : IDL.Text,
    'twitter' : IDL.Text,
    'instagram' : IDL.Text,
    'name' : IDL.Text,
    'authorInfo' : IDL.Text,
    'email' : IDL.Text,
    'website' : IDL.Text,
    'facebook' : IDL.Text,
    'gender' : IDL.Text,
    'bannerImg' : IDL.Opt(ImageObject),
    'authorTitle' : IDL.Text,
    'profileImg' : IDL.Opt(ImageObject),
  });
  const Result = IDL.Variant({
    'ok' : IDL.Tuple(IDL.Text, User, IDL.Opt(User)),
    'err' : IDL.Text,
  });
  const anon_class_15_1 = IDL.Service({
    'add_reward' : IDL.Func([], [IDL.Bool], []),
    'add_user' : IDL.Func([], [Result_2], []),
    'check_user_exists' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'get_other_user_details' : IDL.Func([IDL.Principal], [Result_2], ['query']),
    'get_user_details' : IDL.Func([UserId], [Result_1], ['query']),
    'update_user' : IDL.Func([InputUser], [Result], []),
  });
  return anon_class_15_1;
};
export const init = ({ IDL }) => { return []; };
