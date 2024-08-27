const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

let clients = [];

// Route to handle SSE connections
app.get("/events", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Add client to the list
    const clientId = Date.now();
    clients.push(res);

    // Handle client disconnect
    req.on("close", () => {
        clients = clients.filter((client) => client !== res);
    });
});

// Route to handle GET request with the parameter unlocked=true
app.get("/trigger", (req, res) => {
    const { unlocked } = req.query;

    if (unlocked === "true") {
        // Send a message to all connected clients
        clients.forEach((client) => client.write(`data: ${JSON.stringify({ message: "Unlock successful!" })}\n\n`));
        res.status(200).send("Message sent to all clients");
    } else {
        res.status(400).send("Invalid request");
    }
});

app.listen(PORT, () => {
    console.log(`SSE server running on port ${PORT}`);
});
