const Kategori = require("./model");

const getAllKategori = async (req, res) => {
  try {
    const kategori = await Kategori.find({});

    res.status(200).json({
      error: false,
      message: "get all kategori success!",
      data: { kategori },
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: true, message: error.message || "Internal server error" });
  }
};

const actionCreate = async (req, res) => {
  try {
    if (req.user.role !== "public") {
      const { name } = req.body;

      const kategori = new Kategori({ name });

      await kategori.save();

      res.status(201).json({
        error: false,
        message: "create new kategori success!",
        data: { kategori },
      });
    } else {
      res.status(401).json({
        error: true,
        message: "public can't access this resource",
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
    if (req.user.role !== "public") {
      const { id } = req.params;
      const { name } = req.body;

      await Kategori.findOneAndUpdate({ _id: id }, { name });

      res.status(201).json({
        error: false,
        message: "update kategori success!",
      });
    } else {
      res.status(401).json({
        error: true,
        message: "public can't access this resource",
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
    if (req.user.role !== "public") {
      const { id } = req.params;

      await Kategori.findOneAndRemove({ _id: id });

      res.status(201).json({
        error: false,
        message: "delete kategori success!",
      });
    } else {
      res.status(401).json({
        error: true,
        message: "public can't access this resource",
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: true, message: error.message || "Internal server error" });
  }
};

module.exports = {
  getAllKategori,
  actionCreate,
  actionUpdate,
  actionDelete,
};
