const express = require('express');
const mongoose = require('mongoose');
const Response = require("../models/responseModel.js");

async function startTimer(email) {
    try {
        const collection = mongoose.connection.collection('Response');
        console.log(collection);
        const response = await collection.findOne({ email });
        if (!response) {
                    
            const currentTime = new Date();
            const futureTime = new Date(currentTime.getTime() + (20 * 60000));
            const startTime = currentTime.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' });
            const endTime = futureTime.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' });

            response = new Response({
                email: email,
                domain: req.domain,
                submissions : [],
                startTime: startTime,
                endTime :endTime,

            });
            
            await response.save();
            return 1;
        }
    } catch (error) {
        console.log(error);
        return 0;
    }
}
startTimer("amrit.sundarka2022@vitstudent.ac.in")
    .then(result => console.log("Timer started:", result))
    .catch(error => console.error("Error starting timer:", error)); 