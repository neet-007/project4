document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("#new-post-button").addEventListener('click', post_post);
    document.querySelector("#all-posts").addEventListener('click', load_posts);
    document.querySelector("#only-following").addEventListener('click', load_only_following)
    hide('reply-card')
    set_none();
    
})

// Functions to set all elements in a page to be invisible
function set_none(){
    let a = document.querySelectorAll('.twitter')
    for(let i = 0; i < a.length; i++){
        a[i].style.display = 'none';
    }
}

// Function to hide one element
function hide(element){
    document.querySelector(`#${element}`).style.display = 'none';
}

// Function to set intendent elements to be visiable
function show(element){
    document.querySelector(`#${element}`).style.display = 'block';
}

// Function to handle replys
function reply(event){
    // routin
    console('reply')

    // Get form info
    const form = document.querySelector("#reply-input")
    const form_value = form.value

    //Posting the form using API
    fetch(`/reply/${temp}`,{
        method: "POST",
        body: JSON.stringify({
            reply: form,
            post_id: post_id
        })
    })
    .then(response => response.json())
    .then(results =>{
        console.log(results)
    })
}
// Function to handle the new posts
function post_post(event){
    // routin 
    event.preventDefault()
    console.log('hi')

    // Get form info
    const form = document.querySelector("#new-post-input")
    const form_value = form.value
    console.log(form_value)

    // Posting the form using an API
    fetch('/new post',{
        method: "POST",
        body: JSON.stringify({
            form: form_value
        })

    })
    .then(response => response.json())
    .then(result => {
       // Print result
       console.log(result);
       load_posts(event);
  });
}

