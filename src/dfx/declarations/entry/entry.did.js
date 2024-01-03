export const idlFactory = ({ IDL }) => {
  const List = IDL.Rec();
  const Key = IDL.Text;
  const EntryStatus = IDL.Variant({
    'pending' : IDL.Null,
    'approved' : IDL.Null,
    'rejected' : IDL.Null,
  });
  const UserId = IDL.Principal;
  List.fill(IDL.Opt(IDL.Tuple(IDL.Int, List)));
  const ImageObject = IDL.Vec(IDL.Nat8);
  const Entry = IDL.Record({
    'creation_time' : IDL.Int,
    'status' : EntryStatus,
    'userName' : IDL.Text,
    'title' : IDL.Text,
    'seoTitle' : IDL.Text,
    'promotionICP' : IDL.Nat,
    'likedUsers' : IDL.Vec(IDL.Principal),
    'imageTags' : IDL.Vec(IDL.Text),
    'seoSlug' : IDL.Text,
    'subscription' : IDL.Bool,
    'views' : IDL.Nat,
    'tags' : IDL.Vec(IDL.Text),
    'user' : UserId,
    'minters' : IDL.Vec(IDL.Principal),
    'description' : IDL.Text,
    'isPromoted' : IDL.Bool,
    'likes' : IDL.Nat,
    'isDraft' : IDL.Bool,
    'promotionHistory' : List,
    'pressRelease' : IDL.Bool,
    'caption' : IDL.Text,
    'category' : IDL.Vec(IDL.Text),
    'viewedUsers' : IDL.Vec(IDL.Principal),
    'image' : ImageObject,
    'seoDescription' : IDL.Text,
    'seoExcerpt' : IDL.Text,
  });
  const Result_2 = IDL.Variant({
    'ok' : IDL.Tuple(IDL.Text, Entry),
    'err' : IDL.Text,
  });
  const ListEntryItem = IDL.Record({
    'creation_time' : IDL.Int,
    'status' : EntryStatus,
    'userName' : IDL.Text,
    'title' : IDL.Text,
    'views' : IDL.Nat,
    'user' : UserId,
    'minters' : IDL.Vec(IDL.Principal),
    'isPromoted' : IDL.Bool,
    'likes' : IDL.Nat,
    'isDraft' : IDL.Bool,
    'pressRelease' : IDL.Bool,
    'category' : IDL.Vec(IDL.Text),
    'image' : ImageObject,
  });
  const EntryStatus__1 = IDL.Variant({
    'pending' : IDL.Null,
    'approved' : IDL.Null,
    'rejected' : IDL.Null,
  });
  const UserId__1 = IDL.Principal;
  const RewardConfig = IDL.Record({
    'admin' : IDL.Nat,
    'platform' : IDL.Nat,
    'master' : IDL.Nat,
  });
  const InputEntry = IDL.Record({
    'userName' : IDL.Text,
    'title' : IDL.Text,
    'seoTitle' : IDL.Text,
    'promotionICP' : IDL.Nat,
    'imageTags' : IDL.Vec(IDL.Text),
    'seoSlug' : IDL.Text,
    'subscription' : IDL.Bool,
    'tags' : IDL.Vec(IDL.Text),
    'description' : IDL.Text,
    'isPromoted' : IDL.Bool,
    'isDraft' : IDL.Bool,
    'pressRelease' : IDL.Bool,
    'caption' : IDL.Text,
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
  const LikeReward = IDL.Nat;
  const anon_class_22_1 = IDL.Service({
    'addCategory' : IDL.Func([IDL.Text, IDL.Text], [IDL.Vec(IDL.Text)], []),
    'approveArticle' : IDL.Func(
        [IDL.Text, IDL.Text, Key, IDL.Bool],
        [Result_2],
        [],
      ),
    'getAllEntries' : IDL.Func([], [IDL.Vec(IDL.Tuple(Key, Entry))], ['query']),
    'getCategories' : IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
    'getEntriesByCategory' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(IDL.Tuple(Key, Entry))],
        ['query'],
      ),
    'getEntriesList' : IDL.Func(
        [IDL.Text, IDL.Bool, IDL.Text, IDL.Nat, IDL.Nat],
        [
          IDL.Record({
            'entries' : IDL.Vec(IDL.Tuple(Key, ListEntryItem)),
            'amount' : IDL.Nat,
          }),
        ],
        ['query'],
      ),
    'getEntry' : IDL.Func([Key], [IDL.Opt(Entry)], ['query']),
    'getPaginatedEntries' : IDL.Func(
        [IDL.Nat, IDL.Nat],
        [
          IDL.Record({
            'entries' : IDL.Vec(IDL.Tuple(Key, Entry)),
            'amount' : IDL.Nat,
          }),
        ],
        ['query'],
      ),
    'getPressEntries' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(Key, Entry))],
        ['query'],
      ),
    'getPromotedEntries' : IDL.Func(
        [IDL.Nat],
        [IDL.Vec(IDL.Tuple(Key, Entry))],
        ['query'],
      ),
    'getReviewEntries' : IDL.Func(
        [IDL.Text, IDL.Text, EntryStatus__1, IDL.Text, IDL.Nat, IDL.Nat],
        [
          IDL.Record({
            'entries' : IDL.Vec(IDL.Tuple(Key, ListEntryItem)),
            'amount' : IDL.Nat,
          }),
        ],
        [],
      ),
    'getUserEntries' : IDL.Func(
        [UserId__1],
        [IDL.Vec(IDL.Tuple(Key, Entry))],
        ['query'],
      ),
    'getUserEntriesList' : IDL.Func(
        [IDL.Text, IDL.Bool, IDL.Text, IDL.Nat, IDL.Nat],
        [
          IDL.Record({
            'entries' : IDL.Vec(IDL.Tuple(Key, ListEntryItem)),
            'amount' : IDL.Nat,
          }),
        ],
        ['query'],
      ),
    'get_like_reward' : IDL.Func([], [IDL.Nat], ['query']),
    'get_reward' : IDL.Func([], [RewardConfig], ['query']),
    'insertEntry' : IDL.Func(
        [InputEntry, IDL.Text, IDL.Bool, IDL.Text, IDL.Text],
        [Result_1],
        [],
      ),
    'isMinted' : IDL.Func([Key], [IDL.Bool], []),
    'likeEntry' : IDL.Func([Key, IDL.Text, IDL.Text], [Result], []),
    'mintEntry' : IDL.Func([Key, IDL.Text], [Result], []),
    'update_like_reward' : IDL.Func([IDL.Text, LikeReward], [LikeReward], []),
    'update_reward' : IDL.Func([IDL.Text, RewardConfig], [RewardConfig], []),
  });
  return anon_class_22_1;
};
export const init = ({ IDL }) => { return []; };
