// Make sure we wait to attach our handlers until the DOM is fully loaded.

// here we are getting the database for burgers
$(function () {
  $.ajax("/burgers", {
    type: "GET"
  }).then(function (data) {
    //calling our UL
    let noteatenElem = $("#notEatenBurgers");
    let eatenElem = $("#eatenBurgers");

    let burgers = data.burgers;
    let len = burgers.length;

    for (let i = 0; i < len; i++) {
      let new_elem =
        "<li>" +
        burgers[i].id +
        ". " + burgers[i].burger_name +
        "<button class='change-devour' data-id='" +
        burgers[i].id +
        "' data-newdevour='" +
        !burgers[i].devoured +
        "'>";

      if (burgers[i].devoured) {
        new_elem += "</button>";

        new_elem +=
          "<button class='delete-burger' data-id='" +
          burgers[i].id +
          "'>Finished!</button></li>";
      } else {
        new_elem += "Devour!";
      }

      if (burgers[i].devoured) {
        eatenElem.append(new_elem);
      } else {
        noteatenElem.append(new_elem);
      }
    }
  });

  $(document).on("click", ".change-devour", function (event) {
    let id = $(this).data("id");
    let newdevour = $(this).data("newdevour") === true;

    let newdevourState = {
      devoured: newdevour
    };

    // Send the PUT request.
    //UPGRADING THE DATA
    $.ajax("/burgers/" + id, {
      type: "PUT",
      data: JSON.stringify(newdevourState),
      dataType: 'json',
      contentType: 'application/json'
    }).then(function () {
      console.log("Changed devour to " + newdevour);
      // Reload the page to get the updated list
      location.reload();
    });
  });

  $(".create-form").on("submit", function (event) {
    // Make sure to preventDefault on a submit event.
    event.preventDefault();

    let newBurger = {
      burger_name: $("#burgerData").val().trim()
    };

    // Send the POST request.
    //CREATE
    $.ajax("/burgers", {
      type: "POST",
      data: JSON.stringify(newBurger),
      dataType: 'json',
      contentType: 'application/json'
    }).then(function () {
      console.log("Created new burger! " + newBurger);
      // Reload the page to get the updated list
      location.reload();
    });
  });

  $(document).on("click", ".delete-burger", function (event) {
    let id = $(this).data("id");

    // Send the DELETE request.
    $.ajax("/burgers/" + id, {
      type: "DELETE"
    }).then(function () {
      console.log("Deleted burger", id);
      // Reload the page to get the updated list
      location.reload();
    });
  });
});