// Function to handle loading the posts
function load_posts(event){
    // routin
    event.preventDefault();
    console.log('hi');

    // Hide all elements then show intendent
    set_none();
    show('new-post');
    show('posts');

    if(document.querySelector("#list-group-container-id")!==null){
        document.querySelector("#list-group-container-id").remove()
    }
    if (document.querySelector('#list-group-id-user') !==null){
        document.querySelector('#list-group-id-user').remove()
    }

    // Getting posts
    fetch(`/show posts`)
    .then(response => response.json())
    .then(posts => {
        fetch("/user auth")
        .then(response => response.json())
        .then(user =>{
            // Print the result
        console.log(posts);
        // Make a group list to contain the posts
        const list_group_container = document.createElement('ul');
        list_group_container.className = 'list-group';
        list_group_container.id = 'list-group-container-id'
        document.querySelector('#posts-container').append(list_group_container);
        // Loop over the posts
        let i = 0;
        posts.forEach((post) =>{
            // Make the group-item elements
            const list_group_item = document.createElement('li');
            // Give it a class
            list_group_item.className = 'list-group-item';
            // Give an id
            list_group_item.id = `post${post.pk}`
            // Add the data to the element
            list_group_item.innerHTML =`<label id="id${i}" class="user-name-class">${post.fields.user_name} </label> <div class="post-content-class list-group-item">${post.fields.content_post}</div> <div class="row justify-content-center"><div class="col">${post.fields.time_post}</div> <div id="like${post.pk}" class="col"><i class="bi bi-heart like-class"></i></div><div id="unlike${post.pk}" class="col"><i class="bi bi-heart-fill unlike-class"></i></div><div id="like-count${post.pk}" class="col">${post.fields.likes}</div></div> <div id="reply-div${post.pk}"><label id="reply${post.pk}" class="row reply-button-class">Reply</label><label id="show-reply${post.pk}" class="row reply-button-class">Show Replys</label></div><div class="container-fluid" id="reply-container${post.pk}"></div>`;
            // Add the element to the group
            list_group_container.append(list_group_item);
            fetch(`/update like/${post.pk}`)
            .then(response => response.json())
            .then(like =>{
                const likes = like[0].fields.likes;
                console.log(likes);
                if (likes == 0){
                    hide(`unlike${post.pk}`)
                    show(`like${post.pk}`)
                }
                else{
                    hide(`like${post.pk}`)
                    show(`unlike${post.pk}`)
                }
                
    
        })
            // Check if user is the poster
            if (user[0].pk === post.fields.user)
            {
                const edit_button = document.createElement('label')
                edit_button.id = `edit-button${post.pk}`
                edit_button.className = 'edit-button-class'
                edit_button.innerHTML = 'Edit'
                list_group_item.append(edit_button)
                document.querySelector(`#edit-button${post.pk}`).addEventListener('click', () => edit(event, post.pk, post.fields.content_post))
            }
            

            // Check if user wants to update the likes or view a profile
            document.querySelector(`#id${i}`).addEventListener('click', () => load_profile(event, post.fields.user));
            document.querySelector(`#like${post.pk}`).addEventListener('click', () => add_like(event, post.pk, 'like'));
            document.querySelector(`#unlike${post.pk}`).addEventListener('click', () => add_like(event, post.pk, 'unlike'));
            document.querySelector(`#show-reply${post.pk}`).addEventListener('click', () => {
                fetch(`/show reply/${post.pk}`)
                .then(response => response.json())
                .then(replys =>{
                    fetch("/user auth")
                    .then(response => response.json())
                    .then(user_r =>{
                        // Make a group list to contain the posts
                        console.log(replys)
                        const list_group_container_r = document.createElement('ul');
                        list_group_container.className = 'list-group';
                        document.querySelector(`#reply-container${post.pk}`).append(list_group_container_r);
                        let k = 0
                        // Loop over replys
                        replys.forEach(reply => {
                            // Make the group-item elements
                            const list_group_item_r = document.createElement('li');
                            // Give it a class
                            list_group_item_r.className = 'list-group-item';
                            // Give an id
                            list_group_item_r.id = `post${reply.pk}`
                            // Add the data to the element
                            list_group_item_r.innerHTML = `<label id="id${k}" class="user-name-class">${reply.fields.user_name} </label> <div class="post-content-class list-group-item">${reply.fields.content_post}</div> <div class="row justify-content-center"><div class="col">${reply.fields.time_post}</div> <div id="like${reply.pk}" class="col"><i class="bi bi-heart like-class"></i></div><div id="unlike${reply.pk}" class="col"><i class="bi bi-heart-fill unlike-class"></i></div><div id="like-count${reply.pk}" class="col">${reply.fields.likes}</div></div> <div id="reply-div${reply.pk}"><label id="reply${reply.pk}" class="row reply-button-class">Reply</label></div><div class="container-fluid" id="reply-container"></div>`;
                            // Add the element to the group
                            list_group_container_r.append(list_group_item_r);
                            fetch(`/update like_r/${reply.pk}`)
                            .then(response => response.json())
                            .then(like =>{
                                const likes = like[0].fields.likes;
                                console.log(likes);
                                if (likes == 0){
                                    hide(`unlike${reply.pk}`)
                                    show(`like${reply.pk}`)
                                }
                                else{
                                    hide(`like${reply.pk}`)
                                    show(`unlike${reply.pk}`)
                                }
                                
                            })
                            // Check if user is the poster
                            if (user_r[0].pk === reply.fields.user)
                            {
                                const edit_button_r = document.createElement('label')
                                edit_button_r.id = `edit-button${reply.pk}`
                                edit_button_r.className = 'edit-button-class'
                                edit_button_r.innerHTML = 'Edit'
                                list_group_item_r.append(edit_button_r)
                                document.querySelector(`#edit-button${reply.pk}`).addEventListener('click', () => edit(event, reply.pk, reply.fields.content_post))
                            }
                            // Check if user wants to update the likes or view a profile
                            document.querySelector(`#id${k}`).addEventListener('click', () => load_profile(event, reply.fields.user));
                            document.querySelector(`#like${reply.pk}`).addEventListener('click', () => add_like(event, reply.pk, 'like_r'));
                            document.querySelector(`#unlike${reply.pk}`).addEventListener('click', () => add_like(event, reply.pk, 'unlike_r'));                                
                        });
                    })
                    
                })
            })
            document.querySelector(`#reply${post.pk}`).addEventListener('click', () => {
                const reply_button_create = document.createElement('button')
                reply_button_create.type = 'button'
                reply_button_create.className = 'btn btn-primary'
                reply_button_create.id = `reply-button${post.pk}` 
                reply_button_create.innerHTML = 'Reply'
                document.querySelector(`#reply-card`).append(reply_button_create)
                document.querySelector(`#reply-div${post.pk}`).append(document.querySelector("#reply-card"));
                show('reply-card');
                document.querySelector(`#reply-button${post.pk}`).addEventListener('click', () =>{
                    hide("reply-card")
                    document.querySelector(`#reply-button${post.pk}`).remove()
                    // routin
                    console.log('reply')

                    // Get form info
                    const form = document.querySelector("#reply-input")
                    const form_value = form.value
                    //Posting the form using API
                    fetch(`/reply`,{
                        method: "POST",
                        body: JSON.stringify({
                            reply: form_value,
                            post_id: post.pk
                        })
                    })
                    .then(response => response.json())
                    .then(results =>{
                        console.log(results)
                        fetch(`/show reply/${post.pk}`)
                        .then(response => response.json())
                        .then(replys =>{
                            fetch("/user auth")
                            .then(response => response.json())
                            .then(user_r =>{
                                // Make a group list to contain the posts
                                console.log(replys)
                                const list_group_container_r = document.createElement('ul');
                                list_group_container_r.className = 'list-group';
                                document.querySelector(`#reply-container${post.pk}`).append(list_group_container_r);
                                let k = 0
                                // Loop over replys
                                replys.forEach(reply => {
                                    // Make the group-item elements
                                    const list_group_item_r = document.createElement('li');
                                    // Give it a class
                                    list_group_item_r.className = 'list-group-item';
                                    // Give an id
                                    list_group_item_r.id = `post${reply.pk}`
                                    // Add the data to the element
                                    list_group_item_r.innerHTML = `<label id="id${k}" class="user-name-class">${reply.fields.user_name} </label> <div class="post-content-class list-group-item">${reply.fields.content_post}</div> <div class="row justify-content-center"><div class="col">${reply.fields.time_post}</div> <div id="like${reply.pk}" class="col"><i class="bi bi-heart like-class"></i></div><div id="unlike${reply.pk}" class="col"><i class="bi bi-heart-fill unlike-class"></i></div><div id="like-count${reply.pk}" class="col">${reply.fields.likes}</div></div> <div id="reply-div${reply.pk}"><label id="reply${reply.pk}" class="row reply-button-class">Reply</label></div><div class="container-fluid" id="reply-container"></div>`;
                                    // Add the element to the group
                                    list_group_container_r.append(list_group_item_r);
                                    fetch(`/update like_r/${reply.pk}`)
                                    .then(response => response.json())
                                    .then(like =>{
                                        const likes = like[0].fields.likes;
                                        console.log(likes);
                                        if (likes == 0){
                                            hide(`unlike${reply.pk}`)
                                            show(`like${reply.pk}`)
                                        }
                                        else{
                                            hide(`like${reply.pk}`)
                                            show(`unlike${reply.pk}`)
                                        }
                                        
                                    })
                                    // Check if user is the poster
                                    if (user_r[0].pk === reply.fields.user)
                                    {
                                        const edit_button_r = document.createElement('label')
                                        edit_button_r.id = `edit-button${reply.pk}`
                                        edit_button_r.className = 'edit-button-class'
                                        edit_button_r.innerHTML = 'Edit'
                                        list_group_item_r.append(edit_button_r)
                                        document.querySelector(`#edit-button${reply.pk}`).addEventListener('click', () => edit(event, reply.pk, reply.fields.content_post))
                                    }
                                    // Check if user wants to update the likes or view a profile
                                    document.querySelector(`#id${k}`).addEventListener('click', () => load_profile(event, reply.fields.user));
                                    document.querySelector(`#like${reply.pk}`).addEventListener('click', () => add_like(event, reply.pk, 'like_r'));
                                    document.querySelector(`#unlike${reply.pk}`).addEventListener('click', () => add_like(event, reply.pk, 'unlike_r'));                                
                                });
                            })
                            
                        })
                    })
                })
                
                
            });
            
            i++;
        })
        })
        
        
    })
}

