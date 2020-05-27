import { GraphQLServer } from 'graphql-yoga';

// Type Definitions (application schema)
// The Schema also defines what our data looks like
const typeDefs = `
	type Query {
		hello: String!
		name: String!
	}
`;

const resolvers = {
	Query: {
		hello() {
			// fetch from data
			return 'This is from graph ql';
		},
		name() {
			return 'Sean';
		},
	},
};

const server = new GraphQLServer({ typeDefs, resolvers });

server.start(() => {
	console.log('server is up');
});

// Resolvers (Resolvers are just functions that can be performed on the api)
