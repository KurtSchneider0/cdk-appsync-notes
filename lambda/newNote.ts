const AWS = require('aws-sdk')
const ddbClient = new AWS.DynamoDB.DocumentClient()
const { v4: uuid } = require('uuid')
import Note from './Note'

async function createNote(note: Note) {
  if (!note.id) {
    note.id = uuid()
  }
  const paramaters = {
    TableName: process.env.PRODUCT_TABLE,
    Item: note
  }
  try {
    await ddbClient.put(paramaters).promise()
    return note
  } catch (error) {
    console.log('Error: ', error)
    return null
  }
}

export default createNote