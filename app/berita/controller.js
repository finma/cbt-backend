const fs = require("fs");
const path = require("path");

const Berita = require("./model");
const config = require("../../config");

const getAllBerita = async (req, res) => {
  try {
    const { isActive } = req.query;

    const query = {};

    if (isActive) query["isActive"] = true;

    const berita = await Berita.find(query).sort({ _id: -1 });

    res.status(200).json({
      error: false,
      message: "get all berita success!",
      data: { berita },
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: true, message: error.message || "Internal server error" });
  }
};

const getOneBerita = async (req, res) => {
  try {
    const { id } = req.params;
    const berita = await Berita.findOne({ _id: id });

    res.status(200).json({
      error: false,
      message: "get berita success!",
      data: { berita },
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: true, message: error.message || "Internal server error" });
  }
};

const actionCreate = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      const { title, description } = req.body;

      if (req.file) {
        let tmp_path = req.file.path;
        let originalExt =
          req.file.originalname.split(".")[
            req.file.originalname.split(".").length - 1
          ];
        let filename = `${req.file.filename}.${originalExt}`;
        let target_path = path.resolve(
          config.ROOT_PATH,
          `public/uploads/${filename}`
        );

        const src = fs.createReadStream(tmp_path);
        const dest = fs.createWriteStream(target_path);

        src.pipe(dest);

        src.on("end", async () => {
          try {
            const berita = new Berita({
              title,
              description,
              userId: req.user._id,
              image: filename,
            });

            await berita.save();

            res.status(201).json({
              error: false,
              message: "create new berita success!",
              data: { berita },
            });
          } catch (error) {
            res.status(500).json({
              error: true,
              message: error.message || "Internal server error",
            });
          }
        });
      } else {
        const berita = new Berita({
          title,
          description,
          userId: req.user._id,
        });

        await berita.save();

        res.status(201).json({
          error: false,
          message: "create new berita success!",
          data: { berita },
        });
      }
    } else {
      res.status(401).json({
        error: true,
        message: "only admin can access this resource",
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: true, message: error.message || "Internal server error" });
  }
};

const actionUpdate = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      const { id } = req.params;
      const { title, description } = req.body;

      if (req.file) {
        let tmp_path = req.file.path;
        let originalExt =
          req.file.originalname.split(".")[
            req.file.originalname.split(".").length - 1
          ];
        let filename = `${req.file.filename}.${originalExt}`;
        let target_path = path.resolve(
          config.ROOT_PATH,
          `public/uploads/${filename}`
        );

        const src = fs.createReadStream(tmp_path);
        const dest = fs.createWriteStream(target_path);

        src.pipe(dest);

        src.on("end", async () => {
          try {
            const berita = await Berita.findOne({ _id: id });

            let currentImage = `${config.ROOT_PATH}/public/uploads/${berita.image}`;

            if (fs.existsSync(currentImage)) {
              fs.unlinkSync(currentImage);
            }

            await Berita.findOneAndUpdate(
              { _id: id },
              {
                title,
                description,
                userId: req.user._id,
                image: filename,
              }
            );

            res.status(201).json({
              error: false,
              message: "update berita success!",
              data: { berita },
            });
          } catch (error) {
            res.status(500).json({
              error: true,
              message: error.message || "Internal server error",
            });
          }
        });
      } else {
        await Berita.findOneAndUpdate(
          { _id: id },
          {
            title,
            description,
            userId: req.user._id,
          }
        );

        res.status(201).json({
          error: false,
          message: "update berita success!",
        });
      }
    } else {
      res.status(401).json({
        error: true,
        message: "only admin can access this resource",
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: true, message: error.message || "Internal server error" });
  }
};

const actionDelete = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      const { id } = req.params;

      const berita = await Berita.findByIdAndRemove({ _id: id });

      let currentImage = `${config.ROOT_PATH}/public/uploads/${berita.image}`;

      if (fs.existsSync(currentImage)) {
        fs.unlinkSync(currentImage);
      }

      res.status(200).json({
        error: false,
        message: "delete berita success!",
      });
    } else {
      res.status(401).json({
        error: true,
        message: "only admin can access this resource",
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: true, message: error.message || "Internal server error" });
  }
};

const changeStatus = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      const { id } = req.params;
      const { isActive } = req.body;

      await Berita.findOneAndUpdate({ _id: id }, { isActive });

      res.status(200).json({
        error: false,
        message: "change status berita success!",
      });
    } else {
      res.status(401).json({
        error: true,
        message: "only admin can access this resource",
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: true, message: error.message || "Internal server error" });
  }
};

module.exports = {
  getAllBerita,
  getOneBerita,
  actionCreate,
  actionUpdate,
  actionDelete,
  changeStatus,
};
