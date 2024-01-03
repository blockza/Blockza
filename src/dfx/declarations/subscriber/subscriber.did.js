export const idlFactory = ({ IDL }) => {
  const Subscriber = IDL.Record({
    'user' : IDL.Principal,
    'subscribed_on' : IDL.Int,
  });
  const Result_1 = IDL.Variant({
    'ok' : IDL.Tuple(Subscriber, IDL.Text),
    'err' : IDL.Text,
  });
  const Result = IDL.Variant({
    'ok' : IDL.Tuple(
      IDL.Record({ 'entries' : IDL.Vec(Subscriber), 'amount' : IDL.Nat }),
      IDL.Text,
    ),
    'err' : IDL.Text,
  });
  const anon_class_20_1 = IDL.Service({
    'addSubscriber' : IDL.Func(
        [IDL.Principal, IDL.Text, IDL.Text],
        [Result_1],
        [],
      ),
    'getSubscribers' : IDL.Func([IDL.Nat, IDL.Nat], [Result], ['query']),
    'isSubscriber' : IDL.Func([IDL.Principal], [IDL.Bool], ['query']),
    'searchPaginateSubscribersByLatest' : IDL.Func(
        [IDL.Vec(Subscriber), IDL.Text, IDL.Text, IDL.Nat, IDL.Nat],
        [IDL.Record({ 'entries' : IDL.Vec(Subscriber), 'amount' : IDL.Nat })],
        [],
      ),
    'searchSubscribers' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Nat, IDL.Nat],
        [Result],
        [],
      ),
  });
  return anon_class_20_1;
};
export const init = ({ IDL }) => { return []; };
