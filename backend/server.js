import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'yaml';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const swaggerPath = join(__dirname, 'swagger.yaml');
const swaggerDocument = yaml.parse(readFileSync(swaggerPath, 'utf8'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/greet', (req, res) => {
  const { name, age } = req.body ?? {};

  if (typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'Name is required.' });
  }

  const numericAge = Number(age);

  if (!Number.isFinite(numericAge) || numericAge < 0) {
    return res.status(400).json({ error: 'Age must be a positive number.' });
  }

  const trimmedName = name.trim();
  let message = `Hello ${trimmedName}`;

  if (numericAge > 25) {
    message += ' you are old!';
  }

  res.json({ message });
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
