import {
    BlogModelClass,
    CommentModelClass,
    DeviceModelClass,
    IpModelClass,
    PostModelClass,
    UserModelClass
} from "./schemas";


class TestsRepositories {
    async deleteAll() {
        await BlogModelClass.deleteMany({})
        await CommentModelClass.deleteMany({})
        await DeviceModelClass.deleteMany({})
        await IpModelClass.deleteMany({})
        await PostModelClass.deleteMany({})
        await UserModelClass.deleteMany({})
    }
}

export const testsRepositories = new TestsRepositories()