import {
    BlogModelClass,
    CommentModelClass,
    DeviceModelClass,
    IpModelClass, LikeModelClass,
    PostModelClass,
    UserModelClass
} from "./schemas";


export class TestsRepositories {
    async deleteAll() {
        await BlogModelClass.deleteMany({})
        await CommentModelClass.deleteMany({})
        await DeviceModelClass.deleteMany({})
        await IpModelClass.deleteMany({})
        await PostModelClass.deleteMany({})
        await UserModelClass.deleteMany({})
        await LikeModelClass.deleteMany({})
    }
}

//export const testsRepositories = new TestsRepositories()