const express = require('express');
const { body } = require('express-validator');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { formLimiter } = require('../middleware/rateLimiters');

const router = express.Router();

const LAND_STATUSES = ['owner', 'leaseholder', 'community', 'other'];

// Public: Vera Outgrower Partnership Programme application — the multi-step
// form on /outgrower. Kept as its own table/route (distinct from the generic
// `leads` and `applications` tables) since it carries farm/land-specific
// fields and gets its own admin review screen + reference number.
router.post(
  '/outgrower/applications',
  formLimiter,
  [
    body('fullName').isString().trim().isLength({ min: 2, max: 120 }).withMessage('Please enter your full name.'),
    body('phone').isString().trim().isLength({ min: 6, max: 40 }).withMessage('Please enter a valid phone number.'),
    body('email')
      .optional({ checkFalsy: true })
      .isEmail()
      .withMessage('Please enter a valid email address.')
      .normalizeEmail(),
    body('state').isString().trim().isLength({ min: 2, max: 120 }).withMessage('Please enter your state.'),
    body('lga').isString().trim().isLength({ min: 2, max: 120 }).withMessage('Please enter your LGA.'),
    body('preferredContact').optional({ checkFalsy: true }).isString().trim().isLength({ max: 40 }),
    body('farmLocation')
      .isString()
      .trim()
      .isLength({ min: 2, max: 200 })
      .withMessage('Please enter your farm location.'),
    body('farmSize').isString().trim().isLength({ min: 1, max: 120 }).withMessage('Please enter your farm size.'),
    body('productionArea')
      .isString()
      .trim()
      .isLength({ min: 1, max: 120 })
      .withMessage('Please enter the available production area.'),
    body('landStatus').isString().trim().isIn(LAND_STATUSES).withMessage('Please select a valid land status.'),
    body('currentFarmingActivity').optional({ checkFalsy: true }).isString().trim().isLength({ max: 500 }),
    body('farmingExperience').optional({ checkFalsy: true }).isString().trim().isLength({ max: 500 }),
    body('preferredCrop').optional({ checkFalsy: true }).isString().trim().isLength({ max: 200 }),
    body('irrigationAvailable').optional().isBoolean().withMessage('Invalid value.'),
    body('existingInfrastructure').optional({ checkFalsy: true }).isString().trim().isLength({ max: 500 }),
    body('interests').optional().isArray({ max: 10 }).withMessage('Invalid selection.'),
    body('interests.*').isString().trim().isLength({ max: 80 }),
    body('message').optional({ checkFalsy: true }).isString().trim().isLength({ max: 4000 }),
    // Honeypot field — real applicants never fill this in.
    body('company_website').optional().isString().isLength({ max: 0 }).withMessage('Spam detected.'),
  ],
  validate,
  async (req, res) => {
    const {
      fullName,
      phone,
      email = '',
      state,
      lga,
      preferredContact = '',
      farmLocation,
      farmSize,
      productionArea,
      landStatus,
      currentFarmingActivity = '',
      farmingExperience = '',
      preferredCrop = '',
      irrigationAvailable = false,
      existingInfrastructure = '',
      interests = [],
      message = '',
    } = req.body;

    const info = await db
      .prepare(
        `INSERT INTO outgrower_applications
          (full_name, phone, email, state, lga, preferred_contact, farm_location, farm_size, production_area,
           land_status, current_farming_activity, farming_experience, preferred_crop, irrigation_available,
           existing_infrastructure, interests_json, message)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        fullName,
        phone,
        email,
        state,
        lga,
        preferredContact,
        farmLocation,
        farmSize,
        productionArea,
        landStatus,
        currentFarmingActivity,
        farmingExperience,
        preferredCrop,
        irrigationAvailable ? 1 : 0,
        existingInfrastructure,
        JSON.stringify(interests),
        message
      );

    // Reference number is derived from the row's own id once it's known, so
    // it's always unique with no extra counter table or race condition —
    // e.g. the 7th application in 2026 becomes "VRA-OG-2026-00007".
    const id = info.lastInsertRowid;
    const referenceNo = `VRA-OG-${new Date().getFullYear()}-${String(id).padStart(5, '0')}`;
    await db.prepare('UPDATE outgrower_applications SET reference_no = ? WHERE id = ?').run(referenceNo, id);

    res.status(201).json({
      success: true,
      referenceNo,
      message:
        'Thank you for applying to the Vera Outgrower Partnership Programme. Your application has been received and will be reviewed by our team — please keep your reference number for any follow-up.',
    });
  }
);

router.get('/admin/outgrower-applications', requireAuth, async (req, res) => {
  const status = req.query.status;
  const rows = status
    ? await db.prepare('SELECT * FROM outgrower_applications WHERE status = ? ORDER BY created_at DESC').all(status)
    : await db.prepare('SELECT * FROM outgrower_applications ORDER BY created_at DESC').all();
  res.json(rows);
});

router.patch(
  '/admin/outgrower-applications/:id',
  requireAuth,
  [body('status').isString().notEmpty()],
  validate,
  async (req, res) => {
    await db
      .prepare('UPDATE outgrower_applications SET status = ? WHERE id = ?')
      .run(req.body.status, req.params.id);
    res.json({ success: true });
  }
);

router.delete('/admin/outgrower-applications/:id', requireAuth, async (req, res) => {
  await db.prepare('DELETE FROM outgrower_applications WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
