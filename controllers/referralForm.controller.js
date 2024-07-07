import prisma from "../db/db.config.js";
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, 
  port: process.env.SMTP_PORT, 
  secure: true, 
  auth: {
    user: process.env.SMTP_USER, 
    pass: process.env.SMTP_PASS 
  }
});

export const createReferralForm = async (req, res) => {
    try {
      const { fullName, email, message } = req.body;
      const newFormDetail = await prisma.formDetails.create({
        data: {
          fullName,
          email,
          message,
        },
      });

      console.log(process.env.SMTP_HOST)

      transporter.sendMail({
        from: process.env.SMTP_FROM, 
        to: email,
        subject: `Download and Earn`,
        text: message
        }, (error, info) => {
            if (error) {
                console.error(error);
                return res.status(500).send(error.toString());
            } else {
                console.log('Email sent:', info.response);
                res.status(200).json({
                  newFormDetail,
                  emailSent: 'true'
                });
            }
        }
      );

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      await prisma.$disconnect();
    }
  };