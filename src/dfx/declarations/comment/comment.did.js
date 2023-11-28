export const idlFactory = ({ IDL }) => {
  const InputComment = IDL.Text;
  const Comment = IDL.Record({
    creation_time: IDL.Int,
    content: IDL.Text,
    user: IDL.Principal,
  });
  const Result_1 = IDL.Variant({
    ok: IDL.Tuple(Comment, IDL.Text),
    err: IDL.Text,
  });
  const Comments = IDL.Vec(Comment);
  const Result = IDL.Variant({
    ok: IDL.Tuple(Comments, IDL.Text),
    err: IDL.Text,
  });
  const anon_class_17_1 = IDL.Service({
    addComment: IDL.Func([InputComment, IDL.Text, IDL.Text], [Result_1], []),
    getComments: IDL.Func([IDL.Text], [Result], ['query']),
  });
  return anon_class_17_1;
};
export const init = ({ IDL }) => {
  return [];
};
