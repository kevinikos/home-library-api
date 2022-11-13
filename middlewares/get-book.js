module.exports = async (req, res, next) => {
    let book;
    try {
        book = res.user.ownedBooks.find((book) => book._id === req.params.bookId);
        if (book === undefined) {
            return res.status(404).json({message: 'Cannot find book'});
        }
    } catch (err) {
        return res.status(500).json({message: err.message});
    }
    res.book = book;
    next();
}
