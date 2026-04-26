function validateEstimateForm() {
  let firstName = document.getElementById("first_name").value.trim();
  let lastName = document.getElementById("last_name").value.trim();
  let email = document.getElementById("email").value.trim();
  let phone = document.getElementById("phone").value.trim();
  let projectType = document.getElementById("project_type").value;
  let details = document.getElementById("project_details").value.trim();

  if (firstName === "") {
    alert("Please enter your first name.");
    return false;
  }

  if (lastName === "") {
    alert("Please enter your last name.");
    return false;
  }

  if (email === "" || email.indexOf("@") === -1 || email.indexOf(".") === -1) {
    alert("Please enter a valid email.");
    return false;
  }

  if (phone === "") {
    alert("Please enter your phone number.");
    return false;
  }

  if (projectType === "") {
    alert("Please select a project type.");
    return false;
  }

  if (details === "") {
    alert("Please describe your project.");
    return false;
  }

  return true;
}

function validateSearchForm() {
  let email = document.getElementById("search_email").value.trim();

  if (email === "") {
    alert("Please enter an email to search.");
    return false;
  }

  if (email.indexOf("@") === -1 || email.indexOf(".") === -1) {
    alert("Please enter a valid email.");
    return false;
  }

  return true;
}