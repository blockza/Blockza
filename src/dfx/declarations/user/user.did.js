export const idlFactory = ({ IDL }) => {
  const Role = IDL.Variant({
    'admin' : IDL.Null,
    'article_admin' : IDL.Null,
    'authorized' : IDL.Null,
    'user_admin' : IDL.Null,
    'sub_admin' : IDL.Null,
  });
  const Reward = IDL.Record({
    'creation_time' : IDL.Int,
    'claimed_at' : IDL.Opt(IDL.Int),
    'isClaimed' : IDL.Bool,
    'amount' : IDL.Nat,
  });
  const Rewards = IDL.Vec(Reward);
  const ImageObject = IDL.Vec(IDL.Nat8);
  const User = IDL.Record({
    'dob' : IDL.Opt(IDL.Text),
    'authorDescription' : IDL.Opt(IDL.Text),
    'linkedin' : IDL.Opt(IDL.Text),
    'twitter' : IDL.Opt(IDL.Text),
    'instagram' : IDL.Opt(IDL.Text),
    'isBlocked' : IDL.Bool,
    'name' : IDL.Opt(IDL.Text),
    'authorInfo' : IDL.Opt(IDL.Text),
    'role' : Role,
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
  const Result_1 = IDL.Variant({
    'ok' : IDL.Tuple(IDL.Text, User),
    'err' : IDL.Text,
  });
  const Role__1 = IDL.Variant({
    'admin' : IDL.Null,
    'article_admin' : IDL.Null,
    'authorized' : IDL.Null,
    'user_admin' : IDL.Null,
    'sub_admin' : IDL.Null,
  });
  const Permission = IDL.Variant({
    'assign_role' : IDL.Null,
    'manage_user' : IDL.Null,
    'manage_article' : IDL.Null,
    'write' : IDL.Null,
  });
  const Id = IDL.Principal;
  const ListUser = IDL.Record({
    'isBlocked' : IDL.Bool,
    'name' : IDL.Opt(IDL.Text),
    'email' : IDL.Opt(IDL.Text),
    'joinedFrom' : IDL.Int,
  });
  const ListAdminUser = IDL.Record({
    'name' : IDL.Opt(IDL.Text),
    'role' : Role,
    'email' : IDL.Opt(IDL.Text),
    'joinedFrom' : IDL.Int,
  });
  const UserId = IDL.Opt(IDL.Text);
  const Result_2 = IDL.Variant({
    'ok' : IDL.Tuple(IDL.Text, User, IDL.Bool),
    'err' : IDL.Text,
  });
  const ImageObject__1 = IDL.Vec(IDL.Nat8);
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
  const anon_class_20_1 = IDL.Service({
    'add_reward' : IDL.Func([IDL.Principal, IDL.Nat], [IDL.Bool], []),
    'add_user' : IDL.Func([], [Result_1], []),
    'assign_role' : IDL.Func(
        [IDL.Principal, IDL.Text, Role__1],
        [Result_1],
        [],
      ),
    'block_user' : IDL.Func([IDL.Text, IDL.Text], [Result_1], []),
    'check_user_exists' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'claim_rewards' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'entry_require_permission' : IDL.Func(
        [IDL.Principal, Permission],
        [IDL.Bool],
        ['query'],
      ),
    'get_authorized_users' : IDL.Func(
        [IDL.Text, IDL.Nat, IDL.Nat],
        [
          IDL.Record({
            'users' : IDL.Vec(IDL.Tuple(Id, ListUser)),
            'amount' : IDL.Nat,
          }),
        ],
        ['query'],
      ),
    'get_subAdmin_users' : IDL.Func(
        [IDL.Text, IDL.Nat, IDL.Nat],
        [
          IDL.Record({
            'users' : IDL.Vec(IDL.Tuple(Id, ListAdminUser)),
            'amount' : IDL.Nat,
          }),
        ],
        ['query'],
      ),
    'get_user_details' : IDL.Func([UserId], [Result_2], ['query']),
    'get_user_name' : IDL.Func(
        [IDL.Principal],
        [
          IDL.Opt(
            IDL.Record({
              'name' : IDL.Opt(IDL.Text),
              'image' : IDL.Opt(ImageObject__1),
            })
          ),
        ],
        ['query'],
      ),
    'make_admin' : IDL.Func([IDL.Principal, Role__1], [IDL.Bool], []),
    'unBlock_user' : IDL.Func([IDL.Text, IDL.Text], [Result_1], []),
    'update_user' : IDL.Func([InputUser], [Result], []),
  });
  return anon_class_20_1;
};
export const init = ({ IDL }) => { return []; };
