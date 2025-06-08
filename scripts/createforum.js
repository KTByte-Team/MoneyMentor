let users = [];
var data = firebase.database().ref('users/');
data.once('value', (snapshot) => {
    users = snapshot.val();
});

var data = firebase.database().ref('forums/');
data.once('value', (snapshot) => {
    thisForum = snapshot.val();
});

function createForum() {
    let forumTitle = forceString(document.getElementById("forumTitle").value.trim());
    let forumContent = forceString(document.getElementById("forumContent").value.trim());

    let thisForum = new Forum(forumTitle, "General");
    let firstPost = new ForumPost(forumContent, JSON.parse(localStorage.getItem("entity")).id, []);

    if(forumTitle === "" || forumContent === "") {
        document.querySelector(".error").style.display = "block";
        document.querySelector(".error").innerHTML = "Please fill in all fields.";
        return;
    } else if(forumTitle.length < 10) {
        document.querySelector(".error").style.display = "block";
        document.querySelector(".error").innerHTML = "Forum title must be at least 10 characters.";
        return;
    } else if(forumContent.length < 25) {
        document.querySelector(".error").style.display = "block";
        document.querySelector(".error").innerHTML = "Forum content must be at least 25 characters.";
        return;
    }

    firebase.database().ref('forums/' + thisForum.id).set({
        title: thisForum.title,
        group: thisForum.group,
        views: thisForum.views,
        replies: thisForum.replies,
        posts: [firstPost],
        date: thisForum.date,
        id: thisForum.id
    }).then(() => {
        console.log("Forum created successfully.");
        window.location.href = "forum.html?id=" + thisForum.id;
    }).catch((error) => {
        console.error("Error creating forum:", error);
    });
}

$("#createForumSubmit").on("click", function() {
    createForum();
});