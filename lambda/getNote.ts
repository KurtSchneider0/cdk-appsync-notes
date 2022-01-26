const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient()

async function getNote(id: string) {
  const paramaters = {
    TableName: process.env.PRODUCT_TABLE,
    Key: { id: id }
  }
  try {
    const { Item } = await docClient.get(paramaters).promise()
    return Item
  } catch (error) {
    console.log('Error: ', error)
  }
}

export default getNote