// Function to add likes
function add_like(event, post, status)
{
    if (status === 'like'){
         
        fetch(`/add like/${post}`,{
            method: "PUT",
            body: JSON.stringify({
                likes: 'like'
            })
        })
        .then(()=>{
            // Update the likes without user refreshing
            fetch(`/update like/${post}`)
            .then(response => response.json())
            .then(like =>{
                const likes = like[0].fields.likes;
                console.log(likes);
                document.querySelector(`#like-count${post}`).innerHTML = likes;
                console.log()
                hide(`like${post}`)
                show(`unlike${post}`)
    
        })
        })
    }
    else if(status === 'unlike'){
        fetch(`/remove like/${post}`,{
            method: "PUT",
            body: JSON.stringify({
                likes: 'unlike'
            })
        })
        .then(()=>{
            // Update the likes without user refreshing
            fetch(`/update like/${post}`)
            .then(response => response.json())
            .then(like =>{
                const likes = like[0].fields.likes;
                console.log(`like-count${post}`);
                document.querySelector(`#like-count${post}`).innerHTML = likes;
                hide(`unlike${post}`)
                show(`like${post}`)
    
    
        })
        })

    }
    else if (status === 'like_r'){
        fetch(`/add like/${post}`,{
            method: "PUT",
            body: JSON.stringify({
                likes: 'like_r'
            })
        })
        .then(()=>{
            // Update the likes without user refreshing
            fetch(`/update like_r/${post}`)
            .then(response => response.json())
            .then(like =>{
                const likes = like[0].fields.likes;
                console.log(likes);
                document.querySelector(`#like-count${post}`).innerHTML = likes;
                console.log()
                hide(`like${post}`)
                show(`unlike${post}`)
    
        })
        })
    }
    else if (status === 'unlike_r'){
        fetch(`/remove like/${post}`,{
            method: "PUT",
            body: JSON.stringify({
                likes: 'unlike_r'
            })
        })
        .then(()=>{
            // Update the likes without user refreshing
            fetch(`/update like_r/${post}`)
            .then(response => response.json())
            .then(like =>{
                const likes = like[0].fields.likes;
                console.log(`like-count${post}`);
                document.querySelector(`#like-count${post}`).innerHTML = likes;
                hide(`unlike${post}`)
                show(`like${post}`)
    
    
        })
        })

    }
    
}

