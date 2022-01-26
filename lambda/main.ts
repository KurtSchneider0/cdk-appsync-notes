import listNotes from './listNotes';
import getNote from './getNote';
import newNote from './newNote';
import deleteNote from './deleteNote';
import Note from './Note';

type AppSyncEvent = {
   info: {
     fieldName: string
  },
   arguments: {
     id: string,
     category: string
     note: Note,
  },
  identity: {
    username: string,
    claims: {
      [key: string]: string[]
    }
  }
}

exports.handler = async (event:AppSyncEvent) => {
  switch (event.info.fieldName) {
    case "listNotes":
      return await listNotes()
    case "getNote":
      return await getNote(event.arguments.id)
    case "newNote":
      return await newNote(event.arguments.note)
    case "deleteNote":
      return await deleteNote(event.arguments.id)
    default:
      return null
  }
}