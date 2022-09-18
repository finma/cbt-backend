const landingPage = async (req, res) => {
  try {
    res.status(200).json({ error: false, message: "succes get landing page" });
  } catch (error) {
    res
      .status(500)
      .json({ error: true, message: error.message || "Internal server error" });
  }
};

module.exports = { landingPage };