// Function to handle the following
function to_follow(event, follow){
    //routin
    event.preventDefault();
    console.log("one")

    // Follow the account using API
    fetch(`follow/${follow}`,{
        method: "PUT",
        body: JSON.stringify({
            add: 'follow'
        })
    })
    .then(() =>{
        console.log('done')
        fetch(`/show user/${follow}`)
        .then(response => response.json())
        .then(user => {
            document.querySelector("#followers-count").innerHTML = `followers:${user[0].fields.followers_count}`;
            document.querySelector("#following-count").innerHTML = `following:${user[0].fields.following_count}`;
            // Check if user is followed
            fetch(`/check follow/${follow}`)
            .then(response => response.json())
            .then(follow_a =>{
                if(follow_a[0].fields.follow_status == true){
                    hide(`follow-button`)
                    show(`unfollow-button`)
                }
                else{
                    hide(`unfollow-button`)
                    show(`follow-button`)
                }
            })

        })
    })

}

// Function to handle the unfollowing
function to_unfollow(event, follow){
    //routin
    event.preventDefault();
    console.log("two")

    // Follow the account using API
    fetch(`follow/${follow}`,{
        method: "PUT",
        body: JSON.stringify({
            add: 'unfollow'
        })
    })
    .then(() =>{
        console.log('done')
        fetch(`/show user/${follow}`)
        .then(response => response.json())
        .then(user => {
            document.querySelector("#followers-count").innerHTML = `followers:${user[0].fields.followers_count}`;
            document.querySelector("#following-count").innerHTML = `following:${user[0].fields.following_count}`;
            // Check if user is followed
            fetch(`/check follow/${follow}`)
            .then(response => response.json())
            .then(follow_a =>{
                if(follow_a[0].fields.follow_status == true){
                    hide(`follow-button`)
                    show(`unfollow-button`)
                }
                else{
                    hide(`unfollow-button`)
                    show(`follow-button`)
                }
            })

        })
    })

}

