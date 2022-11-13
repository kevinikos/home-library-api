const express = require('express');
const router = express.Router();
const getBook = require('../middlewares/get-book');
const checkAuth = require('../middlewares/check-auth');

// Getting all
router.get('/:userId', checkAuth, async (req, res) => {
    try {
        res.json(res.user.ownedBooks);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

// Getting one
router.get('/:userId/:bookId', checkAuth, getBook, (req, res) => {
    res.send(res.book);
});

// Creating one
router.post('/:userId', checkAuth, async (req, res) => {
    try {
        const isOwned = res.user.ownedBooks.find((book) => book._id === req.body._id);
        if (isOwned) {
            return res.status(409).json({message: 'Book already owned'});
        }
        res.user.ownedBooks.push(req.body);
        await res.user.save();
        res.status(201).json(req.body);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

// Deleting one
router.delete('/:userId/:bookId', checkAuth, getBook, async (req, res) => {
    try {
        res.user.ownedBooks = res.user.ownedBooks.filter((book) => book._id !== req.params.bookId);
        await res.user.save();
        res.json({message: 'Book deleted'});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

// Update borrow status
router.patch('/:userId/:bookId/borrow-status', checkAuth, getBook, async (req, res) => {
    try {
        res.book.isBorrowedTo = req.body.isBorrowed ? req.body.name : '';
        await res.user.save();
        res.json({message: 'Borrow status updated'});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

module.exports = router;
