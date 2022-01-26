const AWS = require('aws-sdk')
const ddbClient = new AWS.DynamoDB.DocumentClient()

async function deleteNote(id: string) {
  const paramaters = {
    TableName: process.env.PRODUCT_TABLE,
    Key: {
      id: id
    }
  }
  try {
    await ddbClient.delete(paramaters).promise()
    return id
  } catch (error) {
    console.log('Error: ', error)
    return null
  }
}

export default deleteNote