const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// MySQL connection
const db = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

/*db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to MySQL");
});*/

console.log("MySQL pool created");

// save estimate form data
app.post("/add-estimate", (req, res) => {
  const {
    first_name,
    last_name,
    email,
    phone,
    project_type,
    square_footage,
    budget_range,
    project_details
  } = req.body;

  const sql = `
    INSERT INTO estimates
    (first_name, last_name, email, phone, project_type, square_footage, budget_range, project_details)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [first_name, last_name, email, phone, project_type, square_footage, budget_range, project_details],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.send("Error saving estimate request.");
      }

      res.send(`
        <h1>Estimate Request Submitted</h1>
        <p>Thank you, ${first_name}. Your request has been saved.</p>
        <a href="/estimate.html">Go Back</a>
      `);
    }
  );
});

// search estimate by email
app.get("/search-estimate", (req, res) => {
  const { email } = req.query;

  const sql = "SELECT * FROM estimates WHERE email = ?";

  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error(err);
      return res.send("Error searching database.");
    }

    if (results.length === 0) {
      return res.send(`
        <h1>No Results Found</h1>
        <p>No estimate request found for email: ${email}</p>
        <a href="/search.html">Go Back</a>
      `);
    }

    let output = `
      <h1>Search Results</h1>
      <table border="1" cellpadding="10">
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Project Type</th>
          <th>Square Footage</th>
          <th>Budget</th>
          <th>Details</th>
        </tr>
    `;

    results.forEach((row) => {
      output += `
        <tr>
          <td>${row.id}</td>
          <td>${row.first_name} ${row.last_name}</td>
          <td>${row.email}</td>
          <td>${row.phone}</td>
          <td>${row.project_type}</td>
          <td>${row.square_footage}</td>
          <td>${row.budget_range}</td>
          <td>${row.project_details}</td>
        </tr>
      `;
    });

    output += `
      </table>
      <br>
      <a href="/search.html">Go Back</a>
    `;

    res.send(output);
  });
});

app.get("/export-estimates", (req, res) => {
  const sql = "SELECT * FROM estimates";

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.send("Error exporting estimate data.");
    }

    let csv = "ID,First Name,Last Name,Email,Phone,Project Type,Square Footage,Budget Range,Project Details,Created At\n";

    results.forEach((row) => {
      csv += `"${row.id}","${row.first_name}","${row.last_name}","${row.email}","${row.phone}","${row.project_type}","${row.square_footage}","${row.budget_range}","${row.project_details}","${row.created_at}"\n`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=chevron_estimates.csv");
    res.send(csv);
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});