// Function to show the profile of a user
function load_profile(event, user){
    // routin
    event.preventDefault();

    // Hide all elements and show intendent
    set_none();
    show('user-info');
    
    // Check if the request is the user himself
    var user_in;
    if (user === 'me'){
        user_in = JSON.parse(document.getElementById('user_id').textContent);
        console.log(user_in)
    }else{
        user_in = user;
    }

    

    // GET information and show it
    fetch(`/show user/${user_in}`)
    .then(response => response.json())
    .then(user_a =>{
        console.log(user_a[0].fields.username)
        console.log(user_a)

        // Felling elemnts with data
        document.querySelector("#username-col").innerHTML = `${user_a[0].fields.username}`;
        document.querySelector("#followers-count").innerHTML = `followers:${user_a[0].fields.followers_count}`;
        document.querySelector("#following-count").innerHTML = `following:${user_a[0].fields.following_count}`;
        document.querySelector("#follow-button").addEventListener('click', () =>to_follow(event, user));
        document.querySelector("#unfollow-button").addEventListener('click', ()=>to_unfollow(event, user));
        
        // Check if user is followed
        fetch(`/check follow/${user_in}`)
        .then(response => response.json())
        .then(follow =>{
            if(follow[0].fields.follow_status == true){
                hide(`follow-button`)
                show(`unfollow-button`)
            }
            else{
                hide(`unfollow-button`)
                show(`follow-button`)
            }
        })

        // Get the posts
        fetch(`load profile posts/${user_in}`)
        .then(response => response.json())
        .then(posts =>{
            // Print the result
            console.log(posts);
            // delete existing layer before addid new one
            if (document.querySelector('#list-group-id-user') !==null){
                document.querySelector('#list-group-id-user').remove()
            }
            if(document.querySelector("#list-group-container-id")!==null){
                document.querySelector("#list-group-container-id").remove()
            }
            // Make a group list to contain the posts
            const list_group_container = document.createElement('ul');
            list_group_container.className = 'list-group';
            list_group_container.id = 'list-group-id-user'
            document.querySelector('#user-only-posts').append(list_group_container);
            // Loop over the posts
            let i = 0;
            posts.forEach((post) =>{
                console.log(post.fields.user_name)

                // Make the group-item elements
                const list_group_item = document.createElement('li');
                // Give it a class
                list_group_item.className = 'list-group-item';
                // Give an id
                list_group_item.id = `post${post.pk}`
                // Add the data to the element
                list_group_item.innerHTML =`<label id="id${i}" class="user-name-class">${post.fields.user_name} </label> <div class="post-content-class list-group-item">${post.fields.content_post}</div> <div class="row justify-content-center"><div class="col">${post.fields.time_post}</div> <div id="like${post.pk}" class="col"><i class="bi bi-heart like-class"></i></div><div id="unlike${post.pk}" class="col"><i class="bi bi-heart-fill unlike-class"></i></div><div id="like-count${post.pk}" class="col">${post.fields.likes}</div></div> <div id="reply-div${post.pk}"><label id="reply${post.pk}" class="row reply-button-class">Reply</label><label id="show-reply${post.pk}" class="row reply-button-class">Show Replys</label></div><div class="container-fluid" id="reply-container"></div>`;                                            
                // Add the element to the group
                list_group_container.append(list_group_item);
                fetch(`/update like/${post.pk}`)
                .then(response => response.json())
                .then(like =>{
                    const likes = like[0].fields.likes;
                    console.log(likes);
                    if (likes == 0){
                        hide(`unlike${post.pk}`)
                        show(`like${post.pk}`)
                    }
                    else{
                        hide(`like${post.pk}`)
                        show(`unlike${post.pk}`)
                    }
                    
        
            })

                // Check if user wants to update the likes or view a profile
                document.querySelector(`#id${i}`).addEventListener('click', () => load_profile(event, post.fields.user));
                document.querySelector(`#like${post.pk}`).addEventListener('click', () => add_like(event, post.pk, 'like'));
                document.querySelector(`#unlike${post.pk}`).addEventListener('click', () => add_like(event, post.pk, 'unlike'))
                document.querySelector(`#show-reply${post.pk}`).addEventListener('click', () => {
                    fetch(`/show reply/${post.pk}`)
                    .then(response => response.json())
                    .then(replys =>{
                        fetch("/user auth")
                        .then(response => response.json())
                        .then(user_r =>{
                            // Make a group list to contain the posts
                            console.log(replys)
                            const list_group_container_r = document.createElement('ul');
                            list_group_container.className = 'list-group';
                            document.querySelector(`#reply-container${post.pk}`).append(list_group_container_r);
                            let k = 0
                            // Loop over replys
                            replys.forEach(reply => {
                                // Make the group-item elements
                                const list_group_item_r = document.createElement('li');
                                // Give it a class
                                list_group_item_r.className = 'list-group-item';
                                // Give an id
                                list_group_item_r.id = `post${reply.pk}`
                                // Add the data to the element
                                list_group_item_r.innerHTML = `<label id="id${k}" class="user-name-class">${reply.fields.user_name} </label> <div class="post-content-class list-group-item">${reply.fields.content_post}</div> <div class="row justify-content-center"><div class="col">${reply.fields.time_post}</div> <div id="like${reply.pk}" class="col"><i class="bi bi-heart like-class"></i></div><div id="unlike${reply.pk}" class="col"><i class="bi bi-heart-fill unlike-class"></i></div><div id="like-count${reply.pk}" class="col">${reply.fields.likes}</div></div> <div id="reply-div${reply.pk}"><label id="reply${reply.pk}" class="row reply-button-class">Reply</label></div><div class="container-fluid" id="reply-container"></div>`;
                                // Add the element to the group
                                list_group_container_r.append(list_group_item_r);
                                fetch(`/update like_r/${reply.pk}`)
                                .then(response => response.json())
                                .then(like =>{
                                    const likes = like[0].fields.likes;
                                    console.log(likes);
                                    if (likes == 0){
                                        hide(`unlike${reply.pk}`)
                                        show(`like${reply.pk}`)
                                    }
                                    else{
                                        hide(`like${reply.pk}`)
                                        show(`unlike${reply.pk}`)
                                    }
                                    
                                })
                                // Check if user is the poster
                                if (user_r[0].pk === reply.fields.user)
                                {
                                    const edit_button_r = document.createElement('label')
                                    edit_button_r.id = `edit-button${reply.pk}`
                                    edit_button_r.className = 'edit-button-class'
                                    edit_button_r.innerHTML = 'Edit'
                                    list_group_item_r.append(edit_button_r)
                                    document.querySelector(`#edit-button${reply.pk}`).addEventListener('click', () => edit(event, reply.pk, reply.fields.content_post))
                                }
                                // Check if user wants to update the likes or view a profile
                                document.querySelector(`#id${k}`).addEventListener('click', () => load_profile(event, reply.fields.user));
                                document.querySelector(`#like${reply.pk}`).addEventListener('click', () => add_like(event, reply.pk, 'like_r'));
                                document.querySelector(`#unlike${reply.pk}`).addEventListener('click', () => add_like(event, reply.pk, 'unlike_r'));                                
                            });
                        })
                        
                    })
                })
                document.querySelector(`#reply${post.pk}`).addEventListener('click', () => {
                    const reply_button_create = document.createElement('button')
                    reply_button_create.type = 'button'
                    reply_button_create.className = 'btn btn-primary'
                    reply_button_create.id = `reply-button${post.pk}` 
                    reply_button_create.innerHTML = 'Reply'
                    document.querySelector(`#reply-card`).append(reply_button_create)
                    document.querySelector(`#reply-div${post.pk}`).append(document.querySelector("#reply-card"));
                    show('reply-card');
                    document.querySelector(`#reply-button${post.pk}`).addEventListener('click', () =>{
                        hide("reply-card")
                        document.querySelector(`#reply-button${post.pk}`).remove()
                        // routin
                        console.log('reply')
    
                        // Get form info
                        const form = document.querySelector("#reply-input")
                        const form_value = form.value
                        //Posting the form using API
                        fetch(`/reply`,{
                            method: "POST",
                            body: JSON.stringify({
                                reply: form_value,
                                post_id: post.pk
                            })
                        })
                        .then(response => response.json())
                        .then(results =>{
                            console.log(results)
                            fetch(`/show reply/${post.pk}`)
                            .then(response => response.json())
                            .then(replys =>{
                                fetch("/user auth")
                                .then(response => response.json())
                                .then(user_r =>{
                                    // Make a group list to contain the posts
                                    console.log(replys)
                                    const list_group_container_r = document.createElement('ul');
                                    list_group_container_r.className = 'list-group';
                                    document.querySelector(`#reply-container${post.pk}`).append(list_group_container_r);
                                    let k = 0
                                    // Loop over replys
                                    replys.forEach(reply => {
                                        // Make the group-item elements
                                        const list_group_item_r = document.createElement('li');
                                        // Give it a class
                                        list_group_item_r.className = 'list-group-item';
                                        // Give an id
                                        list_group_item_r.id = `post${reply.pk}`
                                        // Add the data to the element
                                        list_group_item_r.innerHTML = `<label id="id${k}" class="user-name-class">${reply.fields.user_name} </label> <div class="post-content-class list-group-item">${reply.fields.content_post}</div> <div class="row justify-content-center"><div class="col">${reply.fields.time_post}</div> <div id="like${reply.pk}" class="col"><i class="bi bi-heart like-class"></i></div><div id="unlike${reply.pk}" class="col"><i class="bi bi-heart-fill unlike-class"></i></div><div id="like-count${reply.pk}" class="col">${reply.fields.likes}</div></div> <div id="reply-div${reply.pk}"><label id="reply${reply.pk}" class="row reply-button-class">Reply</label></div><div class="container-fluid" id="reply-container"></div>`;
                                        // Add the element to the group
                                        list_group_container_r.append(list_group_item_r);
                                        fetch(`/update like_r/${reply.pk}`)
                                        .then(response => response.json())
                                        .then(like =>{
                                            const likes = like[0].fields.likes;
                                            console.log(likes);
                                            if (likes == 0){
                                                hide(`unlike${reply.pk}`)
                                                show(`like${reply.pk}`)
                                            }
                                            else{
                                                hide(`like${reply.pk}`)
                                                show(`unlike${reply.pk}`)
                                            }
                                            
                                        })
                                        // Check if user is the poster
                                        if (user_r[0].pk === reply.fields.user)
                                        {
                                            const edit_button_r = document.createElement('label')
                                            edit_button_r.id = `edit-button${reply.pk}`
                                            edit_button_r.className = 'edit-button-class'
                                            edit_button_r.innerHTML = 'Edit'
                                            list_group_item_r.append(edit_button_r)
                                            document.querySelector(`#edit-button${reply.pk}`).addEventListener('click', () => edit(event, reply.pk, reply.fields.content_post))
                                        }
                                        // Check if user wants to update the likes or view a profile
                                        document.querySelector(`#id${k}`).addEventListener('click', () => load_profile(event, reply.fields.user));
                                        document.querySelector(`#like${reply.pk}`).addEventListener('click', () => add_like(event, reply.pk, 'like_r'));
                                        document.querySelector(`#unlike${reply.pk}`).addEventListener('click', () => add_like(event, reply.pk, 'unlike_r'));                                
                                    });
                                })
                                
                            })
                        })
                    })
                    
                    
                });



                i++;

        })
        
        
    })
    
})}

