let users = [];
var data = firebase.database().ref('users/');
data.once('value', (snapshot) => {
    users = snapshot.val();
});

let forumListContainer = document.querySelector(".forum-list");

function makeHTML(users, forumObj) {
    return `
        <div class="forum">
            <div class="forum-left">
                <a href="forum.html?id=${forumObj.id}" class="forum-title">${forceString(forumObj.title)}</a>
                <p class="forum-date">${formatDateLong(forumObj.date)}</p>
            </div>
            <div class="forum-middle">
                <span class="forum-views">Views: ${forumObj.views}</span>
                <br>
                <span class="forum-replies">Replies: ${forumObj.posts.length - 1}</span>
            </div>
            <div class="forum-right">          
                <span class="form-timestamp">${formatDateShort(getMostRecentPost(forumObj).date)}</span>      
                <br>
                <span class="forum-reply">${forceString(users[getMostRecentPost(forumObj).author].name)}</span>
            </div>
        </div>
        `
}

function getMostRecentPost(forumObj) {
    if (forumObj.posts.length === 0) {
        return null;
    }
    return forumObj.posts[forumObj.posts.length - 1];
}

function loadForums() {
    var data = firebase.database().ref('forums/');
    data.once('value', (snapshot) => {
        let val = snapshot.val();
        let keys = Object.keys(val);
        let allForums = [];

        for(let i = 0; i < keys.length; i++) {
            let curForum = val[keys[i]];
            curForum.id = keys[i];
            allForums.push(curForum);
        }

        allForums.sort((a, b) => {
            const aRecentPost = getMostRecentPost(a);
            const bRecentPost = getMostRecentPost(b);

            if (!aRecentPost) return 1;
            if (!bRecentPost) return -1;

            return bRecentPost.date - aRecentPost.date;
        });

        forumListContainer.innerHTML = '';
        allForums.forEach(forum => {
            forumListContainer.innerHTML += makeHTML(users, forum);
        });
    });
}

loadForums();