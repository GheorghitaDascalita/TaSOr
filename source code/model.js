const mongoose = require("mongoose");


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



const UsersModel = mongoose.connection.model('Users', usersSchema)
const TicketsModel = mongoose.connection.model('Tickets', ticketsSchema);
const CategoriesModel = mongoose.connection.model('Categories', categoriesSchema);
const ProjectsModel = mongoose.connection.model('Projects', projectsSchema);
// const AssignmentsModel = mongoose.connection.model('Assignments', assignmentsSchema);
const ActivitiesModel = mongoose.connection.model('Activities', activitiesSchema);
// const EnrollmentsModel = mongoose.connection.model('Enrollments', enrolledSchema);


module.exports = {
    Users: UsersModel,
    Tickets: TicketsModel,
    Categories: CategoriesModel,
    Projects: ProjectsModel,
    // Assignments: AssignmentsModel,
    Activities: ActivitiesModel,
    // Enrollments: EnrollmentsModel,
    Mongoose:mongoose
}
