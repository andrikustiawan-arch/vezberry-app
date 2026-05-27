import express from "express";

const app = express();

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
    res.send("ROOT OK");
});

app.get("/api/health", (req, res) => {
    res.json({
        success: true
    });
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`RUNNING PORT ${PORT}`);
});