$(document).ready(function(){
    //global variables
    var topics = ["superman", "batman", "iron man", "captain america", "t'challa", "cat woman", "wonder woman", "spiderman", "thor", "ant man"]
    var buttonSection = $("#buttons-section");
    var gifSection = $("#gif-section");
    var apiKey = "HYDX2JWyrcreLQGD5IpY7N4aZGpxMrjB";
    var limit = 10

    //functions
    //this function takes everything in the topics array and creates a button, which goes in the button section
    function showButtons(){
        topics.forEach(function(val){
            var newButton = $("<button>");
            console.log(val);
            newButton.attr("value", val);
            newButton.addClass("select-hero");
            newButton.addClass("btn");
            newButton.text(val);

            buttonSection.append(newButton);
        });
    }

    //this function takes a string input and effectively adds a button by adding to the topics array and rerunning the showButtons functionn
    function addButton(hero){
        buttonSection.html("");
        topics.push(hero);
        showButtons();
    }

    //this function takes a string input and uses it in the GIPHY API query to retrieve the proper GIF information
    function showGifs(hero){
        gifSection.html("");
        var queryURL = "https://api.giphy.com/v1/gifs/search?api_key="+apiKey+"&q="+hero+"&limit="+limit;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response){
            var rowDiv = $("<div>");
            rowDiv.addClass("row mt-2");
            var rowCount = 1;
            response.data.forEach(function(val){
                var colDiv = $("<div>");
                colDiv.addClass("col-md-4 my-2 mr-2");
                var ratingDiv = $("<div>").text("Rating: "+ val.rating);
                colDiv.append(ratingDiv);

                var gif = $("<img>");
                gif.attr("src", val.images.fixed_width_still.url);
                gif.attr("data-animating", "false");
                //add multiple gif urls as data attributes that we can access later in our event listener
                gif.attr("data-still-url", val.images.fixed_width_still.url);
                gif.attr("data-animating-url", val.images.fixed_width.url);
                gif.addClass("gif-click");
                colDiv.append(gif);

                if (rowCount>2){
                    gifSection.append(rowDiv);
                    rowDiv = $("<div>");
                    rowDiv.addClass("row mt-2");
                    rowCount = 1;
                }

                rowDiv.append(colDiv);
                rowCount++;
            });

            gifSection.append(rowDiv);
        });
    }

    //event listeners, which use the above helper functions
    $("#submit-hero").on("click", function(event){
        event.preventDefault();
        addButton($("#hero-input").val());
        $("#hero-input").val(""); //clears textbox
    });

    $(document).on("click", ".select-hero", function(){
        showGifs($(this).val());
    });
    
    
    showButtons(); //shows buttons at the very start of the game
    $(document).on("click", ".gif-click", function(){
        console.log(this);
        if ($(this).attr("data-animating") == "false"){
            $(this).attr("src", $(this).attr("data-animating-url"));
            $(this).attr("data-animating", "true");
        }
        else{
            $(this).attr("src", $(this).attr("data-still-url"));
            $(this).attr("data-animating", "false");
        }
    })
});