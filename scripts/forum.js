const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const forumID = urlParams.get('id');

let users = [];
var data = firebase.database().ref('users/');
data.once('value', (snapshot) => {
    users = snapshot.val();
});

let thisForum;

var data = firebase.database().ref('forums/' + forumID);
data.once('value', (snapshot) => {
    thisForum = snapshot.val();

    document.querySelector("title").innerHTML = forceString(thisForum.title) + " | MoneyMentor";

    $(".forumTitleMain").html(forceString(thisForum.title));

    $(".forumPostedAuthor").html("<i class=\"fa-regular fa-circle-user\"></i> " + forceString(users[thisForum.posts[0].author].name));
    $(".forumPostedDate").html("<i class=\"fa-regular fa-clock\"></i> " + formatDateLong(thisForum.posts[0].date));

    let allPosts = thisForum.posts;

    let postsContainer = document.querySelector(".forumPosts");

    for(let i = 0; i < allPosts.length; i++) {
        let post = allPosts[i];
        let postNumber = i + 1;
        postsContainer.insertAdjacentHTML('beforeend', makeHTML(post, postNumber));

        let reactionsForPost = post.reactions === undefined ? [] : post.reactions;

        let reactionCounts = [0, 0, 0, 0, 0];
        for(let j = 0; j < reactionsForPost.length; j++) {
            let reactionType = reactionsForPost[j].type;
            if (reactionType >= 1 && reactionType <= 5) {
                reactionCounts[reactionType - 1]++;
            }
        }

        for(let j = 0; j < reactionCounts.length; j++) {
            let reactionCountElement = document.getElementById(`reactionCount${j + 1}&${postNumber - 1}`);
            if (reactionCountElement) {
                reactionCountElement.innerHTML = reactionCounts[j];
            }
        }

        let currentUserId = JSON.parse(localStorage.getItem("entity")).id;
        for(let j = 0; j < reactionsForPost.length; j++) {
            let reactionType = reactionsForPost[j].type;
            let reactorId = reactionsForPost[j].userID || reactionsForPost[j].userId || reactionsForPost[j].userid;
            if (reactionType >= 1 && reactionType <= 5 && reactorId === currentUserId) {
                let reactionElement = document.getElementById(`reaction${reactionType}&${postNumber - 1}`);
                if (reactionElement) {
                    reactionElement.innerHTML = reactionElement.innerHTML.replace("regular", "solid");
                }
            }
        }

        for(let j = 0; j < 5; j++) {
            let thisReactionButton = document.getElementById(`reaction${j + 1}&${postNumber - 1}`);
            thisReactionButton.addEventListener('click', function() {
                if (!this.innerHTML.includes("solid")) {
                    this.innerHTML = this.innerHTML.replace("regular", "solid");
                    reactionCounts[j]++;
                    document.getElementById(`reactionCount${j + 1}&${postNumber - 1}`).innerHTML = reactionCounts[j];

                    let reactionType = j + 1;
                    let userID = JSON.parse(localStorage.getItem("entity")).id;
                    let reactionObj = new Reaction(reactionType, post.id, userID);

                    reactionsForPost.push(reactionObj);

                    firebase.database().ref('forums/' + forumID + '/posts/' + (parseInt(this.id.split("&")[1])).toString()).update({
                        reactions: reactionsForPost,
                    });
                } else {
                    this.innerHTML = this.innerHTML.replace("solid", "regular");
                    reactionCounts[j]--;
                    document.getElementById(`reactionCount${j + 1}&${postNumber - 1}`).innerHTML = reactionCounts[j];

                    let reactionType = j + 1;
                    let userID = JSON.parse(localStorage.getItem("entity")).id;
                    reactionsForPost = reactionsForPost.filter(reaction => !(reaction.type === reactionType && reaction.postID === post.id && reaction.userID === userID));

                    firebase.database().ref('forums/' + forumID + '/posts/' + (parseInt(this.id.split("&")[1])).toString()).update({
                        reactions: reactionsForPost,
                    });
                }
            });
        }
    }

    let newViews = thisForum.views + 1;

    firebase.database().ref('forums/' + forumID).update({
        views: newViews,
    }).then(() => {
        console.log("Views updated successfully.");
    }).catch((error) => {
        console.error("Error updating views:", error);
    });
});

function replyToPost(postID) {
    let thisUser = JSON.parse(localStorage.getItem("entity"));

    let replyText = forceString(document.querySelector(".replyToForumTextArea").value.trim());

    if (replyText === "") {
        $(".replyErrorMessage").show();
        $(".replyErrorMessage").html("Please enter something.");

        return;
    } else if(replyText.length < 25) {
        $(".replyErrorMessage").show();
        $(".replyErrorMessage").html("Please enter at least 25 characters.");

        return;
    }

    $(".replyErrorMessage").hide();

    let newPost = new ForumPost(replyText, thisUser.id, []);

    let newPosts = [...thisForum.posts, newPost];

    firebase.database().ref('forums/' + postID).update({
        posts: newPosts,
    }).then(() => {
        document.querySelector(".replyToForumTextArea").value = "";

        window.location.reload();
    });
}

$(".replyToForumButton").on("click", function() {
    replyToPost(forumID);
});

function makeHTML(post, postNumber) {
    if(innerWidth < 800) {
        return (`
        <div class="forumPost">
            <div class="forumPostHeader">
                <div class="mobileWrapper">
                    <span class="forumPostDate">${formatDate(post.date)}</span>
                    <br>
                    <span class="forumPostNumber">#${postNumber}</span>
                </div>
                <br>
                <span class="forumPostReactions">
                    ${makeReactionHTML(postNumber)} 
                </span>
            </div>
            <div class="forumPostContent">
                <div class="forumPostInfo">
                    <div class="forumPostIcon"><i class="fa-regular fa-circle-user"></i></div>
                    <div class="forumPostAuthor">${forceString(users[post.author].name)}</div>
                </div>
                <div class="forumPostContentText">
                    ${forceString(post.content)}
                </div>
            </div>
        </div>
        `);
    } else {
        return (`
        <div class="forumPost">
            <div class="forumPostHeader">
                <span class="forumPostDate">${formatDate(post.date)}</span>
                <br>
                <span class="forumPostNumber">#${postNumber}</span>
                <br>
                <span class="forumPostReactions">
                    ${makeReactionHTML(postNumber)} 
                </span>
            </div>
            <div class="forumPostContent">
                <div class="forumPostInfo">
                    <div class="forumPostIcon"><i class="fa-regular fa-circle-user"></i></div>
                    <div class="forumPostAuthor">${forceString(users[post.author].name)}</div>
                </div>
                <div class="forumPostContentText">
                    ${forceString(post.content)}
                </div>
            </div>
        </div>
        `);
    }
}

function makeReactionHTML(postNumber) {
    return Object.entries(reactions).map(([key, { icon }], index) =>
        `<span class="reaction-icon reactionNo${index+1}" id="reaction${index + 1}&${postNumber - 1}" title="${reactions[index + 1].name}">${icon}</span>
         <span class="reaction-count" id="reactionCount${index + 1}&${postNumber - 1}">0</span>`
    ).join(' ');
}
