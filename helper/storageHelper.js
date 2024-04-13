const util = require('util');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

class NoteStore {
  async readFromFile() {
    try {
      const data = await readFileAsync('db/db.json', 'utf8');
      return data;
    } catch (err) {
      console.error("Error reading file:", err);
      return [];
    }
  }

  async writeToFile(notes) {
    try {
      await writeFileAsync('db/db.json', JSON.stringify(notes));
    } catch (err) {
      console.error("Error writing file:", err);
    }
  }

  async getAllNotes() {
    try {
      const notesData = await this.readFromFile();
      let parsedNotes = [];
      try {
        parsedNotes = JSON.parse(notesData);
      } catch (err) {
        console.error("Error parsing JSON:", err);
      }
      return Array.isArray(parsedNotes) ? parsedNotes : [];
    } catch (err) {
      console.error("Error getting notes:", err);
      return [];
    }
  }

  async addNoteToStore(newNoteData) {
    try {
      const { title, text } = newNoteData;

      if (!title || !text) {
        throw new Error("Note 'title' and 'text' cannot be blank");
      }

      const newNote = { title, text, id: uuidv4() };
      const updatedNotes = await this.getAllNotes().then((notes) => [...notes, newNote]);
      await this.writeToFile(updatedNotes);
      return newNote;
    } catch (err) {
      console.error("Error adding note:", err);
      return null;
    }
  }

  async removeNoteFromStore(noteId) {
    try {
      const filteredNotes = await this.getAllNotes().then((notes) => notes.filter((note) => note.id !== noteId));
      await this.writeToFile(filteredNotes);
    } catch (err) {
      console.error("Error removing note:", err);
    }
  }
}

module.exports = new NoteStore();
