import express from 'express'
import { pool } from '../db/pool.js'

const router = express.Router()

// Зөвшөөрсөн хүснэгтүүд
const allowedTables = [
  'segment1_company',
  'segment2_cost_center',
  'segment3_main_account',
  'segment4_product_service',
  'segment5_project',
  'segment6_inter_company',
  'segment7_related_party',
  'segment8_cash_flow',
  'segment9_modules',
  'segment10_reserve'
]

// ✅ GET all segment tables together
router.get('/all', async (req, res) => {
  try {
    const results = {}

    for (const table of allowedTables) {
      const { rows } = await pool.query(`SELECT * FROM ${table}`)
      results[table] = rows
    }

    res.json(results)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})


// ✅ GET all rows in one table
router.get('/:table', async (req, res) => {
  const { table } = req.params
  if (!allowedTables.includes(table)) {
    return res.status(400).json({ error: 'Invalid segment table' })
  }
  try {
    const { rows } = await pool.query(`SELECT * FROM ${table}`)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})


// ✅ POST
router.post('/:table', async (req, res) => {
  const { table } = req.params 
  if (!allowedTables.includes(table)) {
    return res.status(400).json({ error: 'Invalid segment table' })
  }

  const { code, name, active, gl, ar, ap, fa, cost, cash } = req.body
  try {
    await pool.query(
      `INSERT INTO ${table} (code, name, active, gl, ar, ap, fa, cost, cash) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [code, name, active, gl, ar, ap, fa, cost, cash]
    )
    res.json({ message: 'Inserted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ✅ PUT
router.put('/:table/:id', async (req, res) => {
  const { table, id } = req.params
  if (!allowedTables.includes(table)) {
    return res.status(400).json({ error: 'Invalid segment table' })
  }

  const { code, name, active, gl, ar, ap, fa, cost, cash } = req.body
  try {
    await pool.query(
      `UPDATE ${table} SET code = $1, name = $2, active = $3, gl = $4, ar = $5, ap = $6, fa = $7, cost = $8, cash = $9 WHERE id = $10`,
      [code, name, active, gl, ar, ap, fa, cost, cash, id]
    )
    res.json({ message: 'Updated' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ✅ DELETE
router.delete('/:table/:id', async (req, res) => {
  const { table, id } = req.params
  if (!allowedTables.includes(table)) {
    return res.status(400).json({ error: 'Invalid segment table' })
  }
  try {
    await pool.query(`DELETE FROM ${table} WHERE id = $1`, [id])
    res.json({ message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
