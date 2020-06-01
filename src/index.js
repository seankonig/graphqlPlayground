import { GraphQLServer } from 'graphql-yoga';
import { v4 as uuidv4 } from 'uuid';

const users = [
	{
		id: 'akfh-asjhdf-lfh-sdfas',
		name: 'Sean',
		email: 'sean@mail.com',
		age: 34,
		language: ['javascript', 'graphql', 'node'],
	},
	{
		id: 'dfg-h-tsdssdgsd-sdfg-dsgsd-dfas',
		name: 'Lizl',
		age: 40,
		email: 'lizl@mail.com',
		language: ['node'],
	},
	{
		id: 'dfg-h-ttyuoik-sdfg-dsgsd-dfas',
		name: 'Adam',
		age: 40,
		email: 'adam@mail.com',
		language: ['qraphql'],
	},
	{
		id: 'dfg-h-tsdd-sdfg-dsgsd-dfas',
		name: 'Danny',
		age: 40,
		email: 'danny@mail.com',
		language: ['javascript', 'graphql'],
	},
];

const projects = [
	{
		id: 'asdf-werq-asdffa-wew',
		title: 'Cat Tracker',
		techStack: ['angular', 'graphql', 'mongodb'],
		creator: 'akfh-asjhdf-lfh-sdfas',
	},
	{
		id: 'asdf-werq-sgh-wew',
		title: 'Git Clone',
		techStack: ['react', 'graphql', 'mongodb'],
		creator: 'dfg-h-tsdd-sdfg-dsgsd-dfas',
	},
	{
		id: 'asdf-asd-sdfesdffa-wew',
		title: 'Be Healty',
		techStack: ['angular', 'laravel'],
		creator: 'dfg-h-tsdssdgsd-sdfg-dsgsd-dfas',
	},
	{
		id: 'jkh-asfwe-asdffa-wew',
		title: 'Dev Stream',
		techStack: ['react', 'graphql', 'mongodb'],
		creator: 'dfg-h-ttyuoik-sdfg-dsgsd-dfas',
	},
];

const tasks = [
	{
		id: '5r6f-asdfe-asf-aw-df',
		task: 'Setup auth section',
		description: 'We need to create an auth guard',
		project: 'asdf-werq-asdffa-wew',
		creator: 'akfh-asjhdf-lfh-sdfas',
	},
	{
		id: 'erfs-34tdg-sadf4-afref',
		task: 'Implement graphql',
		description: 'Would love to have this setup',
		project: 'asdf-werq-asdffa-wew',
		creator: 'akfh-asjhdf-lfh-sdfas',
	},
];

// Type Definitions (application schema)
// The Schema also defines what our data looks like

// Scalar Types
// String, Boolean, Float, Int, ID

const typeDefs = `
	type Query {
		users(query: String): [User!]!
		me: User!
		projects(query: String): [Project!]!
		tasks: [Task!]!
	}

	type Mutation {
		createUser(name: String! email: String! age: Int): User!
		createPost(title: String! creator: String!): Project!
	}

	type User {
		id: ID!
		name: String!
		email: String!
		age: Int
		language: [String!]
		projects: [Project!]!
	}

	type Project {
		id: ID!
		title: String!
		techStack: [String!]!
		creator: User!
		tasks(query: String): [Task!]
	}

	type Task {
		id: ID!
		task: String!
		description: String!
		project: Project!
		creator: User!
	}
`;

//  There are four arguments that get passed to all resolver funtions
// parent,
// args(this is where the operation arguments are supplied)
// context
// info
const resolvers = {
	Query: {
		users(parent, args, ctx, info) {
			if (args.query) {
				return users.filter((user) => {
					return user.name
						.toLowerCase()
						.includes(args.query.toLowerCase());
				});
			}
			return users;
		},

		me() {
			return users[0];
		},

		projects(parent, args, ctx, info) {
			if (args.query) {
				return projects.filter((project) =>
					project.title
						.toLowerCase()
						.includes(args.query.toLowerCase())
				);
			}
			return projects;
		},

		tasks(parent, args, ctx, info) {
			if (args.query) {
				return tasks.filter((task) =>
					task.task.toLowerCase().includes(args.query.toLowerCase())
				);
			}
			return tasks;
		},
	},

	Mutation: {
		createUser(parent, args, ctx, info) {
			const emailTaken = users.some((user) => user.email === args.email);

			if (emailTaken) {
				throw new Error('The email is already in use');
			}
			const user = {
				id: uuidv4(),
				name: args.name,
				email: args.email,
				age: args.age,
			};

			users.push(user);

			return user;
		},

		createPost(parent, args, ctx, info) {
			const titleTaken = projects.some(
				(project) => project.title === args.title
			);

			if (titleTaken) {
				throw new Error(
					`You already have a project named ${args.title}`
				);
			}

			const project = {
				id: uuidv4(),
				title: args.title,
				creator: args.creator,
			};

			projects.push(project);
			return project;
		},
	},

	User: {
		projects(parent, args, ctx, info) {
			return projects.filter((project) => {
				return project.creator === parent.id;
			});
		},
	},
	Project: {
		creator(parent, args, ctx, info) {
			return users.find((user) => user.id === parent.creator);
		},
		tasks(parent, args, ctx, info) {
			if (args.query) {
				return tasks.filter((task) => {
					if (task.project === parent.id) {
						console.log(task);
						console.log(args.query);
						return task.task
							.toLowerCase()
							.includes(args.query.toLowerCase());
					}
				});
			}
			return tasks.filter((task) => task.project === parent.id);
		},
	},
};

const server = new GraphQLServer({ typeDefs, resolvers });

server.start(() => {
	console.log('server is up');
});

// Resolvers (Resolvers are just functions that can be performed on the api)
