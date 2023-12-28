export const idlFactory = ({ IDL }) => {
  const Subscriber = IDL.Record({
    'user' : IDL.Principal,
    'subscribed_on' : IDL.Int,
  });
  const Result_1 = IDL.Variant({
    'ok' : IDL.Tuple(Subscriber, IDL.Text),
    'err' : IDL.Text,
  });
  const Subscribers = IDL.Vec(Subscriber);
  const Result = IDL.Variant({
    'ok' : IDL.Tuple(Subscribers, IDL.Text),
    'err' : IDL.Text,
  });
  const anon_class_18_1 = IDL.Service({
    'addSubscriber' : IDL.Func(
        [IDL.Principal, IDL.Text, IDL.Text],
        [Result_1],
        [],
      ),
    'getSubscribers' : IDL.Func([], [Result], ['query']),
    'isSubscriber' : IDL.Func([IDL.Principal], [IDL.Bool], ['query']),
  });
  return anon_class_18_1;
};
export const init = ({ IDL }) => { return []; };
