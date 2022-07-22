module.exports = (app) => {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    require("./middlewares")(app);
    require("./routes")(app);

    app.get("", (req, res) => {
        res.sendFile(path.join(__dirname, "..", "public/index.html"));
    });
};
