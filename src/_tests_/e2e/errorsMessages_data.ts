export const errorByName = {
    "errorsMessages": [
        {
            "message": "name must be a string, must not be empty, length must be between 1 and 15 characters",
            "field": "name"
        }
    ]
}
export const errorByNameAndYoutubeUrl = {
    "errorsMessages": [
        {
            "message": "name must be a string, must not be empty, length must be between 1 and 15 characters",
            "field": "name"
        },
        {
            "message": "should be valid URL, length from 1 to 100 symbol",
            "field": "youtubeUrl"
        }
    ]
}
export const errorByTitleAndShortDescription = {
    "errorsMessages": [
        {
            "message": "title must be a string, must not be empty, length must be between 1 and 30 characters",
            "field": "title"
        },
        {
            "message": "shortDescription must be a string, must not be empty, length must be between 1 and 100 characters",
            "field": "shortDescription"
        }
    ]
}
export const errorByTitleAndShortDescriptionAndContentAndBlogId = {
    "errorsMessages": [
        {
            "message": "title must be a string, must not be empty, length must be between 1 and 30 characters",
            "field": "title"
        },
        {
            "message": "shortDescription must be a string, must not be empty, length must be between 1 and 100 characters",
            "field": "shortDescription"
        },
        {
            "message": "content must be a string, must not be empty, length must be between 1 and 1000 characters",
            "field": "content"
        },
        {
            "message": "blogId must be a string, must not be empty, blogId should be valid",
            "field": "blogId"
        }
    ]
}
export const errorByTitle = {
    "errorsMessages": [
        {
            "message": "title must be a string, must not be empty, length must be between 1 and 30 characters",
            "field": "title"
        }
    ]
}
export const errorByLogin = {
    "errorsMessages": [
        {
            "message": "login must be a string, must not be empty, length must be between 3 and 10 characters",
            "field": "login"
        }
    ]
}
export const errorByLoginAndPassword = {
    "errorsMessages": [
        {
            "message": "login must be a string, must not be empty, length must be between 3 and 10 characters",
            "field": "login"
        },
        {
            "message": "password must be a string, must not be empty, length must be between 6 and 20 characters",
            "field": "password"
        }
    ]
}
