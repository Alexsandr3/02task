import {BlogsViewType} from "../../src/types/blogs_types";
import {UsersViewType} from "../../src/types/users_types";

export const dataForCreateBlog_01 = {
    name: "supertest_01",
    youtubeUrl: "https://www.youtube.com/watch?v=vuzKKCYXISA"
}
export const dataForCreateBlog_02 = {
    name: "supertest_02",
    youtubeUrl: 'https://www.youtube.com/watch?v=cHVhpNrjcPs&list=PLcvhF2Wqh7DP4tZ851CauQ8GqgqlCocjk'
}
export const dataForCreateBlog_03 = {
    name: "supertest_03",
    youtubeUrl: 'https://www.youtube.com/watch?v=cH'
}
export const dataForCreateBlog_04 = {
    name: "supertest_04",
    youtubeUrl: "https://www.123.com/watch?v=vuzKKCYXISA234"
}
export const dataForCreateBlog_05 = {
    name: "supertest_05",
    youtubeUrl: "https://www.05.com"
}
export const dataForCreateUser_01 = {
    login: "admin123",
    password: "qwerty123",
    email: "Oooooo@com.com"
}
export const dataForCreateUser_02 = {
    login: "Belarus",
    password: "jiveBelarus2020",
    email: "2020@boom.com"
}
export const dataForCreateUser_03 = {
    login: "raccoon",
    password: "raccoon777",
    email: "raccoon@tut.by"
}
export const dataForCreateUser_04 = {
    login: "raccoon6",
    password: "raccoon6",
    email: "wer@tut.by"
}
export const dataForCreateUser_05 = {
    login: 1234,
    password: "raccoon6",
    email: "wer@tut.by"
}
export const dataForCreateUser_06 = {
    login: "jiveBelarus",
    password: 1231231,
    email: "wer@tut.by"
}
export const dataForCreateUser_07 = {
    login: "jive",
    password: "1231231",
    email: "wer@tut.by"
}
export const incorrectDataForCreateBlog_01 = {
    name: 123,
    youtubeUrl: "https://www.youtube.com/watch?v=vuzKKCYXISA"
}
export const incorrectDataForCreateBlog_02 = {
    name: 123,
    youtubeUrl: "https://www.youtube_123.com/watch?v=vuzKKCYXISA"
}
export const incorrectDataForCreatePost_01 = {
    title: 134,
    shortDescription: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus.",
    content: "I just forgot to say: from the start you need to have basic knowledge of JS",
    blogId: expect.any(String)
}
export const incorrectDataForCreatePost_02 = {
    title: 123,
    shortDescription: "have basic knowledge of JS",
    content: "I just forgot to say: from the start you need to have basic knowledge of JS",
    blogId: expect.any(String)
}
export const incorrectDataForCreatePost_03 = {
    title: 123,
    shortDescription: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus.",
    content: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc, quis gravida magna mi a libero. Fusce vulputate eleifend sapien. Vestibulum purus quam, scelerisque ut, mollis sed, nonummy id, metus. Nullam accumsan lorem in dui. Cras ultricies mi eu turpis hendrerit fringilla. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; In ac dui quis mi consectetuer lacinia. Nam pretium turpis et arcu. Duis arcu tortor, suscipit eget, imperdiet nec, imperdiet iaculis, ipsum. Sed aliquam ultrices mauris. Integer ante arcu, accumsan a, consectetuer eget, posuere ut, mauris. Praesent adipiscing. Phasellus ullamcorper ipsum rutrum nunc. Nunc nonummy metus. Vestibulum volutpat pretium libero. Cras id dui. Aenean ut eros et nisl sagittis vestibulum. Nullam nulla eros, ultricies sit amet, nonummy id, imperdiet feugiat, pede. Sed lectus. Donec mollis hendrerit risus. Phasellus nec sem in justo pellentesque facilisis. Etiam imperdiet imperdiet orci. Nunc nec neque. Phasellus leo dolor, tempus non, auctor et, hendrerit quis, nisi. Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo. Maecenas malesuada. Praesent congue erat at massa. Sed cursus turpis vitae tortor. Donec posuere vulputate arcu. Phasellus accumsan cursus velit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Sed aliquam, nisi quis porttitor congue, elit erat euismod orci, ac placerat dolor lectus quis orci. Phasellus consectetuer vestibulum elit. Aenean tellus metus, bibendum sed, posuere ac, mattis non, nunc. Vestibulum fringilla pede sit amet augue. In turpis. Pellentesque posuere. Praesent turpis. Aenean posuere, tortor sed cursus feugiat, nunc augue blandit nunc, eu sollicitudin urna dolor sagittis lacus. Donec elit libero, sodales nec, volutpat a, suscipit non, turpis. Nullam sagittis. Suspendisse pulvinar, augue ac venenatis condimentum, sem libero volutpat nibh, nec pellentesque velit pede quis nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Fusce id purus. Ut varius tincidunt libero. Phasellus dolor. Maecenas vestibulum mollis diam. Pellentesque ut neque. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. In dui magna, posuere eget, vestibulum et, tempor auctor, justo. In ac felis quis tortor malesuada pretium. Pellentesque auctor neque nec urna. Proin sapien ipsum, porta a, auctor quis, euismod ut, mi. Aenean viverra rhoncus pede. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Ut non enim eleifend felis pretium feugiat. Vivamus quis mi. Phasellus a est. Phasellus magna. In hac habitasse platea dictumst. Curabitur at lacus ac velit ornare lobortis. Curabitur a felis in nunc fringilla tristique. Morbi mattis ullamcorper velit. Phasellus gravida semper nisi. Nullam vel sem. Pellentesque libero tortor, tincidunt et, tincidunt eget, semper nec, quam. Sed hendrerit. Morbi ac felis. Nunc egestas, augue at pellentesque laoreet, felis eros vehicula leo, at malesuada velit leo quis pede. Donec interdum, metus et hendrerit aliquet, dolor diam sagittis ligula, eget egestas libero turpis vel mi. Nunc nulla. Fusce risus nisl, viverra et, tempor et, pretium in, sapien. Donec venenatis vulputate lorem. Morbi nec metus. Phasellus blandit leo ut odio. Maecenas ullamcorper, dui et placerat feugiat, eros pede varius nisi, condimentum viverra felis nunc et lorem. Sed magna purus, fermentum eu, tincidunt eu, varius ut, felis. In auctor lobortis lacus. Quisque libero metus, condimentum nec, tempor a, commodo mollis, magna. Vestibulum ullamcorper mauris at ligula. Fusce fermentum. Nullam cursus lacinia erat. Praesent blandit laoreet nibh. Fusce convallis metus id felis luctus adipiscing. Pellentesque egestas, neque sit amet convallis pulvinar, justo nulla eleifend augue, ac auctor orci leo non est. Quisque id mi. Ut tincidunt tincidunt erat. Etiam feugiat lorem non metus. Vestibulum dapibus nunc ac augue. Curabitur vestibulum aliquam leo. Praesent egestas neque eu enim. In hac habitasse platea dictumst. Fusce a quam. Etiam ut purus mattis mauris sodales aliquam. Curabitur nisi. Quisque malesuada placerat nisl. Nam ipsum risus, rutrum vitae, vestibulum eu, molestie vel, lacus. Sed augue ipsum, egestas nec, vestibulum et, malesuada adipiscing, dui. Vestibulum facilisis, purus nec pulvinar iaculis, ligula mi congue nunc, vitae euismod ligula urna in dolor. Mauris sollicitudin fermentum libero. Praesent nonummy mi in odio. Nunc interdum lacus sit amet orci. Vestibulum rutrum, mi nec elementum vehicula, eros quam gravida nisl, id fringilla neque ante vel mi. Morbi mollis tellus ac sapien. Phasellus volutpat, metus eget egestas mollis, lacus lacus blandit dui, id egestas quam mauris ut lacus. Fusce vel dui. Sed in libero ut nibh placerat accumsan. Proin faucibus arcu quis ante. In consectetuer turpis ut velit. Nulla sit amet est. Praesent metus tellus, elementum eu, semper a, adipiscing nec, purus. Cras risus ipsum, faucibus ut, ullamcorper id, varius ac, leo. Suspendisse feugiat. Suspendisse enim turpis, dictum sed, iaculis a, condimentum nec, nisi. Praesent nec nisl a purus blandit viverra. Praesent ac massa at ligula laoreet iaculis. Nulla neque dolor, sagittis eget, iaculis quis, molestie non, velit. Mauris turpis nunc, blandit et, volutpat molestie, porta ut, ligula. Fusce pharetra convallis urna. Quisque ut nisi. Donec mi odio, faucibus at, scelerisque quis, convallis",
    blogId: expect.any(String)
}
export const dataForUpdateBlog_01 = {
    name: "supertest",
    youtubeUrl: "https://www.supertest.com"
}

