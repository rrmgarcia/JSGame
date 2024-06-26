import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

interface SendVerificationRequestParams {
  identifier: string;
  url: string;
  token: string;
  provider: {
    server: string | object;
    from: string;
  };
}

export async function sendVerificationRequest({
  identifier: email,
  url,
  token,
  provider,
}: SendVerificationRequestParams) {
  const { host } = new URL(url);
  const mailOptions = {
    from: provider.from,
    to: email,
    subject: `Sign in to ${host}`,
    text: `Sign in to ${host}\n${url}\n\n`,
    html: `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
        <h2 style="color: #333;">Sign in to ${host}</h2>
        <p>Click the button below to sign in:</p>
        <a href="${url}" style="display: inline-block; margin: 20px 0; padding: 10px 20px; color: #fff; background-color: #007BFF; text-decoration: none; border-radius: 5px;">Sign In</a>
        <p style="color: #555;">Thanks for signing up!</p>
      </div>
    `,
  };
  await transporter.sendMail(mailOptions);
}
