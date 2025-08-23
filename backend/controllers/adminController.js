const fs = require('fs');
const path = require('path');
const csvParse = require('csv-parse');
const xlsx = require('xlsx');
const db = require('../database');

exports.bulkUpload = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  const filePath = path.resolve(req.file.path);
  const ext = path.extname(req.file.originalname).toLowerCase();
  let records = [];
  let errors = [];

  try {
    if (ext === '.csv') {
      const fileContent = fs.readFileSync(filePath);
      await new Promise((resolve, reject) => {
        csvParse(fileContent, { columns: true, trim: true }, (err, output) => {
          if (err) return reject(err);
          records = output;
          resolve();
        });
      });
    } else if (ext === '.xlsx' || ext === '.xls') {
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      records = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    } else if (ext === '.json') {
      records = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } else {
      return res.status(400).json({ error: 'Unsupported file type.' });
    }

    // Example: Insert candidates (expand as needed for services/payments)
    let inserted = 0;
    for (const rec of records) {
      try {
        // Basic candidate import example (expand for your schema)
        const [userId] = await db('users').insert({
          first_name: rec.first_name || rec.FirstName || rec.firstName,
          last_name: rec.last_name || rec.LastName || rec.lastName,
          email: rec.email,
          password_hash: '$2b$12$Gr0GbJbV5.SVrzvEcVxKYuY8FmiQE7J3tYh1iHY091yWepMSBxD9a',
          created_at: new Date(),
          updated_at: new Date()
        }).onConflict('email').ignore().returning('id');
        if (userId) {
          await db('candidate_profiles').insert({
            user_id: userId,
            position: rec.position,
            gender: rec.gender,
            age_group: rec.age_group,
            country: rec.country,
            qualifications: rec.qualifications,
            image_url: rec.image_url || '',
            created_at: new Date(),
            updated_at: new Date()
          }).onConflict('user_id').ignore();
        }
        inserted++;
      } catch (e) {
        errors.push({ record: rec, error: e.message });
      }
    }
    fs.unlinkSync(filePath); // Clean up uploaded file
    res.json({ success: true, inserted, errors });
  } catch (err) {
    fs.unlinkSync(filePath);
    res.status(500).json({ error: err.message });
  }
};

exports.getCandidates = async (req, res) => {
  try {
    const candidates = await db('users')
      .join('candidate_profiles', 'users.id', 'candidate_profiles.user_id')
      .select(
        'users.id',
        'users.first_name',
        'users.last_name',
        'users.email',
        'candidate_profiles.position',
        'candidate_profiles.gender',
        'candidate_profiles.age_group',
        'candidate_profiles.country',
        'candidate_profiles.qualifications',
        'candidate_profiles.image_url',
        'candidate_profiles.created_at'
      )
      .orderBy('candidate_profiles.created_at', 'desc');
    res.json({ candidates });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCandidate = async (req, res) => {
  const { id } = req.params;
  const {
    first_name,
    last_name,
    position,
    gender,
    age_group,
    country,
    qualifications
  } = req.body;
  try {
    await db('users').where({ id }).update({ first_name, last_name });
    await db('candidate_profiles').where({ user_id: id }).update({ position, gender, age_group, country, qualifications });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 