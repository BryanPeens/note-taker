const router = require('express').Router();
const store = require('../helper/storageHelper');

// GET "/api/notes" - Retrieve all notes
router.get('/notes', async (req, res) => {
  try {
    const notes = await store.getAllNotes();
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve notes' });
  }
});

// POST "/api/notes" - Add a new note
router.post('/notes', async (req, res) => {
  try {
    const newNote = await store.addNoteToStore(req.body);
    res.json(newNote);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add note' });
  }
});

// DELETE "/api/notes/:id" - Delete a note by id
router.delete('/notes/:id', async (req, res) => {
  const noteId = req.params.id;
  try {
    await store.removeNoteFromStore(noteId);
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

module.exports = router;
