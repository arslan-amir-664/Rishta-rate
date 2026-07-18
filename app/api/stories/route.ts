import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import crypto from 'crypto';

export async function GET() {
  try {
    const result = await pool.query(
      `SELECT id, name, title, content, city, likes,
       created_at AS "createdAt"
       FROM stories ORDER BY created_at DESC`
    );
    return NextResponse.json({ stories: result.rows });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch stories' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, title, content, city } = await req.json();

    if (!title || title.trim().length < 5)
      return NextResponse.json({ error: 'Title is too short' }, { status: 400 });
    if (!content || content.trim().length < 50)
      return NextResponse.json({ error: 'Story must be at least 50 characters' }, { status: 400 });

    const deleteToken = crypto.randomBytes(32).toString('hex');

    const result = await pool.query(
      `INSERT INTO stories (name, title, content, city, delete_token)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name?.trim() || 'Anonymous', title.trim(), content.trim(), city?.trim() || null, deleteToken]
    );

    const row = result.rows[0];
    return NextResponse.json({
      story: { ...row, createdAt: row.created_at },
      deleteToken,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to submit story' }, { status: 500 });
  }
}