export const dataForComparisonBlog_01: BlogsViewType = {
    id: expect.any(String),
    name: "supertest_01",
    youtubeUrl: 'https://www.youtube.com/watch?v=vuzKKCYXISA',
    createdAt: expect.any(String)
}
export const dataForComparisonBlog_02: BlogsViewType = {
    id: expect.any(String),
    name: "supertest_02",
    youtubeUrl: 'https://www.youtube.com/watch?v=cHVhpNrjcPs&list=PLcvhF2Wqh7DP4tZ851CauQ8GqgqlCocjk',
    createdAt: expect.any(String)
}
export const dataForComparisonBlog_03: BlogsViewType = {
    id: expect.any(String),
    name: "supertest_03",
    youtubeUrl: 'https://www.youtube.com/watch?v=cH',
    createdAt: expect.any(String)
}
export const dataForComparisonBlog_04: BlogsViewType = {
    id: expect.any(String),
    name: "supertest_04",
    youtubeUrl: "https://www.123.com/watch?v=vuzKKCYXISA234",
    createdAt: expect.any(String)
}
export const dataForComparisonBlog_05: BlogsViewType = {
    id: expect.any(String),
    name: "supertest_05",
    youtubeUrl: "https://www.05.com",
    createdAt: expect.any(String)
}
export const dataForComparisonUser_01: UsersViewType = {
    id: expect.any(String),
    login: "admin123",
    email: "Oooooo@com.com",
    createdAt: expect.any(String)
}


