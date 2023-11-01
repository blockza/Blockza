export const idlFactory = ({ IDL }) => {
  const Key = IDL.Text;
  const UserId__1 = IDL.Principal;
  const ImageObject = IDL.Vec(IDL.Nat8);
  const Entry = IDL.Record({
    creation_time: IDL.Int,
    title: IDL.Text,
    subscription: IDL.Bool,
    user: UserId__1,
    description: IDL.Text,
    image: ImageObject,
  });
  const UserId = IDL.Principal;
  const InputEntry = IDL.Record({
    title: IDL.Text,
    subscription: IDL.Bool,
    description: IDL.Text,
    image: ImageObject,
  });
  const EntryId = IDL.Text;
  const anon_class_15_1 = IDL.Service({
    getAllEntries: IDL.Func([], [IDL.Vec(IDL.Tuple(Key, Entry))], ['query']),
    getEntry: IDL.Func([Key], [IDL.Opt(Entry)], ['query']),
    getUserEntries: IDL.Func(
      [UserId],
      [IDL.Vec(IDL.Tuple(Key, Entry))],
      ['query']
    ),
    insertEntry: IDL.Func([InputEntry, IDL.Text], [EntryId], []),
    main: IDL.Func([IDL.Text], [IDL.Opt(IDL.Text)], []),
  });
  return anon_class_15_1;
};
export const init = ({ IDL }) => {
  return [];
};
