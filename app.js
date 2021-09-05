require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const Airtable = require("./services/Airtable");
const UrbanFox = require("./services/UrbanFox");

app.get('/', async (request, response) => {
    const airtable = new Airtable();
    const undeliveredTrackingOrders = await airtable.getUndeliveredOrders();

    const updatedRecords = [];
    const urbanFox = new UrbanFox();
    for (const order of undeliveredTrackingOrders) {
        const deliveryStatus = await urbanFox.getTrackingInfo(order.TrackingId);
        const lastDeliveryStatus = deliveryStatus.pop();
        await airtable.updateOrderDeliveryStatus(order.id, lastDeliveryStatus.activity)
        updatedRecords.push({trackingId: order.TrackingId, status: lastDeliveryStatus});
    }
    response.status(200).send(updatedRecords);
});

app.listen(port, () => {
    console.log(`Server started at port: ${port}`);
})
