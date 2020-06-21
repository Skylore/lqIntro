const graphql = require('graphql')

const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLInt, GraphQLID, GraphQLList } = graphql

const User = require('../models/user')
const Group = require('../models/group')

const users = [
    { name: 'user1_name', age: 25, login: 'user1_login', creationDate: '2016-05-11', id: 'usr1'},
    { name: 'user2_name', age: 36, login: 'user2_login', creationDate: '2019-09-05', id: 'usr2'},
    { name: 'user3_name', age: 15, login: 'user3_login', creationDate: '2010-07-02', id: 'usr3'},
    { name: 'user4_name', age: 29, login: 'user4_login', creationDate: '2018-10-25', id: 'usr4'}
]

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        login: {type: GraphQLString},
        creationDate: {type: GraphQLString},
        id: {type: GraphQLID}
    })
})

const GroupType = new GraphQLObjectType({
    name: 'Group',
    fields: () => ({
        name: {type: GraphQLString},
        desc: {type: GraphQLString},
        id: {type: GraphQLID},
        users: {
            type: GraphQLList(UserType),
            resolve(parent, args) {
                return User.find({_id: {$in: parent.users}})
            }
        }
    })
})

const Query = new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
        user: {
            type: UserType,
            args: {
                id: {type: GraphQLID}
            },
            resolve(parent, args) {
                // return users.find(user => user.id === args.id)
                return User.findById(args.id)
            }
        },
        users: {
            type: GraphQLList(UserType),
            async resolve(parent, args) {
                return User.find({})
            }
        },
        groups: {
            type: GraphQLList(GroupType),
            async resolve(parent, args) {
                return Group.find({})
            }
        }
    })
})

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addUser: {
            type: UserType,
            args: {
                name: { type: GraphQLString },
                age: { type: GraphQLInt },
                login: { type: GraphQLString }
            },
            resolve(parent, args) {
                const user = new User({
                    name: args.name,
                    age: args.age,
                    login: args.login,
                    creationDate: (new Date()).toDateString()
                })

                return user.save()
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: Query,
    mutation: Mutation
})