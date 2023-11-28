export const idlFactory = ({ IDL }) => {
  const Key = IDL.Text;
  const UserId = IDL.Principal;
  const ImageObject = IDL.Vec(IDL.Nat8);
  const Entry = IDL.Record({
    'creation_time' : IDL.Int,
    'title' : IDL.Text,
    'seoTitle' : IDL.Text,
    'promotionICP' : IDL.Float64,
    'likedUsers' : IDL.Vec(IDL.Principal),
    'seoSlug' : IDL.Text,
    'subscription' : IDL.Bool,
    'views' : IDL.Nat,
    'user' : UserId,
    'minters' : IDL.Vec(IDL.Principal),
    'description' : IDL.Text,
    'isPromoted' : IDL.Bool,
    'likes' : IDL.Nat,
    'isDraft' : IDL.Bool,
    'category' : IDL.Vec(IDL.Text),
    'viewedUsers' : IDL.Vec(IDL.Principal),
    'image' : ImageObject,
    'seoDescription' : IDL.Text,
    'seoExcerpt' : IDL.Text,
  });
  const ListEntryItem = IDL.Record({
    'creation_time' : IDL.Int,
    'title' : IDL.Text,
    'views' : IDL.Nat,
    'user' : UserId,
    'minters' : IDL.Vec(IDL.Principal),
    'likes' : IDL.Nat,
    'isDraft' : IDL.Bool,
    'category' : IDL.Vec(IDL.Text),
    'image' : ImageObject,
  });
  const UserId__1 = IDL.Principal;
  const InputEntry = IDL.Record({
    'title' : IDL.Text,
    'seoTitle' : IDL.Text,
    'promotionICP' : IDL.Float64,
    'seoSlug' : IDL.Text,
    'subscription' : IDL.Bool,
    'description' : IDL.Text,
    'isPromoted' : IDL.Bool,
    'isDraft' : IDL.Bool,
    'category' : IDL.Vec(IDL.Text),
    'image' : ImageObject,
    'seoDescription' : IDL.Text,
    'seoExcerpt' : IDL.Text,
  });
  const EntryId = IDL.Text;
  const Result_1 = IDL.Variant({
    'ok' : IDL.Tuple(IDL.Text, EntryId),
    'err' : IDL.Text,
  });
  const Result = IDL.Variant({
    'ok' : IDL.Tuple(IDL.Text, IDL.Bool),
    'err' : IDL.Text,
  });
  const anon_class_17_1 = IDL.Service({
    'getAllEntries' : IDL.Func([], [IDL.Vec(IDL.Tuple(Key, Entry))], ['query']),
    'getCategories' : IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
    'getEntriesByCategory' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(IDL.Tuple(Key, Entry))],
        ['query'],
      ),
    'getEntriesList' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(IDL.Tuple(Key, ListEntryItem))],
        ['query'],
      ),
    'getEntry' : IDL.Func([Key], [IDL.Opt(Entry)], ['query']),
    'getPromotedEntries' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(Key, Entry))],
        ['query'],
      ),
    'getUserEntries' : IDL.Func(
        [UserId__1],
        [IDL.Vec(IDL.Tuple(Key, Entry))],
        ['query'],
      ),
    'getUserEntriesList' : IDL.Func(
        [IDL.Text, IDL.Bool],
        [IDL.Vec(IDL.Tuple(Key, ListEntryItem))],
        ['query'],
      ),
    'insertEntry' : IDL.Func(
        [InputEntry, IDL.Text, IDL.Bool, IDL.Text],
        [Result_1],
        [],
      ),
    'isMinted' : IDL.Func([Key], [IDL.Bool], []),
    'likeEntry' : IDL.Func([Key, IDL.Text], [Result], []),
    'mintEntry' : IDL.Func([Key], [Result], []),
  });
  return anon_class_17_1;
};
export const init = ({ IDL }) => { return []; };
