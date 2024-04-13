const util = require('util');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Promisify file system functions
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

class StorageHelper {
  // Reads data from a file asynchronously
  async readFromFile() {
    try {
      const data = await readFileAsync('db/db.json', 'utf8');
      return data;
    } catch (err) {
      console.error("Error reading file:", err);
      throw err; // Re-throw the error for handling in the calling code
    }
  }

  // Writes data to a file asynchronously
  async writeToFile(notes) {
    try {
      await writeFileAsync('db/db.json', JSON.stringify(notes));
    } catch (err) {
      console.error("Error writing file:", err);
      throw err; // Re-throw the error for handling in the calling code
    }
  }

  // Retrieves all notes from the file
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
      throw err; // Re-throw the error for handling in the calling code
    }
  }

  // Adds a new note to the file
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
      throw err; // Re-throw the error for handling in the calling code
    }
  }

  // Removes a note from the file
  async removeNoteFromStore(noteId) {
    try {
      const filteredNotes = await this.getAllNotes().then((notes) => notes.filter((note) => note.id !== noteId));
      await this.writeToFile(filteredNotes);
    } catch (err) {
      console.error("Error removing note:", err);
      throw err; // Re-throw the error for handling in the calling code
    }
  }
}

module.exports = new StorageHelper();
