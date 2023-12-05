const express = require("express");
const exphbs = require("express-handlebars");
const app = express();

const HTTP_PORT = process.env.PORT || 8080;



// Serve static files from the "public" directory
app.use(express.static("public"));


// Assuming you have an asynchronous function that fetches student data
app.get('/students', (req, res) => {
  fetchStudentData()
    .then(data => {
      if (data.length > 0) {
        res.render('students', { students: data });
      } else {
        res.render('students', { message: 'No results' });
      }
    })
    .catch(error => {
      // Handle promise rejection, rendering an error message
      res.render('students', { message: 'Error fetching data' });
    });
});

// Assuming you have an asynchronous function that fetches course data
app.get('/courses', (req, res) => {
  fetchCourseData()
    .then(data => {
      if (data.length > 0) {
        res.render('courses', { courses: data });
      } else {
        res.render('courses', { message: 'No results' });
      }
    })
    .catch(error => {
      // Handle promise rejection, rendering an error message
      res.render('courses', { message: 'Error fetching data' });
    });
});



// GET route for '/courses/add'
app.get('/courses/add', (req, res) => {
  res.render('addCourse'); // Rendering the 'addCourse' view (which will be added later)
});

// Route to handle adding a new course (POST request)
app.post('/courses/add', (req, res) => {
  const courseData = req.body; 

  // Process the received course data and add it using your collegeData module
  collegeData.addCourse(courseData)
    .then(() => {
      res.redirect('/courses'); // Redirect to the courses page upon successful addition
    })
    .catch((error) => {
      res.status(500).send('Error adding course: ' + error); // Send error response
    });
});



// POST route for '/courses/update'
app.post('/courses/update', (req, res) => {
  const courseData = req.body; // Assuming course data is sent through the request body

  // Call your updateCourse function with the courseData
  updateCourse(courseData)
    .then(() => {
      res.redirect('/courses'); // Redirect to /courses after updating
    })
    .catch(error => {
      res.status(500).send('Unable to update course'); // Handle error if update fails
    });
});


app.get('/course/:id', (req, res) => {
  const courseId = req.params.id;

  // Retrieve course data by ID using collegeData module
  collegeData.getCourseById(courseId)
    .then((course) => {
      if (!course) {
        res.status(404).send('Course Not Found'); // Send 404 if no course data is found
      } else {
        // Render the "course" view with the retrieved course data
        res.render('course', { course }); // Replace 'course' with your actual view name and pass course data
      }
    })
    .catch((error) => {
      res.status(500).send('Error fetching course: ' + error); // Send error response
    });
});

// Route to handle deleting a specific course by ID
app.get('/course/delete/:id', (req, res) => {
  const courseId = req.params.id;

  // Invoke deleteCourseById from collegeData module to delete the course by ID
  collegeData.deleteCourseById(courseId)
    .then(() => {
      res.redirect('/courses'); // Redirect to the courses view upon successful deletion
    })
    .catch((error) => {
      res.status(500).send('Unable to Remove Course / Course not found: ' + error); // Send error response
    });
});

app.get('/student/delete/:studentNum', (req, res) => {
  const studentNum = req.params.studentNum;

  collegeData.deleteStudentByNum(studentNum)
    .then(() => {
      res.redirect('/students'); // Redirect to "/students" upon successful deletion
    })
    .catch(error => {
      res.status(500).send(`Unable to Remove Student: ${error}`); // Return 500 status and error message if an issue occurs
    });
});


collegeData
  .initialize()
  .then(() => {
    // Start the server
    app.listen(HTTP_PORT, () => {
      console.log(`Server is running on port ${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    console.error(`Error initializing data: ${err}`);
    // Optionally,.
  });