export const paginationDataBlogs = {
    "pagesCount": 1,
    "page": 1,
    "pageSize": 10,
    "totalCount": 1,
    "items": [{
        id: expect.any(String),
        name: "supertest_03",
        youtubeUrl: 'https://www.youtube.com/watch?v=cH',
        createdAt: expect.any(String)
    }]
}
export const paginationDataPosts = {
    "pagesCount": 1,
    "page": 1,
    "pageSize": 10,
    "totalCount": 1,
    "items": [{
        id: expect.any(String),
        title: "01 - Way of the Samurai",
        shortDescription: "have basic knowledge of JS",
        content: "I just forgot to say: from the start you need to have basic knowledge of JS",
        blogId: expect.any(String),
        blogName: expect.any(String),
        createdAt: expect.any(String)
    }]
}
export const paginationDataUsers = {
    pagesCount: 1,
    page: 1,
    pageSize: 10,
    totalCount: 3,
    items: [
        {
            id: expect.any(String),
            login: 'jive',
            email: 'wer@tut.by',
            createdAt: expect.any(String)
        },
        {
            id: expect.any(String),
            login: 'raccoon6',
            email: 'wer@tut.by',
            createdAt: expect.any(String)
        },
        {
            id: expect.any(String),
            login: 'Belarus',
            email: '2020@boom.com',
            createdAt: expect.any(String)
        }
    ]
}

export const createdDataBlog_02 = {
    id: expect.any(String),
    name: "supertest_02",
    youtubeUrl: 'https://www.youtube.com/watch?v=cHVhpNrjcPs&list=PLcvhF2Wqh7DP4tZ851CauQ8GqgqlCocjk',
    createdAt: expect.any(String)
}
export const dataForCreatePost_01 = {
    title: "01 - Way of the Samurai",
    shortDescription: "have basic knowledge of JS",
    content: "I just forgot to say: from the start you need to have basic knowledge of JS"
}
export const dataForCreatePost_02 = {
    title: "123",
    shortDescription: "12345678",
    content: "12345678910"
}
