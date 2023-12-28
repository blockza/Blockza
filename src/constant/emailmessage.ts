export function rejectedArticleMessage(username:any,title:any,reason:any) {
  return `Dear ${username},<br><br>

  We extend our gratitude for your dedication in submitting an article  <strong>${title}</strong> . Regrettably, we must inform you that it did not meet our acceptance criteria for the following reasons:
<br><br>
${reason}
<br><br>
We value your commitment to contributing to our platform and encourage you to address the mentioned concerns in your future submissions. If you have any questions or would like further clarification, feel free to reach out.
<br><br>
Best regards, <br>
NFTStudio24 Team`;
}
export function approvedArticleMessage(username:any,title:any) {
  return `Hello ${username},<br><br>
  Great news from NFTStudio24. Your submitted article  <strong>${title}</strong>  has been successfully reviewed and approved for publication. We appreciate your valuable contribution to our platform. Thank you for choosing NFTStudio24 for sharing your insights!
  <br><br>
  Best regards,<br> NFTStudio24 Team`;
}