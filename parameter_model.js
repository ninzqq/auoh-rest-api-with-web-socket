const mongoose = require("mongoose");

const schema = new mongoose.Schema(
    {
        tool_name:{
            type: String,
            required: true
        },
        sister_number:{
            type: Number,
            required: true
        },
        material:{
            type: String,
            required: true
        },
        life: {
            type: String,
            required: true
        },
        cutting_speed:{
            type: Number,
            required: true
        },
        feed_rate:{
            type: Number,
            required: true
        }
    }
);

module.exports = mongoose.model("tool-parameter", schema);