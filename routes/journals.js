import express from 'express'
import { pool } from '../db/pool.js'

const router = express.Router()

// ✅ GET /api/journals
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, journal_num, journal_date, module, description, status, total_dr, total_cr
      FROM journal_entries
      ORDER BY journal_date DESC, journal_num
    `)
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ✅ GET /api/journals/:id (+ lines)
router.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const headerRes = await pool.query(`
      SELECT * FROM journal_entries WHERE lower(id::text) = lower($1)
    `, [id])

    if (headerRes.rows.length === 0)
      return res.status(404).json({ error: 'Journal not found' })

    const linesRes = await pool.query(`
      SELECT * FROM journal_entry_lines WHERE journal_id = $1 ORDER BY line_number
    `, [headerRes.rows[0].id])

    res.json({
      journal: headerRes.rows[0],  // ✔️ Нэрийг тааруулсан!
      lines: linesRes.rows
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ✅ POST /api/journals
import crypto from 'crypto';

router.post('/', async (req, res) => {
  const client = await pool.connect();
  try {
    const { journal, lines } = req.body;
    await client.query('BEGIN');

    const newId = journal.id ?? crypto.randomUUID();

    const insertHeader = await client.query(`
      INSERT INTO journal_entries (
        id, 
        journal_num, 
        tenant_id, 
        company_id, 
        journal_date, 
        creation_date,
        module, 
        description, 
        status, 
        total_dr, 
        total_cr, 
        user_name, 
        created_by, 
        created_at, 
        updated_at
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, 
        $7, $8, $9, $10, $11, $12, $13, NOW(), NOW()
      )
      RETURNING *
    `, [
      newId,
      journal.journal_num,
      journal.tenant_id,
      journal.company_id,
      journal.journal_date,
      journal.creation_date,
      journal.module,
      journal.description,
      journal.status,
      journal.total_dr,
      journal.total_cr,
      journal.user_name,
      journal.created_by
    ]);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      await client.query(`
        INSERT INTO journal_entry_lines (
          journal_id,
          journal_num,
          line_number,
          account_code,
          debit,
          credit,
          description
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        newId,
        journal.journal_num,
        i + 1,
        line.account_code,
        line.debit,
        line.credit,
        line.description
      ]);
    }

    await client.query('COMMIT');
    res.status(201).json(insertHeader.rows[0]);

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('POST /api/journals error:', err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});


// ✅ PUT /api/journals/:id (header + lines)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    journal,
    lines
  } = req.body;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Update journal_entries
    const result = await client.query(`
      UPDATE journal_entries
      SET
        journal_num = $1,
        journal_date = $2,
        creation_date = $3,
        module = $4,
        description = $5,
        status = $6,
        total_dr = $7,
        total_cr = $8,
        user_name = $9,
        updated_at = NOW()
      WHERE id = $10
      RETURNING *
    `, [
      journal.journal_num,
      journal.transaction_date,
      journal.creation_date,
      journal.module,
      journal.description,
      journal.status,
      journal.total_dr,
      journal.total_cr,
      journal.user_name,
      id
    ]);

    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Journal not found' });
    }

    // Delete old lines
    await client.query('DELETE FROM journal_entry_lines WHERE journal_id = $1', [id]);

    // Insert new lines
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      await client.query(`
        INSERT INTO journal_entry_lines (
          journal_id,
          journal_num,
          line_number,
          account_code,
          debit,
          credit,
          description
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        id,
        journal.journal_num,
        i + 1,
        line.account_code,
        line.debit,
        line.credit,
        line.description
      ]);
    }

    await client.query('COMMIT');
    res.json(result.rows[0]);

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('PUT /api/journals error:', err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// ✅ DELETE /api/journals/:id (+ lines)
router.delete('/:id', async (req, res) => {
  const { id } = req.params
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query('DELETE FROM journal_entry_lines WHERE journal_id = $1', [id])
    await client.query('DELETE FROM journal_entries WHERE id = $1', [id])
    await client.query('COMMIT')
    res.json({ message: 'Deleted' })
  } catch (err) {
    await client.query('ROLLBACK')
    res.status(500).json({ error: err.message })
  } finally {
    client.release()
  }
})

export default router
