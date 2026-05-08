import { sql } from "@vercel/postgres";

export async function saveContactInquiry(data: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}) {
  const { name, email, phone, message } = data;
  const result = await sql`
    INSERT INTO contacts (name, email, phone, message)
    VALUES (${name}, ${email}, ${phone ?? null}, ${message})
    RETURNING id, created_at
  `;
  return result.rows[0] as { id: number; created_at: string };
}

export async function createContactsTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS contacts (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      message TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
}
