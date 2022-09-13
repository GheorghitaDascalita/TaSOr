const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`app is listening to PORT ${PORT}`);
})


mongoose.connect('mongodb://localhost/tasorDatabase');

mongoose.connection.on("error", (err) => {
    console.log("err", err);
});

mongoose.connection.on("connected", (err, res) => {
    console.log("mongoose is connected");
});


//database structure
const Schema = mongoose.Schema;

const usersSchema = new Schema({
    email: String,
    password: String
});

const ticketsSchema = new Schema({
    name: String,
    deadline: Date,
    start_time: Date,
    description: String,
    status: Boolean,
    url_proof: String,
    id_users: [{type: Schema.Types.ObjectId, ref: 'Users' }]
});

const categoriesSchema = new Schema({
    name: String,
    id_project: {type: Schema.Types.ObjectId, ref: 'Projects' },
    id_tickets: [{ type: Schema.Types.ObjectId, ref: 'Tickets'}]
});

const projectsSchema = new Schema({
    title: String,
    description: String,
    deadline: Date,
    id_categories: [{ type: Schema.Types.ObjectId, ref: 'Categories'}],
    id_users: [{type: Schema.Types.ObjectId, ref: 'Users' }]
});

const activitiesSchema = new Schema({
    id_project: {type: Schema.Types.ObjectId, ref: 'Projects' },
    operation: String,
    date: Date
});


const Users = mongoose.connection.model('Users', usersSchema)
const Tickets = mongoose.connection.model('Tickets', ticketsSchema);
const Projects = mongoose.connection.model('Projects', projectsSchema);
const Categories = mongoose.connection.model('Categories', categoriesSchema);
// const AssignmentsModel = mongoose.connection.model('Assignments', assignmentsSchema);
const Activities = mongoose.connection.model('Activities', activitiesSchema);
// const EnrollmentsModel = mongoose.connection.model('Enrollments', enrolledSchema);



//create database through create database row
const user = new Users({ email: 'George@yahoo.com', password: '1234567'});

const ticket = new Tickets({ name: 'Ticket1', deadline: Date.now(), start_time: Date.now(), description: 'First Ticket', status: false, url_proof: 'google.com'});

const project = new Projects({ title: 'Project1', description: 'Make Tasor', deadline: Date.now()});

const category = new Categories({ name: 'Backend'});

// const assignment = new Assignments({ id_user: '5e09e59a7656ac6a89b7c6c5', id_ticket: '5e09ed77572986ce2a1dc9c1' });

const activity = new Activities({ operation: 'Done Backend', date: Date.now()});

// const enrolled = new Enrollments({ id_user: '5e09e59a7656ac6a89b7c6c5', id_project: '5e09edce280cdf20c9db95dc' });

mongoose.connection.once('connected', (err) => {
    if (err) {
        return console.error('err');
    } else {
        Users.create(user, (err, document) => {
            if (err) {
                console.error(err);
            }
            console.log('++user\n', document);
        })

        Tickets.create(ticket, (err, document) => {
            if (err) {
                console.error(err);
            }
            console.log('++ticket\n', document);
        })

        Projects.create(project, (err, document) => {
            if (err) {
                console.error(err);
            }

            console.log('++project\n', document);
        })

        Categories.create(category, (err, document) => {
            if (err) {
                console.error(err);
            }
            console.log('++category\n', document);
        });

        // Assignments.create(assignment, (err, document) => {
        //     if (err) {
        //         console.error(err);
        //     }
        //     console.log('+++ document', document);
        // })

        Activities.create(activity, (err, document) => {
            if (err) {
                console.error(err);
            }

            console.log('++activity\n', document);
        })

        // Enrollments.create(enrolled, (err, document) => {
        //     if (err) {
        //         console.error(err);
        //     }
        //     console.log('+++ document', document);
        // })
    }

})

// async function f(){
//     const cat = new Categories({name:"Frontend", id:123, id_project:"5e09edce280cdf20c9db95dc"});
//     const tick = new Tickets({ name: 'Ticket1', deadline: Date.now(), start_time: Date.now(), description: 'First Ticket', status: false, url_proof: 'google.com', id: '5e09ed77572986ce2a1dc9c1' });
//     cat.tickets = [tick, tick];
//     const doc = await cat.save();
//     console.log(doc);
// }
// f();
