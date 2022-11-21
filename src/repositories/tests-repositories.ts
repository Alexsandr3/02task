import {
    blogsCollection,
    commentsCollection,
    deviceCollection,
    ipCollection,
    postsCollection,
    usersCollection
} from "./db";


class TestsRepositories {
    async deleteAll() {
        await blogsCollection.deleteMany({})
        await commentsCollection.deleteMany({})
        await deviceCollection.deleteMany({})
        await ipCollection.deleteMany({})
        await postsCollection.deleteMany({})
        await usersCollection.deleteMany({})
    }
}

export const testsRepositories = new TestsRepositories()