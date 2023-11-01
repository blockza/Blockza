export const idlFactory = ({ IDL }) => {
  const Key = IDL.Text;
  const User = IDL.Text;
  const ImageObject = IDL.Vec(IDL.Nat8);
  const Collection = IDL.Record({
    creation_time: IDL.Int,
    name: IDL.Text,
    user: User,
    description: IDL.Text,
    image: ImageObject,
  });
  const User__1 = IDL.Text;
  const InputCollection = IDL.Record({
    name: IDL.Text,
    user: User,
    description: IDL.Text,
    image: ImageObject,
  });
  const CollectionId = IDL.Text;
  return IDL.Service({
    getAllCollections: IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(Key, Collection))],
      ['query']
    ),
    getCollection: IDL.Func([Key], [IDL.Opt(Collection)], ['query']),
    getUserCollection: IDL.Func(
      [User__1],
      [IDL.Vec(IDL.Tuple(Key, Collection))],
      ['query']
    ),
    insertCollection: IDL.Func([InputCollection], [CollectionId], []),
  });
};
export const init = ({ IDL }) => {
  return [];
};
