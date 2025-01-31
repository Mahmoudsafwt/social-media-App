

export const sendEmailTemplate = (otp, userName, serviceName) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #4CAF50;
            padding: 20px;
            color: #fff;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            padding: 20px;
            text-align: center;
        }
        .button {
            background-color: #4CAF50;
            color: white;
            padding: 15px 25px;
            text-decoration: none;
            font-size: 16px;
            border-radius: 5px;
            display: inline-block;
            margin-top: 20px;
        }
        .footer {
            background-color: #f4f4f4;
            padding: 10px;
            text-align: center;
            color: #777;
            font-size: 12px;
        }
    </style>
</head>
<body>

    <div class="container">
        <div class="header">
            <h1>${serviceName}</h1>
        </div>
        <div class="content">
            <h2>Hi, ${userName}!</h2>
            <p>Thank you for registering with ${serviceName}. To complete the registration process, please enter the OTP below:</p>
            <h3 style="font-size: 24px; font-weight: bold;">${otp}</h3>
            <p>If you did not create an account with us, please ignore this email.</p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} [Eng Mahmoud Safwat]. All rights reserved.</p>
        </div>
    </div>

</body>
</html>
`;
