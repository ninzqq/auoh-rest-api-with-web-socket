const parameter_model = require("./parameter_model");
const app = require("./app");

// POST
const api_post_parameter = (req, res) => {
    let model = parameter_model(req.body);
    model
        .save()
        .then((model) => {
            app.broadcast_parameters_created(model);
            res.send(model);
        })
        .catch((err) => {
            res.status(500);
            res.send(err.message);
        });
}

// GET 
const api_get_parameter_sets = (req, res) => {
    parameter_model.find({}).then((parameters) => {
        res.send(parameters);
    });
}

const api_get_parameter = (req, res) => {
    const id = req.params.id;
    parameter_model.findById(id).then((parameter) => {
        res.send(parameter);
    }).catch(() => {
        res.status(404);
        res.send("Tool or parameter not found");
    });
}

// UPDATE
const api_put_parameter = (req, res) => {
    const id = req.params.id;
    parameter_model.findByIdAndUpdate(id, req.body).then((parameter) => {
        app.broadcast_parameter_change(parameter);
        res.send(parameter);
    }).catch(() => {
        res.status(404);
        res.send("Tool or parameter not found and therefore was not updated");
    });
}

// DELETE
const api_delete_parameter = (req, res) => {
    const id = req.params.id;
    parameter_model.findByIdAndDelete(id).then(() => {
        app.broadcast_parameter_deleted("Deletion accepted");
        res.status(202);
        res.send("Deletion accepted");
    }).catch(() => {
        res.status(404);
        res.send("Tool or parameter not found and therefore was not deleted");
    });
}


module.exports.api_post_parameter = api_post_parameter;
module.exports.api_get_parameter_sets = api_get_parameter_sets;
module.exports.api_get_parameter = api_get_parameter;
module.exports.api_put_parameter = api_put_parameter;
module.exports.api_delete_parameter = api_delete_parameter;