// load only user following posts
function load_only_following(event){
    // routin
    event.preventDefault();
    console.log('hi');

    // Hide all elements then show intendent
    set_none();
    show('new-post');
    show('posts');

    // Getting posts
    fetch('/show following')
    .then(response => response.json())
    .then(posts => {
        // Print the result
        console.log(posts);
        // Make a group list to contain the posts
        const list_group_container = document.createElement('ul');
        list_group_container.className = 'list-group';
        document.querySelector('#posts-container').append(list_group_container);
        // Loop over the posts
        let i = 0;
        posts.forEach((post) =>{
            console.log(post.fields.user_name)

            // Make the group-item elements
            const list_group_item = document.createElement('li');
            // Give it a class
            list_group_item.className = 'list-group-item';
            // Give an id
            list_group_item.id = `post${post.pk}`
            // Add the data to the element
            list_group_item.innerHTML =`<div id="id${i}">${post.fields.user_name} </div> <div>${post.fields.content_post}</div> <div>${post.fields.time_post}</div> <div id="like${i}">Like</div><div id="like-count${post.pk}">${post.fields.likes}</div>`;
            // Add the element to the group
            list_group_container.append(list_group_item);

            // Check if user wants to update the likes or view a profile
            document.querySelector(`#id${i}`).addEventListener('click', () => load_profile(event, post.fields.user));
            document.querySelector(`#like${i}`).addEventListener('click', () => add_like(event, post.pk));
            i++;
        })
        
    })

}

// Add button to edit posts
function edit(event, post, post_content){
    // routin
    event.preventDefault()
    console.log('working motherfucker')

    // Get the post element
    const post_element = document.querySelector(`#`)
    post_element.innerHTML = a
}

// Function to handle the replys
function add_reply(event, post){
    // routin
    event.preventDefault();
    console.log(`reply${post}`);
    
    

}
