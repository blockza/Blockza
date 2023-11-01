export const idlFactory = ({ IDL }) => {
  const ImageObject = IDL.Vec(IDL.Nat8);
  const User = IDL.Record({
    bio: IDL.Opt(IDL.Text),
    twitter: IDL.Opt(IDL.Text),
    externalLink: IDL.Opt(IDL.Text),
    name: IDL.Opt(IDL.Text),
    email: IDL.Opt(IDL.Text),
    bannerImg: IDL.Opt(ImageObject),
    profileImg: IDL.Opt(ImageObject),
  });
  const Result_2 = IDL.Variant({
    ok: IDL.Tuple(IDL.Text, User),
    err: IDL.Text,
  });
  const Result_1 = IDL.Variant({
    ok: IDL.Tuple(IDL.Text, User, IDL.Bool),
    err: IDL.Text,
  });
  const InputUser = IDL.Record({
    bio: IDL.Text,
    twitter: IDL.Text,
    externalLink: IDL.Text,
    name: IDL.Text,
    email: IDL.Text,
    bannerImg: IDL.Opt(ImageObject),
    profileImg: IDL.Opt(ImageObject),
  });
  const Result = IDL.Variant({
    ok: IDL.Tuple(IDL.Text, User, IDL.Opt(User)),
    err: IDL.Text,
  });
  const anon_class_13_1 = IDL.Service({
    add_user: IDL.Func([], [Result_2], []),
    check_user_exists: IDL.Func([IDL.Principal], [IDL.Bool], []),
    get_other_user_details: IDL.Func([IDL.Principal], [Result_2], ['query']),
    get_user_details: IDL.Func([IDL.Text], [Result_1], ['query']),
    update_user: IDL.Func([InputUser], [Result], []),
  });
  return anon_class_13_1;
};
export const init = ({ IDL }) => {
  return [];
};
