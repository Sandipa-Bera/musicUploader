const musicModel = require("../models/music.model");
const albumModel = require("../models/album.model");
const { uploadFile } = require("../services/storage.services");

async function createMusic(req, res) {
    try {
        const { title } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: "Audio file is required" });
        }

        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }

        const result = await uploadFile(file.buffer, file.originalname);

        const music = await musicModel.create({
            uri: result.secure_url,
            title,
            artist: req.user.id,
        });

        return res.status(201).json({
            message: "Music created successfully",
            music: {
                id: music._id,
                uri: music.uri,
                title: music.title,
                artist: music.artist,
            },
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function createAlbum(req, res) {
    try {
        const { title, musics } = req.body;

        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }

        const album = await albumModel.create({
            title,
            artist: req.user.id,
            musics: musics || [],
        });

        return res.status(201).json({
            message: "Album created successfully",
            album: {
                id: album._id,
                title: album.title,
                artist: album.artist,
                musics: album.musics,
            },
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function getAllMusics(req, res) {
    try {
        const musics = await musicModel.find().populate("artist", "username email");

        return res.status(200).json({
            message: "Musics fetched successfully",
            musics,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function getAllAlbums(req, res) {
    try {
        const albums = await albumModel
            .find()
            .select("title artist")
            .populate("artist", "username email");

        return res.status(200).json({
            message: "Albums fetched successfully",
            albums,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function getAlbumById(req, res) {
    try {
        const albumId = req.params.albumId;

        const album = await albumModel
            .findById(albumId)
            .populate("artist", "username email")
            .populate("musics");

        if (!album) {
            return res.status(404).json({ message: "Album not found" });
        }

        return res.status(200).json({
            message: "Album fetched successfully",
            album,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function getArtistTracks(req, res) {
    try {
        const tracks = await musicModel.find({ artist: req.user.id });
        return res.status(200).json({
            message: "Artist tracks fetched successfully",
            tracks,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { createMusic, createAlbum, getAllMusics, getAllAlbums, getAlbumById, getArtistTracks };