// api/index.js

export default async (req, res) => {
    res.status(200).json({ message: 'Hello from the serverless function!' });
  };
  