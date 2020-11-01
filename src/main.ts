import serverless from "serverless-http"
import express from "express"
import { ApolloServer, gql } from "apollo-server-express"

const xmldata = `<?xml version="1.0"?><md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" xmlns:ds="http://www.w3.org/2000/09/xmldsig#" validUntil="2020-11-01T15:56:13.494Z"><md:SPSSODescriptor protocolSupportEnumeration="urn:oasis:names:tc:SAML:1.1:protocol urn:oasis:names:tc:SAML:2.0:protocol"><md:KeyDescriptor use="encryption"><ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#"><ds:X509Data><ds:X509Certificate>test</ds:X509Certificate></ds:X509Data></ds:KeyInfo></md:KeyDescriptor></md:SPSSODescriptor></md:EntityDescriptor>`

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.get("/api/info", (req, res) => {
  res.send({ application: "sample-app", version: "1" })
})
app.get("/api/xml", (req, res) => {
  res.set("Content-Type", "text/xml")
  res.send(xmldata)
})

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
  }
`

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => "Hello world!",
  },
}

const server = new ApolloServer({ typeDefs, resolvers, playground: true, introspection: true })

server.applyMiddleware({ app, path: "/api/graphql" })
//app.listen(3000, () => console.log(`Listening on: 3000`));
module.exports.handler = serverless(app)
