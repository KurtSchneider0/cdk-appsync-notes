const AWS = require('aws-sdk')
const ddbClient = new AWS.DynamoDB.DocumentClient()

async function listNotes() {
  const paramaters = {
    TableName: process.env.PRODUCT_TABLE
  }
  try {
    const data = await ddbClient.scan(paramaters).promise()
    return data.Items
  } catch (error) {
    console.log('Error: ', error)
    return null
  }
}

export default listNotes