export const welcomeEmail = ({name, verifyUrl}) => `
  <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 0; color: #1f2937;">
    
    <h2 style="margin: 0 0 16px; font-size: 20px; color: #111827;">
      Welcome to Perplexity
    </h2>

    <p style="margin: 0 0 12px; font-size: 14px; line-height: 1.6;">
      Hi <strong>${name}</strong>,
    </p>

    <p style="margin: 0 0 12px; font-size: 14px; line-height: 1.6;">
      Thanks for signing up. Please verify your email address to activate your account.
    </p>

    <a
      href="${verifyUrl}"
      style="
        display: inline-block;
        margin: 16px 0;
        padding: 10px 20px;
        background-color: #4f46e5;
        color: #ffffff;
        text-decoration: none;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 600;
      "
    >
      Verify Email
    </a>
    
    <p>If the button doesn’t work, copy and paste this URL into your browser:</p>
    <p><a href="${verifyUrl}">${verifyUrl}</a></p>

    <p style="margin: 16px 0 0; font-size: 12px; color: #6b7280; line-height: 1.5;">
      If you didn't create this account, you can safely ignore this email.
    </p>

    <hr style="margin: 24px 0 16px; border: none; border-top: 1px solid #e5e7eb;" />

    <p style="margin: 0; font-size: 11px; color: #9ca3af;">
      &copy; ${new Date().getFullYear()} Perplexity AI
    </p>

  </div>
`;
