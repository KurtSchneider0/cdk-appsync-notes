import * as cdk from '@aws-cdk/core';
import * as cognito from '@aws-cdk/aws-cognito';
import * as appsync from '@aws-cdk/aws-appsync';
import * as ddb from '@aws-cdk/aws-dynamodb';
import * as lambda from '@aws-cdk/aws-lambda';

export class CdkFinalProjectStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const userPool = new cognito.UserPool(this, 'notes-user-pool', {
      selfSignUpEnabled: true,
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      userVerification: {
        emailStyle: cognito.VerificationEmailStyle.CODE
      },
      autoVerify: {
        email: true
      },
      standardAttributes: {
        email: {
          required: true,
          mutable: true
        }
      }
    })

    const userPoolClient = new cognito.UserPoolClient(this, "notes-user-pool-client", {
      userPool
    })

    const api = new appsync.GraphqlApi(this, 'notes-api', {
      name: 'notes-api',
      logConfig: {
        fieldLogLevel: appsync.FieldLogLevel.ALL,
      },
      schema: appsync.Schema.fromAsset('./graphql/schema.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: cdk.Expiration.after(cdk.Duration.days(365))
          }
        },
        additionalAuthorizationModes: [{
          authorizationType: appsync.AuthorizationType.USER_POOL,
          userPoolConfig: {
            userPool,
          }
        }]
      },
    })
    
    const notesLambda = new lambda.Function(this, "lambdaId", {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: "main.handler",
    })

    const lambdaDs = api.addLambdaDataSource('notesLambdaDatasource', notesLambda)

    const notesTable = new ddb.Table(this, 'CDKNotesTable', {
      billingMode: ddb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'id',
        type: ddb.AttributeType.STRING,
      },
    })

    notesTable.grantFullAccess(notesLambda)
    notesLambda.addEnvironment('PRODUCT_TABLE', notesTable.tableName)

    lambdaDs.createResolver({
      typeName: "Query",
      fieldName: "listNotes"
    })
    lambdaDs.createResolver({
      typeName: "Query",
      fieldName: "getNote"
    })

    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "newNote"
    })

    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "deleteNote"
    })
  }
}
