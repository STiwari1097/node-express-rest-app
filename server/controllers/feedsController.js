exports.fetchPosts = (req, res, next) => {
    res.status(200).json([
        {
            title: 'Sherlock Holmes',
            content: 'He is a detective'
        },
        {
            title: 'Harry Potter',
            content: 'He is a wizard'
        }
    ]);
};

exports.createPost = (req, res, next) => {
    const title = req.body.title;
    const content = req.body.content;

    res.status(201).json({
        message: 'Post created successfully!',
        post: {
            id: new Date().toISOString(),
            title: title,
            content: content
        }
    });
};