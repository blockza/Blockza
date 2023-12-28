export const idlFactory = ({ IDL }) => {
  const UserId = IDL.Principal;
  const ActivityType = IDL.Variant({
    'subscribe' : IDL.Null,
    'like' : IDL.Null,
    'create' : IDL.Null,
    'comment' : IDL.Null,
  });
  const AdminActivityType = IDL.Variant({
    'reject' : IDL.Null,
    'unBlock' : IDL.Null,
    'approve' : IDL.Null,
    'block' : IDL.Null,
  });
  const InputComment = IDL.Text;
  const Comment = IDL.Record({
    'creation_time' : IDL.Int,
    'content' : IDL.Text,
    'user' : IDL.Principal,
  });
  const Result_3 = IDL.Variant({
    'ok' : IDL.Tuple(Comment, IDL.Text),
    'err' : IDL.Text,
  });
  const Activity = IDL.Record({
    'activity_type' : ActivityType,
    'time' : IDL.Int,
    'target' : IDL.Text,
  });
  const Activities = IDL.Vec(Activity);
  const Result_2 = IDL.Variant({
    'ok' : IDL.Tuple(Activities, IDL.Text),
    'err' : IDL.Text,
  });
  const AdminActivity = IDL.Record({
    'activity_type' : AdminActivityType,
    'time' : IDL.Int,
    'target' : IDL.Text,
  });
  const AdminActivities = IDL.Vec(AdminActivity);
  const Result_1 = IDL.Variant({
    'ok' : IDL.Tuple(AdminActivities, IDL.Text),
    'err' : IDL.Text,
  });
  const Comments = IDL.Vec(Comment);
  const Result = IDL.Variant({
    'ok' : IDL.Tuple(Comments, IDL.Text),
    'err' : IDL.Text,
  });
  const anon_class_19_1 = IDL.Service({
    'addActivity' : IDL.Func([UserId, IDL.Text, ActivityType], [IDL.Bool], []),
    'addAdminActivity' : IDL.Func(
        [UserId, IDL.Text, AdminActivityType],
        [IDL.Bool],
        [],
      ),
    'addComment' : IDL.Func([InputComment, IDL.Text, IDL.Text], [Result_3], []),
    'getActivities' : IDL.Func([], [Result_2], ['query']),
    'getAdminActivities' : IDL.Func([UserId, IDL.Text], [Result_1], []),
    'getComments' : IDL.Func([IDL.Text], [Result], ['query']),
  });
  return anon_class_19_1;
};
export const init = ({ IDL }) => { return []; };
