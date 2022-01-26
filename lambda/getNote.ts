const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient()

async function getNote(id: string) {
  const paramaters = {
    TableName: process.env.PRODUCT_TABLE,
    Key: { id: id }
  }
  try {
    const { Note } = await docClient.get(paramaters).promise()
    return Note
  } catch (error) {
    console.log('Error: ', error)
  }
}

export default getNote