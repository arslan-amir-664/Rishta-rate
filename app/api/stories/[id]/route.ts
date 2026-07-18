import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { token } = await req.json();

    // Verify the delete token matches
    const result = await pool.query(
      'SELECT delete_token FROM stories WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0)
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });

    if (result.rows[0].delete_token !== token)
      return NextResponse.json({ error: 'Invalid token' }, { status: 403 });

    await pool.query('DELETE FROM stories WHERE id = $1', [id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}