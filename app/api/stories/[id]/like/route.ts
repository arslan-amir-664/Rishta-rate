import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const result = await pool.query(
      'UPDATE stories SET likes = likes + 1 WHERE id = $1 RETURNING likes',
      [id]
    );
    return NextResponse.json({ likes: result.rows[0].likes });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to like' }, { status: 500 });
  }
}