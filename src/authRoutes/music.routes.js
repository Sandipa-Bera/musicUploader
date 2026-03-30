const express = require('express');
const musicController = require("../authControllers/music.controllers")
const authMiddleware = require("../authMiddleware/auth.middleware")
const multer = require('multer');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
})

const router = express.Router();


router.post("/upload", authMiddleware.authArtist, upload.single("music"), musicController.createMusic)

router.post("/album", authMiddleware.authArtist, musicController.createAlbum)

router.get("/artist-tracks", authMiddleware.authArtist, musicController.getArtistTracks)


router.get("/", authMiddleware.authUser, musicController.getAllMusics)
router.get("/albums", authMiddleware.authUser, musicController.getAllAlbums)

router.get("/albums/:albumId", authMiddleware.authUser, musicController.getAlbumById)



module.exports = router;