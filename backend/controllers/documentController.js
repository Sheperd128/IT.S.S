const Document = require('../models/Document');

const getDocuments = async (req, res) => {
  try {
    const { team, title } = req.user;
    let query = {};

    // Logic: Execs see everything. Regular members see Public + their own Subcommittee docs.
    if (team !== 'Executive') {
      query = {
        $or: [
          { visibility: 'Public' },
          { visibility: 'SubcommitteeOnly', targetSubcommittee: team }
        ]
      };
    }

    const docs = await Document.find(query).sort({ createdAt: -1 });
    res.json(docs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch documents' });
  }
};

const createDocument = async (req, res) => {
  try {
    const newDoc = await Document.create({
      ...req.body,
      uploadedBy: req.user.name,
      uploaderTeam: req.user.team
    });
    res.json(newDoc);
  } catch (error) {
    res.status(400).json({ message: 'Failed to upload document' });
  }
};

const deleteDocument = async (req, res) => {
  try {
    await Document.findByIdAndDelete(req.params.id);
    res.json({ message: 'Document archived.' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to delete' });
  }
};

module.exports = { getDocuments, createDocument, deleteDocument };